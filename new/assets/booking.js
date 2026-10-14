/* BodyLab.Beauty – новый дизайн: ДЕМО страницы записи.
   Ничего не отправляется. Время генерируется: так видно, как выглядит интерфейс.
   Когда дизайн утвердим, этот интерфейс подключится к настоящему календарю. */
(function(){
  var B = window.BL, $ = B.$, $$ = B.$$;

  var OPTIONS = [
    {id:'r-sleek',      name:'R-Sleek',       tag:'Массаж моделирования тела', min:45, price:35, img:'/images/service-rsleek.jpg'},
    {id:'b-flexy',      name:'B-Flexy',       tag:'Вакуумно-роликовый массаж', min:45, price:30, img:'/images/service-bflexy.jpg'},
    {id:'ems-zero-1',   name:'EMS Zero',      tag:'1 процедура',               min:30, price:20, img:'/images/service-emszero.jpg'},
    {id:'ems-zero-2',   name:'EMS Zero',      tag:'2 процедуры подряд',        min:60, price:35, img:'/images/service-emszero.jpg'},
    {id:'presoterapija',name:'Прессотерапия', tag:'Лимфодренаж',               min:45, price:25, img:'/images/service-presoterapija.jpg'}
  ];
  var MONTHS = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
  var MONTHS_G = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  var WD = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
  var WD_S = ['вс','пн','вт','ср','чт','пт','сб'];

  var st = {opt:null, date:null, time:null, step:1, mi:0};
  var today = new Date(); today.setHours(0,0,0,0);
  var first = new Date(today.getFullYear(), today.getMonth(), 1);

  /* генерируем «доступность»: воскресенье выходной, часть дней занята */
  function seed(d){ return (d.getDate()*7 + d.getMonth()*13 + d.getFullYear()) % 11; }
  function dayOpen(d){ return d > today && d.getDay() !== 0 && seed(d) % 5 !== 0 && (d - today) < 1000*60*60*24*75; }
  function slots(d, min){
    var out = [];
    for(var h=10; h*60 + min <= 20*60; h++){
      var t = h + ':00'; if((seed(d)+h) % 3 === 0) continue; out.push(t);
      if(min <= 30 && h < 19 && (seed(d)+h) % 2 === 0) out.push(h + ':30');
    }
    return out.length ? out : ['12:00'];
  }

  function fmtDate(d){ return WD_S[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS_G[d.getMonth()]; }
  function setRow(id, val){
    var el = $('#'+id); if(!el) return;
    el.innerHTML = val ? val : '<b class="dash">—</b>';
  }
  function renderSummary(){
    var o = st.opt;
    setRow('s-name', o ? o.name + '<br><small style="font-weight:500;color:#A39C93">' + o.tag + '</small>' : '');
    setRow('s-min', o ? o.min + ' мин' : '');
    setRow('s-date', st.date ? fmtDate(st.date) : '');
    setRow('s-time', st.time || '');
    $('#s-total').innerHTML = o ? o.price + ' €' : '0 €';
  }

  /* шаг 1 */
  var grid = $('#optgrid');
  grid.innerHTML = OPTIONS.map(function(o){
    return '<button type="button" class="opt" data-id="'+o.id+'" aria-pressed="false"><img src="'+o.img+'" alt="" loading="lazy">'+
      '<div><h3>'+o.name+'</h3><p>'+o.tag+'</p><div class="pr2">'+o.min+' мин · '+o.price+' €</div></div>'+
      '<span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></button>';
  }).join('');
  function pick(id){
    st.opt = OPTIONS.filter(function(o){return o.id===id})[0] || null;
    st.time = null; if(st.date && !dayOpen(st.date)) st.date = null;
    $$('.opt',grid).forEach(function(b){ var on = b.dataset.id===id; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); });
    $('#go2').disabled = !st.opt;
    renderSummary();
  }
  grid.addEventListener('click',function(e){ var b = e.target.closest('.opt'); if(b) pick(b.dataset.id); });

  /* шаг 2: календарь */
  function renderCal(){
    var m = new Date(first.getFullYear(), first.getMonth() + st.mi, 1);
    $('#cal-title').textContent = MONTHS[m.getMonth()] + ' ' + m.getFullYear();
    $('#cal-prev').disabled = st.mi === 0;
    $('#cal-next').disabled = st.mi >= 2;
    var off = (m.getDay() + 6) % 7, n = new Date(m.getFullYear(), m.getMonth()+1, 0).getDate(), html = '', k = 0;
    for(var i=0;i<off;i++) html += '<span class="day empty"></span>';
    for(var d=1; d<=n; d++){
      var dt = new Date(m.getFullYear(), m.getMonth(), d), ok = dayOpen(dt);
      var sel = st.date && +st.date === +dt;
      html += '<button type="button" class="day '+(ok?'ok':'off')+(sel?' sel':'')+'" '+(ok?'':'disabled ')+'data-t="'+(+dt)+'" style="--k:'+(k++)+'">'+d+'</button>';
    }
    $('#days').innerHTML = html;
  }
  function renderTimes(){
    var box = $('#times-box');
    if(!st.date){ box.hidden = true; return; }
    box.hidden = false;
    $('#times-title').textContent = 'Свободное время · ' + WD[st.date.getDay()] + ', ' + st.date.getDate() + ' ' + MONTHS_G[st.date.getMonth()];
    $('#times').innerHTML = slots(st.date, st.opt.min).map(function(t,i){
      return '<button type="button" class="tm'+(st.time===t?' sel':'')+'" data-t="'+t+'" style="--k:'+i+'">'+t+'</button>';
    }).join('');
  }
  $('#cal-prev').addEventListener('click',function(){ if(st.mi>0){ st.mi--; renderCal(); } });
  $('#cal-next').addEventListener('click',function(){ if(st.mi<2){ st.mi++; renderCal(); } });
  $('#days').addEventListener('click',function(e){
    var b = e.target.closest('.day.ok'); if(!b) return;
    st.date = new Date(+b.dataset.t); st.time = null;
    $$('.day',$('#days')).forEach(function(x){ x.classList.toggle('sel', x===b); });
    $('#go3').disabled = true; renderTimes(); renderSummary();
    if(!B.reduce) $('#times-box').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $('#times').addEventListener('click',function(e){
    var b = e.target.closest('.tm'); if(!b) return;
    st.time = b.dataset.t;
    $$('.tm',$('#times')).forEach(function(x){ x.classList.toggle('sel', x===b); });
    $('#go3').disabled = false; renderSummary();
  });

  /* навигация по шагам */
  var panes = {1:$('#p1'),2:$('#p2'),3:$('#p3'),4:$('#p4')};
  function go(n){
    var back = n < st.step; st.step = n;
    Object.keys(panes).forEach(function(k){ var p = panes[k]; p.classList.remove('show','back'); });
    var p = panes[n]; void p.offsetWidth; p.classList.add('show'); if(back) p.classList.add('back');
    $$('.stp').forEach(function(s){
      var k = +s.dataset.s;
      s.classList.toggle('on',k===n); s.classList.toggle('done',k<n || n===4);
      s.disabled = !(k < n) || n===4;
    });
    if(n===2){ renderCal(); renderTimes(); }
    var top = $('#bk-main').getBoundingClientRect().top + scrollY - 90;
    if(scrollY > top) scrollTo({top:top,behavior:B.reduce?'auto':'smooth'});
  }
  $('#go2').addEventListener('click',function(){ if(st.opt) go(2); });
  $('#go3').addEventListener('click',function(){ if(st.time) go(3); });
  $$('[data-back]').forEach(function(b){ b.addEventListener('click',function(){ go(+b.dataset.back); }); });
  $$('.stp').forEach(function(s){ s.addEventListener('click',function(){ if(!s.disabled) go(+s.dataset.s); }); });

  /* шаг 3: форма (только проверка полей) */
  function val(id){ return $('#'+id).value.trim(); }
  $('#submit').addEventListener('click',function(){
    var bad = [];
    ['fn','ln'].forEach(function(id){ if(!val(id)) bad.push(id); });
    var digits = val('ph').replace(/\D/g,''); if(digits.length !== 8) bad.push('ph');
    ['fn','ln','ph'].forEach(function(id){ $('#'+id).closest('.fld').classList.toggle('err', bad.indexOf(id) > -1); });
    $('#form-err').textContent = bad.length ? (bad.indexOf('ph')>-1 && val('fn') && val('ln') ? 'Пожалуйста, введите корректный номер телефона для выбранной страны.' : 'Пожалуйста, заполните все обязательные поля.') : '';
    if(bad.length) return;
    var o = st.opt;
    $('#confirm').innerHTML =
      '<div class="srow"><span>Дата</span><span>'+fmtDate(st.date)+'</span></div>'+
      '<div class="srow"><span>Время</span><span>'+st.time+'</span></div>'+
      '<div class="srow"><span>Услуга</span><span>'+o.name+(o.id.indexOf('ems')===0?' · '+o.tag:'')+'</span></div>'+
      '<div class="srow"><span>Имя</span><span>'+esc(val('fn'))+' '+esc(val('ln'))+'</span></div>';
    go(4);
  });
  $$('.fld input').forEach(function(i){ i.addEventListener('input',function(){ i.closest('.fld').classList.remove('err'); }); });
  function esc(s){ return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }

  /* подсказка в демо-кнопках */
  var toast = $('#toast'), tt;
  $$('[data-demo]').forEach(function(b){ b.addEventListener('click',function(){
    toast.textContent = 'Демо: в рабочей версии здесь добавится событие в календарь'; toast.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove('show'); },2800);
  });});

  /* предвыбор из ссылки: ?s=r-sleek (со страницы процедуры) */
  var q = new URLSearchParams(location.search).get('s');
  if(q && OPTIONS.some(function(o){return o.id===q})){ pick(q); go(2); }
  renderSummary();
})();
