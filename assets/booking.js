/* BodyLab.Beauty – online booking (the real one).
 *
 * Reads the studio's free times, lets the visitor pick  date & time -> treatment -> details,
 * and sends the booking to the Make.com webhook. This is the booking logic of the previous site
 * (slots loading / caching / polling, "just booked" suppression, validation, the webhook payload
 * and its X-Booking-Status answer, calendar links, conversion tracking) moved into the new design;
 * the data contract with the backend is unchanged:
 *   GET  SLOTS_PROXY_URL (fallback SLOTS_URL)  ->  [{ start, end, event_id, calendar_id }, ...]
 *   POST BOOK_URL  { event_id, calendar_id, first_name, last_name, phone, instagram, service, comment, ...attribution }
 *        answer header X-Booking-Status: success | taken | (anything else = error)
 *
 * Globals used from /assets/site.js: BB_TEST_MODE, bookingAttribution, trackBookingConversion,
 * setBookingConfirmedUrl. Texts / months / treatment list come from <script id="i18n"> (tools/build.mjs).
 */
(function(){
  var B = window.BL, $ = B.$, $$ = B.$$;
  var I = JSON.parse($('#i18n').textContent), LV = I.live, OPTIONS = I.options;
  var ROOT = document.documentElement.dataset.root || '/';

  var SLOTS_URL = "https://script.google.com/macros/s/AKfycbyUN_pLo0v-laLE7NDLfAZ8bKmyEQt2-jZNyfAX4Wc3fd2PVzq5JxfT8SkUORIcdFiR/exec";
  // Edge-cached copy of SLOTS_URL (Cloudflare Worker, see cloudflare-worker/slots-proxy.js).
  // Apps Script takes 2-6s per request even on a cache hit and caps out at ~30 concurrent executions,
  // so under real traffic every visitor reads from this proxy; SLOTS_URL is the fallback.
  var SLOTS_PROXY_URL = "https://bodylab-slots.bodylab-beauty-riga.workers.dev/";
  var BOOK_URL = "https://hook.eu1.make.com/8kymhypc72w5aw0o7qi6kzabgjh8bajy";

  var SLOTS_CACHE_KEY = 'bb_slots_cache_v1';
  var BOOKED_IDS_KEY = 'bb_booked_ids_v1';
  var BOOKED_SUPPRESS_MS = 20 * 1000; // short safety-net only - the backend self-invalidates on any calendar change
  var FAST_POLL_MS = 8000;
  var FAST_POLL_DURATION_MS = BOOKED_SUPPRESS_MS;
  var SLOTS_POLL_MS = 60000;

  var selectedSlot = null, slotsByDate = {}, monthKeys = [], monthIndex = 0, slotsVerified = false, pickedDateKey = null;
  var opt = null, step = 1, submitting = false;

  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }
  function money(n){ return I.cur.pre + n + (I.cur.suf ? ' ' + I.cur.suf : ''); }

  // ---------- slots: helpers ----------
  function formatTime(dateStr){
    var d = new Date(dateStr);
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }
  function dateKeyOf(dateStr){ return dateStr.slice(0,10); }
  function buildSlotsByDate(slots){
    var byDate = {};
    slots.forEach(function(slot){
      var key = dateKeyOf(slot.start);
      if(!byDate[key]) byDate[key] = [];
      byDate[key].push(slot);
    });
    return byDate;
  }
  function sameSlot(a, b){ return !!a && !!b && (a.event_id === b.event_id || a.start === b.start); }

  // Slots this browser has successfully booked, kept across every loadSlots() call for a bounded window.
  // The backend confirms bookings asynchronously (Make.com webhook -> Google Calendar), so a re-fetch can
  // keep returning a just-booked slot as available for a short while. The window is time-limited so that
  // if the slot is later freed again the site goes back to trusting the server.
  var bookedEventIds;
  try{ bookedEventIds = new Map(Object.entries(JSON.parse(localStorage.getItem(BOOKED_IDS_KEY) || '{}'))); }
  catch(e){ bookedEventIds = new Map(); }
  function persistBookedIds(){
    try{ localStorage.setItem(BOOKED_IDS_KEY, JSON.stringify(Object.fromEntries(bookedEventIds))); }catch(e){ /* storage full/unavailable, ignore */ }
  }
  function markSlotBooked(slot){
    if(!slot || !slot.event_id) return;
    bookedEventIds.set(slot.event_id, Date.now());
    persistBookedIds();
  }
  function stripBookedSlots(byDate){
    var now = Date.now(), expired = false;
    bookedEventIds.forEach(function(ts, id){
      if(now - ts > BOOKED_SUPPRESS_MS){ bookedEventIds.delete(id); expired = true; }
    });
    if(expired) persistBookedIds();
    if(!bookedEventIds.size) return byDate;
    Object.keys(byDate).forEach(function(dateKey){
      byDate[dateKey] = byDate[dateKey].filter(function(s){ return !bookedEventIds.has(s.event_id); });
      if(byDate[dateKey].length === 0) delete byDate[dateKey];
    });
    return byDate;
  }

  // Polls the live backend every ~8s for a short burst after a booking, so the calendar catches up with the
  // real backend quickly in both directions.
  function startFastPolling(){
    var stopAt = Date.now() + FAST_POLL_DURATION_MS;
    var iv = setInterval(function(){
      if(Date.now() > stopAt){ clearInterval(iv); return; }
      loadSlots();
    }, FAST_POLL_MS);
  }

  // ---------- slots: loading ----------
  var slotsLoadPromise = null;
  function loadSlots(){
    if(slotsLoadPromise) return slotsLoadPromise;
    slotsLoadPromise = loadSlotsInner().finally(function(){ slotsLoadPromise = null; });
    return slotsLoadPromise;
  }
  // The proxy is tried first; the direct Apps Script URL is the fallback for retries.
  var SLOTS_SOURCES = [SLOTS_PROXY_URL, SLOTS_URL].filter(Boolean);
  var lastSlotsSuccessAt = 0, slotsErrorRetryMs = 5000, slotsErrorRetryTimer = null;

  async function fetchSlotsOnce(attempt){
    var url = SLOTS_SOURCES[Math.min(attempt, SLOTS_SOURCES.length - 1)];
    // Only the direct Apps Script URL needs cache-busting; the proxy manages its own freshness.
    var bustUrl = url === SLOTS_URL ? url + (url.indexOf('?') !== -1 ? '&' : '?') + 't=' + Date.now() : url;
    var controller = new AbortController();
    // The proxy answers from cache in well under a second, so if it hasn't answered in 6s move on to the
    // direct Apps Script URL, which is legitimately slow and gets more time.
    var timeoutId = setTimeout(function(){ controller.abort(); }, url === SLOTS_URL ? 15000 : 6000);
    try{
      var res = await fetch(bustUrl, { method: 'GET', cache: 'no-store', signal: controller.signal });
      if(!res.ok) throw new Error('bad response');
      return await res.json();
    }finally{
      clearTimeout(timeoutId);
    }
  }

  // Shows a non-clickable preview from the last confirmed slots (localStorage) instantly on load, purely so the
  // calendar doesn't sit on a blank spinner. It is never used to power an actual booking.
  function showCachedSlotsPreview(){
    if(monthKeys.length) return;
    try{
      var cached = JSON.parse(localStorage.getItem(SLOTS_CACHE_KEY) || 'null');
      if(!cached || !Array.isArray(cached.slots) || !cached.slots.length) return;
      slotsByDate = stripBookedSlots(buildSlotsByDate(cached.slots));
      monthKeys = Array.from(new Set(Object.keys(slotsByDate).map(function(k){ return k.slice(0,7); }))).sort();
      monthIndex = 0;
      slotsVerified = false;
      renderCalendar(false);
    }catch(e){ /* corrupt cache, ignore */ }
  }

  async function loadSlotsInner(){
    var currentMonthKey = monthKeys[monthIndex];
    showCachedSlotsPreview();
    try{
      // A short retry gives a request a couple more chances to land outside a slow window before we show an error.
      var RETRY_DELAYS_MS = [1000, 2500], slots;
      for(var attempt = 0; ; attempt++){
        try{
          slots = await fetchSlotsOnce(attempt);
          if(!Array.isArray(slots)) throw new Error('bad payload');
          break;
        }catch(fetchErr){
          if(attempt >= RETRY_DELAYS_MS.length) throw fetchErr;
          await new Promise(function(r){ setTimeout(r, RETRY_DELAYS_MS[attempt]); });
        }
      }

      lastSlotsSuccessAt = Date.now();
      slotsErrorRetryMs = 5000;

      if(slots.length === 0){
        slotsByDate = {}; monthKeys = []; slotsVerified = false;
        showCalMessage(LV.calEmpty, 'empty');
        try{ localStorage.removeItem(SLOTS_CACHE_KEY); }catch(e){}
        renderTimes(); renderSummary();
        return;
      }

      slots.sort(function(a,b){ return new Date(a.start) - new Date(b.start); });
      slotsByDate = stripBookedSlots(buildSlotsByDate(slots));
      monthKeys = Array.from(new Set(Object.keys(slotsByDate).map(function(k){ return k.slice(0,7); }))).sort();
      var preservedIndex = currentMonthKey ? monthKeys.indexOf(currentMonthKey) : -1;
      monthIndex = preservedIndex !== -1 ? preservedIndex : 0;
      slotsVerified = true;
      if(!monthKeys.length){ showCalMessage(LV.calEmpty, 'empty'); renderTimes(); renderSummary(); return; }
      renderCalendar(true);
      renderTimes();
      renderSummary();
      try{ localStorage.setItem(SLOTS_CACHE_KEY, JSON.stringify({ slots: slots })); }catch(e){ /* storage full/unavailable, ignore */ }

    }catch(err){
      // A failed background refresh must not wipe a calendar the visitor is already using - keep the last verified
      // slots (a stale one is caught at submit time by the "taken" answer) and only show the error when there is
      // nothing real to show.
      if(!slotsVerified){
        slotsByDate = {}; monthKeys = [];
        showCalMessage(LV.calError, 'error');
      }
      // Recover on its own instead of making the visitor reload, backing off so a struggling backend isn't hammered.
      clearTimeout(slotsErrorRetryTimer);
      slotsErrorRetryTimer = setTimeout(loadSlots, slotsErrorRetryMs);
      slotsErrorRetryMs = Math.min(slotsErrorRetryMs * 2, 60000);
    }
  }

  // Background tabs don't poll; a tab that comes back into view refreshes right away if its data is getting old.
  function pollSlots(){ if(document.hidden) return; loadSlots(); }
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden && Date.now() - lastSlotsSuccessAt > 30000) loadSlots();
  });

  // ---------- calendar ----------
  var calMsg = $('#cal-msg'), dt = $('#dt'), daysEl = $('#days'), timesEl = $('#times'), timesBox = $('#times-box');
  function showCalMessage(html, kind){
    calMsg.innerHTML = html; calMsg.className = 'cal-msg ' + (kind || ''); calMsg.hidden = false;
    dt.hidden = true;
    $('#go2').disabled = true;
  }
  function renderCalendar(interactive){
    if(interactive === undefined) interactive = slotsVerified;
    var monthKey = monthKeys[monthIndex];
    if(!monthKey) return;
    var ym = monthKey.split('-').map(Number), year = ym[0], month = ym[1];
    var firstDay = new Date(year, month-1, 1);
    var daysInMonth = new Date(year, month, 0).getDate();
    var startOffset = (firstDay.getDay() + 6) % 7;
    var todayKey = new Date().toISOString().slice(0,10);

    $('#cal-title').textContent = I.months[month-1] + ' ' + year;
    $('#cal-prev').disabled = !interactive || monthIndex === 0;
    $('#cal-next').disabled = !interactive || monthIndex === monthKeys.length - 1;

    var html = '', k = 0, i;
    for(i = 0; i < startOffset; i++) html += '<span class="day empty"></span>';
    for(var d = 1; d <= daysInMonth; d++){
      var key = year + '-' + String(month).padStart(2,'0') + '-' + String(d).padStart(2,'0');
      var has = !!slotsByDate[key];
      var cls = 'day ' + (has ? 'ok' : 'off') + (has && !interactive ? ' preview' : '') + (key === todayKey ? ' today' : '') + (key === pickedDateKey ? ' sel' : '');
      html += '<button type="button" class="' + cls + '" data-date="' + key + '"' + ((has && interactive) ? '' : ' disabled') + ' style="--k:' + (k++) + '">' + d + '</button>';
    }
    daysEl.innerHTML = html;

    // preview (not yet verified) state shows a hint; the calendar itself stays visible but not clickable
    if(!interactive){ calMsg.innerHTML = LV.calUpdating; calMsg.className = 'cal-msg hint'; calMsg.hidden = false; }
    else calMsg.hidden = true;
    dt.hidden = false;
    $('#go2').disabled = !selectedSlot;
  }

  function dateLabelFor(dateKey){
    var d = new Date(dateKey + 'T00:00:00');
    return I.wdFull[d.getDay()] + ', ' + I.dateFmt.replace('{wd}, ','').replace('{d}', d.getDate()).replace('{m}', I.monthsDate[d.getMonth()]);
  }
  function renderTimes(){
    var h = $('#times-title');
    var list = pickedDateKey && slotsByDate[pickedDateKey];
    if(!list){
      h.textContent = h.dataset.hint; timesEl.innerHTML = ''; timesBox.classList.remove('has');
      return;
    }
    timesBox.classList.add('has');
    h.textContent = I.freeTime + ' · ' + dateLabelFor(pickedDateKey);
    timesEl.innerHTML = list.map(function(slot, i){
      return '<button type="button" class="tm' + (sameSlot(selectedSlot, slot) ? ' sel' : '') + '" data-i="' + i + '" style="--k:' + i + '">' + formatTime(slot.start) + '</button>';
    }).join('');
  }

  $('#cal-prev').addEventListener('click', function(){ if(monthIndex > 0){ monthIndex--; renderCalendar(); } });
  $('#cal-next').addEventListener('click', function(){ if(monthIndex < monthKeys.length - 1){ monthIndex++; renderCalendar(); } });
  daysEl.addEventListener('click', function(e){
    var b = e.target.closest('.day.ok'); if(!b || b.disabled || !slotsVerified) return;
    pickedDateKey = b.dataset.date;
    if(selectedSlot && dateKeyOf(selectedSlot.start) !== pickedDateKey) selectedSlot = null;
    renderCalendar(); renderTimes(); renderSummary();
  });
  timesEl.addEventListener('click', function(e){
    var b = e.target.closest('.tm'); if(!b) return;
    var list = slotsByDate[pickedDateKey]; if(!list) return;
    selectedSlot = list[+b.dataset.i];
    $$('.tm', timesEl).forEach(function(x){ x.classList.toggle('sel', x === b); });
    $('#form-err').textContent = '';
    renderSummary();
  });

  // ---------- treatment ----------
  var grid = $('#optgrid');
  function renderOptions(){
    grid.innerHTML = OPTIONS.map(function(o){
      var on = opt && opt.id === o.id;
      return '<button type="button" class="opt' + (on ? ' on' : '') + '" data-id="' + o.id + '" aria-pressed="' + (!!on) + '"><img src="' + ROOT + o.img + '" alt="" loading="lazy">' +
        '<div><h3>' + esc(o.name) + '</h3><p>' + esc(o.tag) + '</p><div class="pr2">' + o.min + ' ' + I.min + ' · ' + money(o.price) + '</div></div>' +
        '<span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button>';
    }).join('');
  }
  function optionLabel(o){ return o.name + (o.id.indexOf('ems') === 0 ? ' · ' + o.tag : ''); }
  function pick(id){
    opt = OPTIONS.filter(function(x){ return x.id === id; })[0] || null;
    renderOptions(); renderSummary();
  }
  grid.addEventListener('click', function(e){ var b = e.target.closest('.opt'); if(b) pick(b.dataset.id); });
  $('#picked-x').addEventListener('click', function(){ opt = null; renderOptions(); renderSummary(); });

  // ---------- summary (date, time, treatment – no prices) ----------
  function fmtDate(d){ return I.dateFmt.replace('{wd}', I.wdShort[d.getDay()]).replace('{d}', d.getDate()).replace('{m}', I.monthsDate[d.getMonth()]); }
  function setRow(id, val){ var el = $('#' + id); if(el) el.innerHTML = val ? val : '<b class="dash">—</b>'; }
  function renderSummary(){
    setRow('s-date', selectedSlot ? fmtDate(new Date(selectedSlot.start)) : '');
    setRow('s-time', selectedSlot ? formatTime(selectedSlot.start) : '');
    setRow('s-name', opt ? esc(opt.name) + '<br><small style="font-weight:500;color:#A39C93">' + esc(opt.tag) + ' · ' + opt.min + ' ' + I.min + '</small>' : '');
    var pk = $('#picked');                       // "Treatment: R-Sleek ✕" above the calendar when it was chosen beforehand
    if(opt && step === 1){ pk.hidden = false; $('#picked-t').textContent = I.chosen + ': ' + optionLabel(opt); } else pk.hidden = true;
    $('#go2').disabled = !selectedSlot || !slotsVerified;
    $('#go3').disabled = !opt;
  }

  // ---------- steps ----------
  var panes = { 1: $('#p1'), 2: $('#p2'), 3: $('#p3'), 4: $('#p4') };
  function go(n){
    var back = n < step; step = n;
    Object.keys(panes).forEach(function(k){ panes[k].classList.remove('show','back'); });
    $('#zapis').classList.toggle('is-done', n === 4);
    var p = panes[n]; void p.offsetWidth; p.classList.add('show'); if(back) p.classList.add('back');
    $$('.stp').forEach(function(s){
      var k = +s.dataset.s;
      s.classList.toggle('on', k === n); s.classList.toggle('done', k < n || n === 4);
      s.disabled = !(k < n) || n === 4;
    });
    if(n === 1){ if(monthKeys.length) renderCalendar(); renderTimes(); }
    if(n === 2) renderOptions();
    renderSummary();
    var top = $('#bk-main').getBoundingClientRect().top + scrollY - 80;
    if(scrollY > top) scrollTo({ top: top, behavior: B.reduce ? 'auto' : 'smooth' });
  }
  $('#go2').addEventListener('click', function(){ if(selectedSlot) go(2); });
  $('#go3').addEventListener('click', function(){ if(opt) go(3); });
  $$('[data-back]').forEach(function(b){ b.addEventListener('click', function(){ go(+b.dataset.back); }); });
  $$('.stp').forEach(function(s){ s.addEventListener('click', function(){ if(!s.disabled) go(+s.dataset.s); }); });

  // ---------- toast ----------
  var toast = $('#toast'), toastTimer;
  function showToast(msg){
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 5000);
  }

  // ---------- calendar links in the confirmation ----------
  function toGCalDate(iso){ return iso.replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'); }
  function buildEventDescription(service, fullName){
    return [
      LV.gcalDetails + ' ' + service,
      LV.gcalName + ' ' + fullName,
      LV.gcalAddress + ' Augusta Deglava iela 66, Rīga',
      LV.gcalPhone + ' +371 20 888 805',
      LV.gcalInstagram + ' instagram.com/bodylab.beauty'
    ].join('\n');
  }
  function buildGCalLink(slot, service, fullName){
    var dates = toGCalDate(slot.start) + '/' + toGCalDate(slot.end);
    var text = encodeURIComponent('BodyLab.Beauty - ' + service);
    var details = encodeURIComponent(buildEventDescription(service, fullName));
    var location = encodeURIComponent('Augusta Deglava iela 66, Rīga');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + text + '&dates=' + dates + '&details=' + details + '&location=' + location;
  }
  function icsEscape(str){ return String(str).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n'); }
  var icsObjectUrl = null;
  function buildICSBlobUrl(slot, service, fullName){
    var uid = (slot.event_id || Date.now()) + '@bodylab.beauty';
    var dtStamp = toGCalDate(new Date().toISOString());
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BodyLab.Beauty//Booking//LV', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + uid, 'DTSTAMP:' + dtStamp, 'DTSTART:' + toGCalDate(slot.start), 'DTEND:' + toGCalDate(slot.end),
      'SUMMARY:' + icsEscape('BodyLab.Beauty - ' + service),
      'DESCRIPTION:' + icsEscape(buildEventDescription(service, fullName)),
      'LOCATION:' + icsEscape('Augusta Deglava iela 66, Rīga'),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    if(icsObjectUrl) URL.revokeObjectURL(icsObjectUrl);
    icsObjectUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    return icsObjectUrl;
  }

  // Removes a just-booked slot from local state immediately and remembers it (markSlotBooked), so it stays removed
  // even if a later re-fetch still lists it (the Make.com webhook creates the calendar event asynchronously).
  function removeSlotLocally(slot){
    markSlotBooked(slot);
    startFastPolling();
    var dateKey = dateKeyOf(slot.start), dayList = slotsByDate[dateKey];
    if(!dayList) return;
    var idx = dayList.findIndex(function(s){ return s.event_id === slot.event_id || s.start === slot.start; });
    if(idx === -1) return;
    dayList.splice(idx, 1);
    if(dayList.length === 0) delete slotsByDate[dateKey];
    if(pickedDateKey === dateKey && !slotsByDate[dateKey]) pickedDateKey = null;
  }

  function showConfirmation(slot, o, fullName){
    var d = new Date(slot.start);
    var dd = String(d.getDate()).padStart(2,'0'), mm = String(d.getMonth()+1).padStart(2,'0');
    var label = optionLabel(o);
    $('#confirm').innerHTML =
      '<div class="srow"><span>' + esc(LV.confirmDate.replace(':','')) + '</span><span>' + dd + '.' + mm + '</span></div>' +
      '<div class="srow"><span>' + esc(LV.confirmTime.replace(':','')) + '</span><span>' + formatTime(slot.start) + '</span></div>' +
      '<div class="srow"><span>' + esc(LV.confirmService.replace(':','')) + '</span><span>' + esc(label) + '</span></div>';
    $('#gcal-link').href = buildGCalLink(slot, label, fullName);
    $('#ics-link').href = buildICSBlobUrl(slot, label, fullName);

    go(4);
    removeSlotLocally(slot);
    if(typeof setBookingConfirmedUrl === 'function') setBookingConfirmedUrl(true);
    if(typeof trackBookingConversion === 'function') trackBookingConversion(o.value);
    selectedSlot = null;
    renderSummary();
    loadSlots();
  }

  // Closing the confirmation restores the address bar and re-syncs with the backend.
  $('#conf-close').addEventListener('click', function(){
    if(typeof setBookingConfirmedUrl === 'function') setBookingConfirmedUrl(false);
    selectedSlot = null; pickedDateKey = null; opt = null;
    ['fn','ln','ph','ig','cm'].forEach(function(id){ $('#' + id).value = ''; });
    $('#form-err').textContent = '';
    if(monthKeys.length) renderCalendar();
    go(1); loadSlots();
  });

  function simulatedBookingResponse(){
    console.info('[BB_TEST_MODE] booking simulated, nothing sent to Make.com');
    return { headers: new Headers({ 'X-Booking-Status': 'success' }) };
  }

  // ---------- submit ----------
  var submitBtn = $('#submit'), formError = $('#form-err'), pcSel = $('#pc');
  function val(id){ return $('#' + id).value.trim(); }
  function resetSubmit(){ submitting = false; submitBtn.disabled = false; submitBtn.innerHTML = esc(I.submit) + ' ' + submitArrow; }
  var submitArrow = submitBtn.querySelector('svg') ? submitBtn.querySelector('svg').outerHTML : '';

  submitBtn.addEventListener('click', async function(){
    if(submitting) return;
    var first_name = val('fn'), last_name = val('ln');
    var phoneNumber = val('ph');
    var phone = phoneNumber ? pcSel.value + ' ' + phoneNumber : '';
    var instagram = val('ig'), comment = val('cm');
    var service = opt ? opt.value : '';

    ['fn','ln','ph'].forEach(function(id){ $('#' + id).closest('.fld').classList.remove('err'); });
    if(!first_name || !last_name || !phoneNumber || !service){
      formError.textContent = I.errReq;
      [['fn',first_name],['ln',last_name],['ph',phoneNumber]].forEach(function(p){ if(!p[1]) $('#' + p[0]).closest('.fld').classList.add('err'); });
      return;
    }
    var phoneOption = pcSel.options[pcSel.selectedIndex];
    var phoneDigits = phoneNumber.replace(/\D/g, '');
    var phoneMin = Number(phoneOption && phoneOption.dataset.min || 0);
    var phoneMax = Number(phoneOption && phoneOption.dataset.max || 15);
    if(phoneDigits.length < phoneMin || phoneDigits.length > phoneMax){
      formError.textContent = I.errPhone;
      $('#ph').closest('.fld').classList.add('err');
      return;
    }
    if(!selectedSlot){ formError.textContent = LV.errNoSlot; return; }

    submitting = true; submitBtn.disabled = true; submitBtn.textContent = LV.sending; formError.textContent = '';
    var slot = selectedSlot;
    try{
      // Local preview never reaches Make.com: no real booking, calendar change or message.
      var res = BB_TEST_MODE ? simulatedBookingResponse() : await fetch(BOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({
          event_id: slot.event_id,
          calendar_id: slot.calendar_id,
          first_name: first_name, last_name: last_name, phone: phone, instagram: instagram, service: service, comment: comment
        }, bookingAttribution()))
      });
      var bookingStatus = res.headers.get('X-Booking-Status');

      if(bookingStatus === 'success'){
        resetSubmit();
        showConfirmation(slot, opt, (first_name + ' ' + last_name).trim());
      } else if(bookingStatus === 'taken'){
        resetSubmit();
        selectedSlot = null;
        formError.textContent = LV.errTaken;
        await loadSlots();
        go(1); showToast(LV.errTaken);
      } else {
        formError.textContent = LV.errGeneric; resetSubmit();
      }
    }catch(err){
      formError.textContent = LV.errGeneric; resetSubmit();
    }
  });
  $$('.fld input').forEach(function(i){ i.addEventListener('input', function(){ i.closest('.fld').classList.remove('err'); }); });

  // ---------- links from elsewhere ----------
  // Other pages / buttons ask to start a booking with a treatment already chosen (price cards, quiz, ?book=...).
  function goToBooking(id){
    if(id) pick(id);
    if(selectedSlot && opt) go(3); else go(1);
    scrollTo({ top: $('#zapis').getBoundingClientRect().top + scrollY - 70, behavior: B.reduce ? 'auto' : 'smooth' });
  }
  window.BL.book = { pick: pick, go: go, open: goToBooking, has: function(id){ return OPTIONS.some(function(o){ return o.id === id; }); } };
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-pick]'); if(!a) return;
    var id = a.dataset.pick; if(!window.BL.book.has(id)) return;
    e.preventDefault(); goToBooking(id);
  });

  // Treatment pages (and old links) use  /?book=<treatment>#calendar-card ; the chosen treatment is then preselected.
  // The parameter is removed from the address bar afterwards (other parameters, e.g. utm_*, stay).
  (function preselectFromLink(){
    var url = new URL(location.href), key = url.searchParams.get('book');
    if(!key) return;
    if(window.BL.book.has(key)) pick(key);
    url.searchParams.delete('book');
    try{ history.replaceState(history.state, '', url.pathname + url.search + url.hash); }catch(e){}
  })();

  renderOptions(); renderSummary();
  loadSlots();
  setInterval(pollSlots, SLOTS_POLL_MS);
  if(bookedEventIds.size) startFastPolling();
})();
