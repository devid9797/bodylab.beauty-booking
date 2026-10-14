/* BodyLab.Beauty – новый дизайн: только главная страница (липкие услуги, стопка карточек, счётчики, отзывы) */
(function(){
  var B = window.BL, $ = B.$, $$ = B.$$, reduce = B.reduce;
  var ROOT = document.documentElement.dataset.root || '/';

  /* липкая секция «Услуги» */
  var pin = $('#uslugi');
  if(pin){
    var wins = $$('.win',pin), steps = $$('.step',pin), rail = $('#rail'), cur = -1;
    var setActive = function(i){
      if(i===cur) return; cur = i;
      wins.forEach(function(w,k){ w.classList.toggle('on',k===i); w.classList.toggle('past',k<i); });
      steps.forEach(function(s,k){ s.classList.toggle('on',k===i); });
      rail.style.setProperty('--p', wins.length>1 ? i/(wins.length-1) : 0);
    };
    B.onFrame(function(){
      var r = pin.getBoundingClientRect(), total = r.height - innerHeight;
      var p = Math.min(1,Math.max(0,-r.top/total));
      setActive(Math.min(wins.length-1, Math.floor(p*wins.length)));
    });
    steps.forEach(function(s){ s.addEventListener('click',function(){
      var i = +s.dataset.i, r = pin.getBoundingClientRect(), total = r.height - innerHeight;
      scrollTo({top: scrollY + r.top + total*(i+.5)/wins.length, behavior: reduce?'auto':'smooth'});
    });});
  }

  /* «Как проходит визит»: нижние карточки чуть уменьшаются под верхними */
  var fcards = $$('.fcard');
  if(fcards.length) B.onFrame(function(){
    fcards.forEach(function(c,i){
      var next = fcards[i+1]; if(!next) return;
      var a = c.getBoundingClientRect(), b = next.getBoundingClientRect();
      var overlap = Math.max(0,Math.min(1,(a.bottom - b.top)/a.height));
      c.style.transform = 'scale('+(1-overlap*.05)+')';
      c.style.filter = 'brightness('+(1-overlap*.04)+')';
    });
  });

  /* счётчики */
  $$('[data-count]').forEach(function(el){
    var end = +el.dataset.count, started = false;
    var co = new IntersectionObserver(function(es){
      if(es[0].isIntersecting && !started){ started = true; co.disconnect();
        if(reduce){ el.textContent = end; return; }
        var t0 = performance.now(), dur = 1600;
        (function tick(t){ var k = Math.min(1,(t-t0)/dur); k = 1-Math.pow(1-k,4); el.textContent = Math.round(end*k); if(k<1) requestAnimationFrame(tick); })(t0);
      }
    },{threshold:.6});
    el.textContent = 0; co.observe(el);
  });

  /* отзывы – лента, продублированная для бесшовности */
  var track = $('#rev-track');
  if(track){
    var html = '';
    for(var n=1;n<=10;n++) html += '<div class="rev"><img src="'+ROOT+'images/review-'+n+'.jpg" alt="Отзыв клиента '+n+'" loading="lazy" width="324" height="640"></div>';
    track.innerHTML = html + html;
  }
})();
