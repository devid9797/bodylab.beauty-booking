/* BodyLab.Beauty – новый дизайн: ДЕМО записи (ru / lv / en).
   Порядок: 1) дата и время → 2) процедура → 3) данные.
   Ничего не отправляется. Доступное время генерируется: так видно, как выглядит интерфейс.
   У каждого слота есть «окно» – сколько минут свободно; процедуры, которые в него не помещаются, недоступны.
   В рабочей версии окна и слоты придут из настоящего календаря. Тексты – из <script id="i18n">. */
(function(){
  var B = window.BL, $ = B.$, $$ = B.$$;
  var ROOT = document.documentElement.dataset.root || '/';
  var I = JSON.parse($('#i18n').textContent);
  var OPTIONS = I.options;

  var st = {opt:null, date:null, time:null, free:0, step:1, mi:0};
  var today = new Date(); today.setHours(0,0,0,0);
  var first = new Date(today.getFullYear(), today.getMonth(), 1);

  function money(n){ return I.cur.pre + n + (I.cur.suf ? ' ' + I.cur.suf : ''); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }

  /* генерируем «доступность»: воскресенье выходной, часть дней занята, у слота – свободное окно в минутах */
  function seed(d){ return (d.getDate()*7 + d.getMonth()*13 + d.getFullYear()) % 11; }
  function dayOpen(d){ return d > today && d.getDay() !== 0 && seed(d) % 5 !== 0 && (d - today) < 1000*60*60*24*75; }
  function allSlots(d){
    var out = [], WIN = [90,60,60,120,60,90,45,60,90,60];
    for(var h=10; h<20; h++){
      for(var m=0; m<60; m+=30){
        var k = seed(d) + h*3 + m/30;
        if(k % 4 === 0) continue;                       // занято
        var free = WIN[k % WIN.length];
        out.push({t:h+':'+(m?'30':'00'), free:free});
      }
    }
    return out.length ? out : [{t:'12:00',free:60}];
  }
  function slots(d){                                       // если процедура уже выбрана – только те слоты, куда она помещается
    var list = allSlots(d);
    return st.opt ? list.filter(function(s){ return s.free >= st.opt.min; }) : list;
  }

  function fmtDate(d){ return I.dateFmt.replace('{wd}', I.wdShort[d.getDay()]).replace('{d}', d.getDate()).replace('{m}', I.monthsDate[d.getMonth()]); }
  function setRow(id, val){ var el = $('#'+id); if(el) el.innerHTML = val ? val : '<b class="dash">—</b>'; }
  function renderSummary(){
    var o = st.opt;
    setRow('s-date', st.date ? fmtDate(st.date) : '');
    setRow('s-time', st.time || '');
    setRow('s-name', o ? esc(o.name) + '<br><small style="font-weight:500;color:#A39C93">' + esc(o.tag) + ' · ' + o.min + ' ' + I.min + '</small>' : '');
    var pk = $('#picked');                                  // «Процедура: R-Sleek ✕» над календарём, если выбрана заранее
    if(o && st.step === 1){ pk.hidden = false; $('#picked-t').textContent = I.chosen + ': ' + o.name + (o.id.indexOf('ems')===0 ? ' · ' + o.tag : ''); } else pk.hidden = true;
    var rc = $('#recap');                                    // на телефоне над полями: дата · время · процедура
    if(rc) rc.innerHTML = (st.date ? '<b>'+fmtDate(st.date)+'</b>' : '') + (st.time ? '<span>'+st.time+'</span>' : '') + (o ? '<span>'+esc(o.name)+(o.id.indexOf('ems')===0 ? ' · '+esc(o.tag) : '')+'</span>' : '');
    $('#go3').disabled = !st.opt;
    $('#go2').disabled = !st.time;
  }

  /* шаг 1: календарь и время */
  function renderCal(){
    var m = new Date(first.getFullYear(), first.getMonth() + st.mi, 1);
    $('#cal-title').textContent = I.months[m.getMonth()] + ' ' + m.getFullYear();
    $('#cal-prev').disabled = st.mi === 0;
    $('#cal-next').disabled = st.mi >= 2;
    var off = (m.getDay() + 6) % 7, n = new Date(m.getFullYear(), m.getMonth()+1, 0).getDate(), html = '', k = 0;
    for(var i=0;i<off;i++) html += '<span class="day empty"></span>';
    for(var d=1; d<=n; d++){
      var dt = new Date(m.getFullYear(), m.getMonth(), d), ok = dayOpen(dt) && slots(dt).length > 0;
      var sel = st.date && +st.date === +dt;
      html += '<button type="button" class="day '+(ok?'ok':'off')+(sel?' sel':'')+'" '+(ok?'':'disabled ')+'data-t="'+(+dt)+'" style="--k:'+(k++)+'">'+d+'</button>';
    }
    $('#days').innerHTML = html;
  }
  function renderTimes(){
    var h = $('#times-title');
    if(!st.date){ h.textContent = h.dataset.hint; $('#times').innerHTML = ''; $('#times-box').classList.remove('has'); return; }
    $('#times-box').classList.add('has');
    h.textContent = I.freeTime + ' · ' + I.wdFull[st.date.getDay()] + ', ' + I.dateFmt.replace('{wd}, ','').replace('{d}', st.date.getDate()).replace('{m}', I.monthsDate[st.date.getMonth()]);
    $('#times').innerHTML = slots(st.date).map(function(s,i){
      return '<button type="button" class="tm'+(st.time===s.t?' sel':'')+'" data-t="'+s.t+'" data-f="'+s.free+'" style="--k:'+i+'">'+s.t+'</button>';
    }).join('');
  }
  $('#cal-prev').addEventListener('click',function(){ if(st.mi>0){ st.mi--; renderCal(); } });
  $('#cal-next').addEventListener('click',function(){ if(st.mi<2){ st.mi++; renderCal(); } });
  $('#days').addEventListener('click',function(e){
    var b = e.target.closest('.day.ok'); if(!b) return;
    st.date = new Date(+b.dataset.t); st.time = null; st.free = 0;
    $$('.day',$('#days')).forEach(function(x){ x.classList.toggle('sel', x===b); });
    renderTimes(); renderSummary();
  });
  $('#times').addEventListener('click',function(e){
    var b = e.target.closest('.tm'); if(!b) return;
    st.time = b.dataset.t; st.free = +b.dataset.f;
    if(st.opt && st.opt.min > st.free) st.opt = null;
    $$('.tm',$('#times')).forEach(function(x){ x.classList.toggle('sel', x===b); });
    renderSummary();
  });

  /* шаг 2: процедура (доступны только те, что помещаются в выбранное время) */
  var grid = $('#optgrid');
  function renderOptions(){
    grid.innerHTML = OPTIONS.map(function(o){
      var fits = !st.time || o.min <= st.free, on = st.opt && st.opt.id === o.id;
      return '<button type="button" class="opt'+(on?' on':'')+(fits?'':' off')+'" data-id="'+o.id+'" aria-pressed="'+(!!on)+'"'+(fits?'':' disabled')+'><img src="'+ROOT+o.img+'" alt="" loading="lazy">'+
        '<div><h3>'+esc(o.name)+'</h3><p>'+esc(o.tag)+'</p><div class="pr2">'+o.min+' '+I.min+' · '+money(o.price)+(fits?'':' · <span class="nofit">'+esc(I.noFit.replace('{n}', st.free))+'</span>')+'</div></div>'+
        '<span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button>';
    }).join('');
  }
  function pick(id){
    var o = OPTIONS.filter(function(x){return x.id===id})[0] || null;
    if(o && st.time && o.min > st.free) return;
    st.opt = o; renderOptions(); renderSummary();
    if(st.step === 1){ renderCal(); renderTimes(); }
  }
  grid.addEventListener('click',function(e){ var b = e.target.closest('.opt'); if(b && !b.disabled) pick(b.dataset.id); });
  $('#picked-x').addEventListener('click',function(){ st.opt = null; renderOptions(); renderCal(); renderTimes(); renderSummary(); });

  /* навигация по шагам */
  var panes = {1:$('#p1'),2:$('#p2'),3:$('#p3'),4:$('#p4')};
  function go(n){
    var back = n < st.step; st.step = n;
    Object.keys(panes).forEach(function(k){ panes[k].classList.remove('show','back'); });
    var p = panes[n]; void p.offsetWidth; p.classList.add('show'); if(back) p.classList.add('back');
    $$('.stp').forEach(function(s){
      var k = +s.dataset.s;
      s.classList.toggle('on',k===n); s.classList.toggle('done',k<n || n===4);
      s.disabled = !(k < n) || n===4;
    });
    if(n===1){ renderCal(); renderTimes(); }
    if(n===2) renderOptions();
    renderSummary();
    var top = $('#bk-main').getBoundingClientRect().top + scrollY - 80;
    if(scrollY > top) scrollTo({top:top,behavior:B.reduce?'auto':'smooth'});
  }
  $('#go2').addEventListener('click',function(){ if(st.time) go(2); });
  $('#go3').addEventListener('click',function(){ if(st.opt) go(3); });
  $$('[data-back]').forEach(function(b){ b.addEventListener('click',function(){ go(+b.dataset.back); }); });
  $$('.stp').forEach(function(s){ s.addEventListener('click',function(){ if(!s.disabled) go(+s.dataset.s); }); });

  /* шаг 3: форма (только проверка полей) */
  function val(id){ return $('#'+id).value.trim(); }
  $('#submit').addEventListener('click',function(){
    var bad = [];
    ['fn','ln'].forEach(function(id){ if(!val(id)) bad.push(id); });
    var digits = val('ph').replace(/\D/g,''); if(digits.length !== 8) bad.push('ph');
    ['fn','ln','ph'].forEach(function(id){ $('#'+id).closest('.fld').classList.toggle('err', bad.indexOf(id) > -1); });
    $('#form-err').textContent = bad.length ? (bad.indexOf('ph')>-1 && val('fn') && val('ln') ? I.errPhone : I.errReq) : '';
    if(bad.length) return;
    var o = st.opt;
    $('#confirm').innerHTML =
      '<div class="srow"><span>'+esc(I.sumDate)+'</span><span>'+fmtDate(st.date)+'</span></div>'+
      '<div class="srow"><span>'+esc(I.sumTime)+'</span><span>'+st.time+'</span></div>'+
      '<div class="srow"><span>'+esc(I.sumSvc)+'</span><span>'+esc(o.name)+(o.id.indexOf('ems')===0?' · '+esc(o.tag):'')+'</span></div>'+
      '<div class="srow"><span>'+esc(I.sumName)+'</span><span>'+esc(val('fn'))+' '+esc(val('ln'))+'</span></div>';
    go(4);
  });
  $$('.fld input').forEach(function(i){ i.addEventListener('input',function(){ i.closest('.fld').classList.remove('err'); }); });

  /* подсказка в демо-кнопках */
  var toast = $('#toast'), tt;
  $$('[data-demo]').forEach(function(b){ b.addEventListener('click',function(){
    toast.textContent = I.toast; toast.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove('show'); },2800);
  });});

  /* выбор процедуры снаружи (кнопки цен, тест, ссылка ?s=...): время всё равно выбирается первым */
  function goToBooking(id){
    if(id) pick(id);
    if(st.date && st.time && st.opt) go(2); else go(1);
    var top = $('#zapis').getBoundingClientRect().top + scrollY - 70;
    scrollTo({top:top,behavior:B.reduce?'auto':'smooth'});
  }
  window.BL.book = {pick:pick, go:go, open:goToBooking, has:function(id){ return OPTIONS.some(function(o){return o.id===id}); }};
  document.addEventListener('click',function(e){
    var a = e.target.closest && e.target.closest('[data-pick]'); if(!a) return;
    var id = a.dataset.pick; if(!window.BL.book.has(id)) return;
    e.preventDefault(); goToBooking(id);
  });
  var q = new URLSearchParams(location.search).get('s');
  if(q && OPTIONS.some(function(o){return o.id===q})) pick(q);
  renderOptions(); renderCal(); renderTimes(); renderSummary();
})();
