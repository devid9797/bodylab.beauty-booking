/* BodyLab.Beauty – новый дизайн: продукция Arosha. Плитки открывают окно с описанием (вкладки) и кнопкой «Заказать» (WhatsApp).
   Данные берутся при сборке из основного index.html (<script id="products-data">). */
(function(){
  var node = document.getElementById('products-data'); if(!node) return;
  var B = window.BL, $ = B.$, $$ = B.$$;
  var D = JSON.parse(node.textContent), U = D.ui, ITEMS = {};
  D.items.forEach(function(it){ ITEMS[it.id] = it; });
  var ROOT = document.documentElement.dataset.root || '/';
  var modal = $('#prod-modal'), lastFocus, cur = null, tab = 'desc';
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }

  function panel(it){
    var h;
    if(tab === 'desc') h = '<p>'+esc(it.description)+'</p>';
    else if(tab === 'comp') h = '<ul>'+it.composition.map(function(c){ return '<li><b>'+esc(c[0])+'.</b> '+esc(c[1])+'</li>'; }).join('')+'</ul>';
    else if(tab === 'use') h = '<p>'+esc(it.usage)+'</p>';
    else h = '<ul>'+it.properties.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul>';
    var el = $('#pm-panel'); el.innerHTML = h; el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
  }
  function tabs(it){
    var list = [['desc',U.tabDesc]].concat(it.composition ? [['comp',U.tabComp]] : []).concat([['use',U.tabUse],['props',U.tabProps]]);
    $('#pm-tabs').innerHTML = list.map(function(t){ return '<button type="button" class="ptab'+(t[0]===tab?' on':'')+'" data-t="'+t[0]+'">'+esc(t[1])+'</button>'; }).join('');
  }
  function open(id){
    var it = ITEMS[id]; if(!it) return;
    cur = it; tab = 'desc'; lastFocus = document.activeElement;
    var img = $('#pm-img'); img.src = ROOT + it.img; img.alt = it.name; img.classList.add('zoomable');
    $('#pm-name').textContent = it.name;
    $('#pm-price').textContent = it.price + (it.size ? ' · ' + it.size : '');
    $('#pm-sizes').textContent = it.sizes ? U.sizes + ': ' + it.sizes : '';
    $('#pm-sizes').hidden = !it.sizes;
    tabs(it); panel(it);
    $('#pm-order').href = 'https://api.whatsapp.com/send?phone=37120888805&text=' + encodeURIComponent(U.wa.replace('{product}', it.name));
    modal.hidden = false; document.documentElement.classList.add('lb-open');
    requestAnimationFrame(function(){ modal.classList.add('open'); });
    $('#prod-close').focus();
  }
  function close(){
    modal.classList.remove('open'); document.documentElement.classList.remove('lb-open');
    setTimeout(function(){ modal.hidden = true; },350);
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click',function(e){ var t = e.target.closest && e.target.closest('[data-prod]'); if(t) open(t.dataset.prod); });
  $('#prod-close').addEventListener('click',close);
  modal.addEventListener('click',function(e){ if(e.target === modal) close(); });
  document.addEventListener('keydown',function(e){ if(!modal.hidden && e.key === 'Escape' && !document.querySelector('.lb.open')) close(); });
  $('#pm-tabs').addEventListener('click',function(e){
    var b = e.target.closest('.ptab'); if(!b || !cur) return;
    tab = b.dataset.t; $$('.ptab',$('#pm-tabs')).forEach(function(x){ x.classList.toggle('on',x===b); }); panel(cur);
  });
})();
