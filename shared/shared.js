/* shared scroll engine: Lenis + GSAP ScrollTrigger, word-rise splitter, reveals, progress, cursor */
(function(){
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add(rm?'rm':'js');
  window.A = { rm: rm };
  function split(el){
    var out='';
    el.childNodes.forEach(function(n){
      if(n.nodeType===3){ n.textContent.split(/(\s+)/).forEach(function(t){ out += /^\s+$/.test(t)||!t ? ' ' : '<span class="w"><i>'+t+'</i></span>'; }); }
      else if(n.nodeType===1){ if(n.tagName==='BR'){out+='<br>';} else { var c=n.cloneNode(false); c.innerHTML=''; var inner=document.createElement('div'); inner.appendChild(n.cloneNode(true)); out+= wrapEl(n);} }
    });
    el.innerHTML = out;
    function wrapEl(n){ var tmp=n.cloneNode(false); var words=n.textContent.split(/(\s+)/).map(function(t){return /^\s+$/.test(t)||!t?' ':'<span class="w"><i>'+t+'</i></span>';}).join(''); tmp.innerHTML=words; return tmp.outerHTML; }
  }
  window.A.init = function(extra){
    if(rm){ if(extra) extra(null,null); return; }
    gsap.registerPlugin(ScrollTrigger);
    var lenis = new Lenis({ lerp:.085, smoothWheel:true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
    window.A.lenis = lenis;
    // reveals use IntersectionObserver, not ScrollTrigger, so they fire correctly inside sticky/pinned panels
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting) return; var el=e.target; io.unobserve(el);
      if(el.hasAttribute('data-split')) gsap.fromTo(el.querySelectorAll('.w>i'),{yPercent:110,y:0},{yPercent:0,y:0,duration:1.1,ease:'expo.out',stagger:.045});
      else gsap.to(el,{opacity:1,y:0,duration:1.1,ease:'power3.out',delay:+(el.dataset.delay||0)});
    });},{rootMargin:'0px 0px -10% 0px'});
    document.querySelectorAll('[data-split]').forEach(function(el){ split(el); io.observe(el); });
    document.querySelectorAll('[data-reveal]').forEach(function(el){ io.observe(el); });
    var prog=document.getElementById('prog');
    if(prog) lenis.on('scroll',function(e){ prog.style.transform='scaleX('+(e.progress||0)+')'; });
    var c=document.getElementById('curs');
    if(c && matchMedia('(hover:hover)').matches){
      var x=0,y=0,tx=0,ty=0;
      addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;c.classList.add('on');});
      gsap.ticker.add(function(){x+=(tx-x)*.2;y+=(ty-y)*.2;c.style.transform='translate('+x+'px,'+y+'px)';});
      document.querySelectorAll('a,button,[data-cursor]').forEach(function(a){
        a.addEventListener('pointerenter',function(){c.classList.add('big');});
        a.addEventListener('pointerleave',function(){c.classList.remove('big');});
      });
    }
    if(extra) extra(gsap,ScrollTrigger,lenis);
    addEventListener('load',function(){ScrollTrigger.refresh();});
  };
})();
