/* BodyLab.Beauty – новый дизайн: тест «Подберите процедуру» (10 вопросов).
   Данные (вопросы, баллы, тексты результата) – из <script id="quiz-data">, его собирает new/build.mjs.
   Ничего не отправляется и не сохраняется: считается прямо в браузере. */
(function(){
  var node = document.getElementById('quiz-data'); if(!node) return;
  var B = window.BL, $ = B.$, $$ = B.$$;
  var D = JSON.parse(node.textContent), U = D.ui;
  var ROOT = document.documentElement.dataset.root || '/';
  var N = D.q.length, i = 0, ans = [];
  var start = $('#quiz-start'), run = $('#quiz-run'), res = $('#quiz-res');
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }

  function bar(){ var h=''; for(var k=0;k<N;k++) h += '<i class="'+(k<i?'done':k===i?'on':'')+'"></i>'; $('#quiz-bar').innerHTML = h; }
  function render(){
    var q = D.q[i];
    run.classList.remove('swap'); void run.offsetWidth; run.classList.add('swap');
    $('#quiz-count').textContent = (i+1)+' '+U.of+' '+N;
    $('#quiz-q').textContent = q[0];
    $('#quiz-opts').innerHTML = q[1].map(function(o,k){ return '<button type="button" class="qopt'+(ans[i]===k?' on':'')+'" data-k="'+k+'" style="--k:'+k+'">'+esc(o)+'</button>'; }).join('');
    $('#quiz-back').hidden = i === 0;
    bar();
  }
  function begin(){ i = 0; ans = []; start.hidden = true; res.hidden = true; run.hidden = false; render(); }
  function score(){
    var s = D.ids.map(function(){return 0});
    ans.forEach(function(k,qi){ D.w[qi][k].forEach(function(v,j){ s[j] += v; }); });
    return s;
  }
  function finish(){
    var s = score(), order = D.ids.map(function(id,j){ return {id:id,s:s[j]}; }).sort(function(a,b){ return b.s - a.s; });
    var top = D.results[order[0].id], second = (order[1].s >= order[0].s*0.6 && order[1].s > 0) ? D.results[order[1].id] : null;
    var wantsCourse = ans[7] === 1 && top.pkg;
    var why = top.why.map(function(w){ return '<li>'+esc(w)+'</li>'; }).join('');
    res.innerHTML =
      '<div class="qres-main"><div class="qres-img"><img src="'+ROOT+top.img+'" alt="'+esc(top.name)+'"></div>'+
      '<div class="qres-body"><span class="eyebrow">'+esc(U.resultEyebrow)+'</span>'+
      '<h3 class="h-l"><span class="pearl">'+esc(top.name)+'</span></h3><div class="qres-tag">'+esc(top.tag)+'</div>'+
      '<div class="qres-why"><b>'+esc(U.why)+'</b><ul>'+why+'</ul></div>'+
      (wantsCourse ? '<p class="qres-pkg">'+esc(U.package)+'</p>' : '')+
      '<div class="cta-row"><button class="btn btn-main" type="button" data-qbook="'+top.key+'">'+esc(U.book)+' '+esc(top.name)+'</button>'+
      '<a class="btn btn-ghost" href="'+top.href+'">'+esc(U.more)+'</a></div></div></div>'+
      (second ? '<div class="qres-alt"><span class="eyebrow">'+esc(U.alt)+'</span><div class="qalt"><div><b>'+esc(second.name)+'</b><small>'+esc(second.tag)+'</small></div><a class="btn btn-ghost btn-sm" href="'+second.href+'">'+esc(U.more)+'</a></div></div>' : '')+
      '<p class="qres-note">'+esc(U.note)+'</p><button class="btn btn-ghost btn-sm" type="button" id="quiz-again">'+esc(U.again)+'</button>';
    run.hidden = true; res.hidden = false; res.classList.remove('swap'); void res.offsetWidth; res.classList.add('swap');
    if(B.zoomMark) B.zoomMark(res);
    var top2 = $('#podbor').getBoundingClientRect().top + scrollY - 80; if(scrollY > top2) scrollTo({top:top2,behavior:B.reduce?'auto':'smooth'});
  }

  $('#quiz-go').addEventListener('click',begin);
  $('#quiz-opts').addEventListener('click',function(e){
    var b = e.target.closest('.qopt'); if(!b) return;
    ans[i] = +b.dataset.k; $$('.qopt',run).forEach(function(x){ x.classList.toggle('on',x===b); });
    setTimeout(function(){ if(i < N-1){ i++; render(); } else finish(); }, B.reduce ? 0 : 280);
  });
  $('#quiz-back').addEventListener('click',function(){ if(i>0){ i--; render(); } });
  res.addEventListener('click',function(e){
    if(e.target.id === 'quiz-again'){ begin(); return; }
    var b = e.target.closest('[data-qbook]'); if(b && B.book) B.book.open(b.dataset.qbook);
  });
})();
