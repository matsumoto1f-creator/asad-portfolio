/* GLFX — a tiny WebGL1 image stage: cover-fit photos, noise-dissolve transitions with
   chromatic split on the seam, exposure, zoom, pointer parallax, vignette and film grain.
   No dependencies. Returns null when WebGL is unavailable so the page can keep its <img> fallback.
   Usage: var fx = GLFX(canvas, [url, url], {edge:[1,.2,.1]}); fx.s.p = .5; fx.seq(1.3); */
window.GLFX = function (canvas, urls, opt) {
  opt = opt || {};
  var gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  var VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  var FS = [
    'precision highp float;varying vec2 v;',
    'uniform sampler2D A,B;uniform vec2 RA,RB,R,M;uniform float T,P,EX,ZM,AB,VG,GR,SAT;uniform vec3 EC;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
    'float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}',
    'vec2 cover(vec2 uv,vec2 r){float sa=R.x/R.y,ia=r.x/r.y;vec2 s=sa>ia?vec2(1.,ia/sa):vec2(sa/ia,1.);return (uv-.5)*s+.5;}',
    'vec3 samp(sampler2D t,vec2 uv,float o){return vec3(texture2D(t,uv+vec2(o,0.)).r,texture2D(t,uv).g,texture2D(t,uv-vec2(o,0.)).b);}',
    'void main(){',
    ' vec2 uv=vec2(v.x,1.-v.y);',
    ' vec2 c=(uv-.5)/ZM+.5+M*.014;',
    ' float N=fbm(uv*vec2(3.2,2.4)+T*.04);',
    ' float f=N*.62+(1.-uv.x)*.22+uv.y*.16;',
    ' float th=P*1.5-.25;',
    ' float m=1.-smoothstep(th-.09,th+.09,f);',
    ' float e=1.-abs(m-.5)*2.;e*=step(.001,P)*step(P,.999);',
    ' vec2 d=(vec2(N,fbm(uv*3.+7.))-.5)*.12*e;',
    ' float o=AB*.0035+e*.018;',
    ' vec3 a=samp(A,cover(c+d,RA),o);',
    ' vec3 b=samp(B,cover(c-d,RB),o);',
    ' vec3 col=mix(a,b,m)+EC*e*e*.6;',
    ' col*=EX;',
    ' float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,SAT);',
    ' vec2 q=uv-.5;col*=1.-dot(q,q)*VG;',
    ' col+=(h(uv*R+fract(T)*91.7)-.5)*GR;',
    ' gl_FragColor=vec4(col,1.);',
    '}'].join('\n');
  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(o)); } return o; }
  var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var U = {}; ['A', 'B', 'RA', 'RB', 'R', 'M', 'T', 'P', 'EX', 'ZM', 'AB', 'VG', 'GR', 'SAT', 'EC'].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
  gl.uniform1i(U.A, 0); gl.uniform1i(U.B, 1);
  var tex = [], size = [], loaded = 0;
  var s = { from: 0, to: 1, p: 0, ex: opt.ex == null ? 1 : opt.ex, zm: 1, ab: 0, vg: opt.vg == null ? 1.1 : opt.vg, gr: opt.gr == null ? .045 : opt.gr, sat: 1, mx: 0, my: 0, edge: opt.edge || [1, .3, .1] };
  var api = { s: s, ready: false, onready: null };
  urls.forEach(function (u, i) {
    var t = gl.createTexture(); tex[i] = t; size[i] = [16, 9];
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    var im = new Image(); im.decoding = 'async';
    im.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      size[i] = [im.naturalWidth, im.naturalHeight];
      if (++loaded === urls.length) { api.ready = true; if (api.onready) api.onready(); }
    };
    im.src = u;
  });
  // fractional position through the image list: 1.4 = 40% from image 1 to image 2
  api.seq = function (x) { x = Math.max(0, Math.min(urls.length - 1, x)); var i = Math.min(urls.length - 2, Math.floor(x)); s.from = i; s.to = i + 1; s.p = x - i; };
  api.show = function (i) { s.from = i; s.to = i; s.p = 0; };
  var dpr = Math.min(window.devicePixelRatio || 1, opt.maxDpr || 1.5);
  function resize() { var w = canvas.clientWidth, hh = canvas.clientHeight; if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(hh * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(hh * dpr); } }
  if (!opt.noPointer) addEventListener('pointermove', function (e) { s.tx = (e.clientX / innerWidth - .5); s.ty = (e.clientY / innerHeight - .5); });
  var visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);
  var t0 = performance.now();
  (function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    resize();
    s.mx += ((s.tx || 0) - s.mx) * .05; s.my += ((s.ty || 0) - s.my) * .05;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[s.from]);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex[s.to]);
    gl.uniform2f(U.RA, size[s.from][0], size[s.from][1]); gl.uniform2f(U.RB, size[s.to][0], size[s.to][1]);
    gl.uniform2f(U.R, canvas.width, canvas.height); gl.uniform2f(U.M, s.mx, s.my);
    gl.uniform1f(U.T, (now - t0) / 1000); gl.uniform1f(U.P, s.p); gl.uniform1f(U.EX, s.ex); gl.uniform1f(U.ZM, s.zm);
    gl.uniform1f(U.AB, s.ab); gl.uniform1f(U.VG, s.vg); gl.uniform1f(U.GR, s.gr); gl.uniform1f(U.SAT, s.sat);
    gl.uniform3f(U.EC, s.edge[0], s.edge[1], s.edge[2]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  })(t0);
  return api;
};
