/* Halcyon Chevrolet — site behaviour, jQuery 3.7 + Bootstrap 3.4 (the DealerOn stack).
   Header/footer are injected like CMS partials so every page shares one source. */
(function ($) {
  'use strict';
  var D = window.DEALER, INV = window.INVENTORY, page = $('body').data('page');

  /* ---------- partials ---------- */
  var nav = [
    ['Shop New', 'inventory.html?cond=New', [['All New Inventory', 'inventory.html?cond=New'], ['Silverado 1500', 'inventory.html?model=Silverado+1500'], ['Tahoe', 'inventory.html?model=Tahoe'], ['Corvette', 'inventory.html?model=Corvette'], ['Electric Vehicles', 'inventory.html?model=Blazer+EV']]],
    ['Shop Used', 'inventory.html?cond=Used', [['All Pre-Owned', 'inventory.html?cond=Used'], ['Certified Pre-Owned', 'inventory.html?cond=Certified'], ['Performance Cars', 'inventory.html?body=Coupe']]],
    ['Specials & Financing', 'specials.html', [['New Vehicle Specials', 'specials.html'], ['Service Coupons', 'specials.html#service'], ['Get Pre-Approved', '#', 'lead:Get pre-approved'], ['Payment Calculator', 'vehicle.html?stock=HC26-1142#calc']]],
    ['Service & Parts', 'specials.html#service', [['Schedule Service', '#', 'lead:Schedule service'], ['Service Coupons', 'specials.html#service'], ['Order Parts', '#', 'lead:Order parts']]],
    ['About Us', '#visit', [['Hours & Directions', 'index.html#visit'], ['Contact Us', '#', 'lead:Contact us']]]
  ];
  var hdr = '<a class="sr-only sr-only-focusable" href="#main">Skip to content</a>' +
    '<div class="concept-ribbon">Concept build by Asad Matsumoto. Fictional dealer, not affiliated with Chevrolet, GM or any dealership. <a href="../">Back to the portfolio</a></div>' +
    '<header class="hdr"><div class="container"><div class="top">' +
    '<a class="brand" href="index.html" aria-label="' + D.name + ' home"><span class="oem" aria-hidden="true">HC</span><span><b>' + D.name + '</b><span>' + D.city + ' · Sales, Service &amp; Parts</span></span></a>' +
    '<div class="acts"><a class="btn btn-line hide-sm" href="tel:5550100199">Call ' + D.sales + '</a><a class="btn btn-line hide-sm" href="index.html#visit">Directions</a>' +
    '<a class="btn btn-line saved" href="inventory.html?saved=1" aria-label="Saved vehicles">♥ Saved<i id="savedN">0</i></a>' +
    '<button class="navtog" aria-label="Menu" aria-expanded="false" aria-controls="mega">☰</button></div></div></div>' +
    '<nav class="mega" id="mega" aria-label="Main"><div class="container"><ul>' +
    nav.map(function (n) {
      return '<li><a href="' + n[1] + '" aria-haspopup="true">' + n[0] + '</a><div class="dd">' +
        n[2].map(function (s) { return '<a href="' + s[1] + '"' + (s[2] ? ' data-lead="' + s[2].split(':')[1] + '"' : '') + '>' + s[0] + '</a>'; }).join('') + '</div></li>';
    }).join('') + '</ul></div></nav></header>';
  var ftr = '<footer class="ftr"><div class="container"><div class="row">' +
    '<div class="col-sm-4"><h4>' + D.name + '</h4><p>' + D.street + '</p><p>Sales <a href="tel:5550100199">' + D.sales + '</a><br>Service <a href="tel:5550100142">' + D.service + '</a></p></div>' +
    '<div class="col-sm-2"><h4>Shop</h4><ul><li><a href="inventory.html?cond=New">New</a></li><li><a href="inventory.html?cond=Used">Pre-Owned</a></li><li><a href="specials.html">Specials</a></li></ul></div>' +
    '<div class="col-sm-2"><h4>Service</h4><ul><li><a href="#" data-lead="Schedule service">Schedule</a></li><li><a href="specials.html#service">Coupons</a></li></ul></div>' +
    '<div class="col-sm-4"><h4>Built with</h4><p>Hand-coded HTML5 and CSS3, jQuery 3.7, Bootstrap 3.4 grid, tabs, collapse, modal and carousel. No build step, no framework. Inventory, price stacks and specials all read one data file.</p></div></div>' +
    '<div class="legal">© 2026 ' + D.name + ' (fictional). Prices exclude tax, title, license and registration; advertised prices include the $' + D.docFee + ' documentation fee. All offers expire ' + D.expires + '. Concept website designed and built by Asad Matsumoto.' +
    '<div class="credits">Vehicle photography from Wikimedia Commons: ' + window.PHOTO_CREDITS.map(function (c) { return c[3].indexOf('see ') === 0 ? c[1] + ' (' + c[2] + ')' : '<a href="https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(c[3].replace(/ /g, '_')) + '" rel="noopener">' + c[1] + '</a> (' + c[2] + ')'; }).join(' · ') + '. Stock photos may not represent the actual vehicle.</div></div></div></footer>';
  var modals = '<div class="modal fade" id="discModal" tabindex="-1" role="dialog" aria-labelledby="discT"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="discT">Disclaimer</h4></div><div class="modal-body" id="discB"></div></div></div></div>' +
    '<div class="modal fade" id="leadModal" tabindex="-1" role="dialog" aria-labelledby="leadT"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="leadT">Confirm availability</h4><div id="leadV" class="text-muted small"></div></div>' +
    '<form class="modal-body" id="leadF"><div class="row"><div class="col-xs-6"><label for="lf1">First name</label><input class="form-control" id="lf1" autocomplete="given-name" required></div><div class="col-xs-6"><label for="lf2">Last name</label><input class="form-control" id="lf2" autocomplete="family-name" required></div></div>' +
    '<label for="lf3" style="margin-top:10px">Email</label><input class="form-control" id="lf3" type="email" autocomplete="email" required><label for="lf4" style="margin-top:10px">Phone</label><input class="form-control" id="lf4" type="tel" autocomplete="tel">' +
    '<label class="consent"><input type="checkbox" required> By submitting, I agree to be contacted by ' + D.name + ' at the contact information I provided.</label>' +
    '<button class="btn btn-cta btn-block" style="margin-top:14px">Send</button><div class="ok" role="status">Concept form, so nothing was sent. On a live dealer site this posts to the CRM as an ADF/XML lead with the vehicle attached.</div></form></div></div></div>';
  $('body').prepend(hdr).append(ftr + modals);
  $('#mega>div>ul>li>a').each(function () { var h = $(this).attr('href'); if (h && h.split('?')[0] === location.pathname.split('/').pop()) $(this).closest('.mega>div>ul>li').children('a').attr('aria-current', 'page'); });

  /* menu: hover on desktop, tap/keyboard everywhere */
  $('#mega>div>ul>li').on('mouseenter', function () { if (innerWidth > 900) $(this).addClass('open'); }).on('mouseleave', function () { $(this).removeClass('open'); })
    .on('focusin', function () { $(this).addClass('open'); }).on('focusout', function (e) { var li = this; setTimeout(function () { if (!$.contains(li, document.activeElement)) $(li).removeClass('open'); }, 0); });
  $('.navtog').on('click', function () { var o = $('#mega').toggleClass('show').hasClass('show'); $(this).attr('aria-expanded', o); });

  /* saved vehicles (per-browser convenience) */
  function savedList() { try { return JSON.parse(localStorage.getItem('hc-saved') || '[]'); } catch (e) { return []; } }
  function setSaved(l) { try { localStorage.setItem('hc-saved', JSON.stringify(l)); } catch (e) {} $('#savedN').text(l.length); }
  $('#savedN').text(savedList().length);
  $(document).on('click', '[data-save]', function () {
    var s = $(this).data('save'), l = savedList(), i = l.indexOf(s);
    if (i < 0) l.push(s); else l.splice(i, 1); setSaved(l);
    $(this).attr('aria-pressed', i < 0).text(i < 0 ? '♥' : '♡');
  });

  /* shared modals */
  $(document).on('click', '[data-disc]', function () { $('#discT').text($(this).data('title') || 'Disclaimer'); $('#discB').text($(this).data('disc')); $('#discModal').modal('show'); });
  $(document).on('click', '[data-lead]', function (e) {
    e.preventDefault(); var v = $(this).data('stock') ? INV.filter(function (x) { return x.stock === $(this).data('stock'); }.bind(this))[0] : null;
    $('#leadT').text($(this).data('lead')); $('#leadV').text(v ? titleOf(v) + ' · Stock ' + v.stock : D.name); $('#leadF .ok').hide(); $('#leadF')[0].reset(); $('#leadModal').modal('show');
  });
  $('#leadF').on('submit', function (e) { e.preventDefault(); $(this).find('.ok').show(); });

  /* promo strip: expires itself, so a stale seasonal banner can never outlive its offer */
  $('[data-expires]').each(function () { if (new Date() > new Date($(this).data('expires') + 'T23:59:59')) $(this).remove(); });

  /* ---------- price stack markup, shared by SRP and VDP ---------- */
  window.stackHTML = function (v, id, open) {
    var p = priceOf(v), label = D.short + ' Price';
    var lines = p.lines.map(function (l) {
      return '<li' + (l.s ? ' class="s"' : '') + '><button type="button" class="dz" data-title="' + l.k + '" data-disc="' + l.d + '">' + l.k + '</button><span>' + money(l.v) + '</span></li>';
    }).join('') + '<li class="tot"><span>' + label + '</span><span>' + money(p.price) + '</span></li>';
    var cond = (v.conditional || []).map(function (c) { return '<div class="cond">Conditional offer: ' + c.name + ' ' + money(-c.amt) + ' <button type="button" class="dz" data-title="' + c.name + '" data-disc="Requires proof of eligibility at time of purchase. Not everyone will qualify. Shown separately from the price everyone pays.">details</button></div>'; }).join('');
    return '<div class="ps"><div class="feat">' + (p.savings ? '<div class="sv"><b>' + money(p.savings) + '</b>Savings</div>' : '<div class="sv" style="color:var(--mut)"><b style="color:var(--ink)">' + (v.cond === 'New' ? 'MSRP' : 'Fair') + '</b>' + (v.cond === 'New' ? 'Priced at sticker' : 'Market priced') + '</div>') +
      '<div class="pr">' + label + '<b>' + money(p.price) + '</b></div></div>' +
      '<button type="button" class="more" data-toggle="collapse" data-target="#' + id + '" aria-expanded="' + !!open + '" aria-controls="' + id + '">' + (open ? 'Price details' : 'More') + '</button>' +
      '<div class="collapse' + (open ? ' in' : '') + '" id="' + id + '"><ul>' + lines + '</ul>' + cond + '</div></div>';
  };
  function badges(v) { return (v.badges || []).map(function (b) { return '<span class="' + ({ 'Price Drop': 'pd', 'In Transit': 'tr', 'Electric': 'ev' }[b] || '') + '">' + b + '</span>'; }).join(''); }
  window.cardHTML = function (v, i) {
    var saved = savedList().indexOf(v.stock) > -1;
    return '<article class="vcard" data-stock="' + v.stock + '"><a class="ph" href="vehicle.html?stock=' + v.stock + '" aria-label="' + titleOf(v) + '"><img src="' + imgSrc(v.imgs[0]) + '" alt="' + titleOf(v) + ', ' + v.ext[0] + '" loading="lazy"><span class="bdg">' + badges(v) + '</span></a>' +
      '<button class="fav" data-save="' + v.stock + '" aria-pressed="' + saved + '" aria-label="Save ' + titleOf(v) + '">' + (saved ? '♥' : '♡') + '</button>' +
      '<div class="bd"><span class="cnd">' + (v.cond === 'Certified' ? 'Certified Pre-Owned' : v.cond) + '</span><h3><a href="vehicle.html?stock=' + v.stock + '">' + v.year + ' ' + v.make + ' ' + v.model + '<small>' + v.trim + '</small></a></h3>' +
      '<div class="ids"><span>Stock ' + v.stock + '</span><span>Model ' + v.code + '</span>' + (v.miles ? '<span>' + v.miles.toLocaleString('en-US') + ' mi</span>' : '') + '</div>' +
      '<div class="sw"><i style="background:' + v.ext[1] + '"></i>' + v.ext[0] + ' · ' + v.int + ' int.</div>' + stackHTML(v, 'ps' + i) +
      '<div class="ctas"><button class="btn btn-cta" data-lead="Confirm availability" data-stock="' + v.stock + '">Confirm Availability</button><a class="btn btn-line" href="vehicle.html?stock=' + v.stock + '">View Details</a><button class="btn btn-line" data-lead="Value your trade" data-stock="' + v.stock + '">Trade Value</button></div>' +
      '<label class="cmp"><input type="checkbox" data-cmp="' + v.stock + '"> Compare</label></div></article>';
  };

  /* ---------- pages ---------- */
  var q = new URLSearchParams(location.search);
  if (page === 'home') home(); if (page === 'srp') srp(); if (page === 'vdp') vdp(); if (page === 'specials') specials();

  function home() {
    var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('#hero').carousel({ interval: rm ? false : 6500, pause: 'hover' });
    $('#heroPause').on('click', function () { var p = $(this).attr('aria-pressed') === 'true'; $('#hero').carousel(p ? 'cycle' : 'pause'); $(this).attr('aria-pressed', !p).text(p ? 'Pause' : 'Play'); });
    if (rm) $('#heroPause').attr('aria-pressed', 'true').text('Play');
    // quick search: three tabs share one live result count
    var st = { cond: 'New' };
    $('.qs .cond button').on('click', function () { $(this).attr('aria-pressed', 'true').siblings().attr('aria-pressed', 'false'); st.cond = $(this).data('c'); fill(); count(); });
    function pool() { return INV.filter(function (v) { return st.cond === 'All' || v.cond === st.cond || (st.cond === 'Used' && v.cond === 'Certified'); }); }
    function fill() { var ms = {}; pool().forEach(function (v) { ms[v.model] = 1; }); $('#qsModel').html('<option value="">Any model</option>' + Object.keys(ms).sort().map(function (m) { return '<option>' + m + '</option>'; }).join('')); }
    function count() {
      var m = $('#qsModel').val(), mx = +$('#qsMax').val() || 1e9, n = pool().filter(function (v) { return (!m || v.model === m) && priceOf(v).price <= mx; }).length;
      $('.qs .count b').text(n);
    }
    $('#qsModel,#qsMax').on('change', count);
    $('#qsGo').on('click', function () { var p = new URLSearchParams(); p.set('cond', st.cond); if ($('#qsModel').val()) p.set('model', $('#qsModel').val()); if ($('#qsMax').val()) p.set('max', $('#qsMax').val()); location.href = 'inventory.html?' + p; });
    $('#qsReset').on('click', function () { $('#qsModel').val(''); $('#qsMax').val(''); count(); });
    $('#kwGo').on('click', function () { location.href = 'inventory.html?q=' + encodeURIComponent($('#kw').val()); });
    $('#kw').on('keydown', function (e) { if (e.key === 'Enter') $('#kwGo').click(); });
    $('#bdGo').on('click', function () { var pay = +$('#bdPay').val() || 600, down = +$('#bdDown').val() || 0, r = .069 / 12, n = 72, max = pay * (1 - Math.pow(1 + r, -n)) / r + down; location.href = 'inventory.html?max=' + Math.round(max); });
    fill(); count();
    // model bar from inventory, one tile per model
    var seen = {}; $('#models').html(INV.filter(function (v) { if (v.cond !== 'New' || seen[v.model]) return false; return (seen[v.model] = 1); }).map(function (v) {
      var from = Math.min.apply(null, INV.filter(function (x) { return x.model === v.model && x.cond === 'New'; }).map(function (x) { return priceOf(x).price; }));
      return '<a href="inventory.html?model=' + encodeURIComponent(v.model) + '"><span class="im"><img src="' + imgSrc(v.imgs[0]) + '" alt="" loading="lazy"></span><b>' + v.model + '</b><span>From ' + money(from) + ' · ' + INV.filter(function (x) { return x.model === v.model; }).length + ' in stock</span></a>';
    }).join(''));
  }

  function srp() {
    var F = { cond: [], model: [], year: [], body: [], color: [], drive: [] }, sort = 'price-asc', kw = (q.get('q') || '').toLowerCase(), min = +q.get('min') || 0, max = +q.get('max') || 0, onlySaved = q.get('saved') === '1';
    ['cond', 'model', 'body'].forEach(function (k) { if (q.get(k)) F[k] = [q.get(k)]; });
    var facets = [['cond', 'Condition'], ['model', 'Model'], ['year', 'Year'], ['body', 'Body Style'], ['color', 'Exterior Color'], ['drive', 'Drivetrain']];
    function val(v, k) { return k === 'color' ? v.ext[0] : String(v[k]); }
    function match(v, skip) {
      for (var k in F) { if (k !== skip && F[k].length && F[k].indexOf(val(v, k)) < 0) return false; }
      var p = priceOf(v).price; if (min && p < min) return false; if (max && p > max) return false;
      if (kw && (titleOf(v) + ' ' + v.ext[0] + ' ' + v.feats.join(' ') + ' ' + v.stock).toLowerCase().indexOf(kw) < 0) return false;
      if (onlySaved && savedList().indexOf(v.stock) < 0) return false;
      return true;
    }
    function renderFilters() {
      $('#filters').html(facets.map(function (f, gi) {
        var k = f[0], vals = {}; INV.forEach(function (v) { vals[val(v, k)] = 0; });
        INV.forEach(function (v) { if (match(v, k)) vals[val(v, k)]++; });
        var keys = Object.keys(vals).sort(function (a, b) { return k === 'year' ? b - a : a.localeCompare(b); });
        return '<div class="grp"><button type="button" data-toggle="collapse" data-target="#fg' + gi + '" aria-expanded="true" aria-controls="fg' + gi + '">' + f[1] + '</button><div class="collapse in" id="fg' + gi + '">' +
          keys.map(function (x) { var on = F[k].indexOf(x) > -1; return '<label class="' + (!vals[x] && !on ? 'zero' : '') + '"><span><input type="checkbox" data-f="' + k + '" value="' + x + '"' + (on ? ' checked' : '') + '>' + (k === 'cond' && x === 'Certified' ? 'Certified Pre-Owned' : x) + '</span><span class="n">' + vals[x] + '</span></label>'; }).join('') + '</div></div>';
      }).join('') + '<div class="grp"><button type="button" data-toggle="collapse" data-target="#fgP" aria-expanded="true" aria-controls="fgP">Price</button><div class="collapse in" id="fgP"><div class="range"><input id="pMin" inputmode="numeric" placeholder="Min $" value="' + (min || '') + '" aria-label="Minimum price"><input id="pMax" inputmode="numeric" placeholder="Max $" value="' + (max || '') + '" aria-label="Maximum price"></div></div></div>' +
        '<div class="grp"><label for="kwI" style="font-weight:700;font-size:15px;color:var(--ink)">Keyword</label><div class="range"><input id="kwI" placeholder="e.g. Z71, sunroof" value="' + (kw || '') + '"></div></div>');
    }
    function render() {
      var list = INV.filter(function (v) { return match(v); });
      list.sort(function (a, b) {
        if (sort === 'price-asc') return priceOf(a).price - priceOf(b).price; if (sort === 'price-desc') return priceOf(b).price - priceOf(a).price;
        if (sort === 'year') return b.year - a.year; if (sort === 'miles') return a.miles - b.miles; return 0;
      });
      var html = list.map(cardHTML);
      if (list.length > 2) html.splice(2, 0, '<div class="promo-card"><span class="eyebrow" style="color:var(--gold)">Instant Trade Value</span><h3>What’s your car worth today?</h3><p>Three questions, a real number, and it stays good for seven days.</p><button class="btn btn-cta" data-lead="Get my trade value">Get my number</button></div>');
      $('#results').html(list.length ? html.join('') : '<div class="empty"><h3 style="margin-top:0">No exact matches</h3><p>Try removing a filter, or let us find one for you.</p><button class="btn btn-line" id="clr2">Clear all filters</button></div>');
      $('#cnt').text(list.length); $('#srpTitle').text(F.cond.length === 1 ? (F.cond[0] === 'New' ? 'New Vehicles' : F.cond[0] === 'Certified' ? 'Certified Pre-Owned' : 'Pre-Owned Vehicles') : (F.model.length === 1 ? F.model[0] + ' Inventory' : 'All Inventory'));
      var pills = []; for (var k in F) F[k].forEach(function (x) { pills.push('<button type="button" data-rm="' + k + '|' + x + '">' + x + '</button>'); });
      if (min) pills.push('<button type="button" data-rm="min">Min ' + money(min) + '</button>'); if (max) pills.push('<button type="button" data-rm="max">Max ' + money(max) + '</button>');
      if (kw) pills.push('<button type="button" data-rm="kw">“' + kw + '”</button>'); if (onlySaved) pills.push('<button type="button" data-rm="saved">Saved only</button>');
      $('#pills').html(pills.length ? pills.join('') + '<button type="button" class="clr" id="clr">Clear all</button>' : '');
      var u = new URLSearchParams(); ['cond', 'model', 'body'].forEach(function (k) { if (F[k].length === 1) u.set(k, F[k][0]); }); if (min) u.set('min', min); if (max) u.set('max', max); if (kw) u.set('q', kw); if (onlySaved) u.set('saved', 1);
      history.replaceState(null, '', 'inventory.html' + (u.toString() ? '?' + u : ''));
    }
    function all() { renderFilters(); render(); }
    $('#filters').on('change', 'input[data-f]', function () { var k = $(this).data('f'), x = this.value, i = F[k].indexOf(x); if (this.checked && i < 0) F[k].push(x); if (!this.checked && i > -1) F[k].splice(i, 1); all(); });
    $('#filters').on('change', '#pMin,#pMax', function () { min = +$('#pMin').val().replace(/\D/g, '') || 0; max = +$('#pMax').val().replace(/\D/g, '') || 0; all(); });
    $('#filters').on('change', '#kwI', function () { kw = this.value.toLowerCase().trim(); all(); });
    $(document).on('click', '#pills [data-rm]', function () { var r = String($(this).data('rm')).split('|'); if (r[0] === 'min') min = 0; else if (r[0] === 'max') max = 0; else if (r[0] === 'kw') kw = ''; else if (r[0] === 'saved') onlySaved = false; else F[r[0]].splice(F[r[0]].indexOf(r[1]), 1); all(); });
    $(document).on('click', '#clr,#clr2', function () { for (var k in F) F[k] = []; min = max = 0; kw = ''; onlySaved = false; all(); });
    $('#sort').on('change', function () { sort = this.value; render(); });
    $('.view-tog button').on('click', function () { $(this).attr('aria-pressed', 'true').siblings().attr('aria-pressed', 'false'); $('#results').toggleClass('list', $(this).data('v') === 'list'); });
    $('#mobFil').on('click', function () { $('#filters').toggleClass('show'); });
    $(document).on('change', '[data-cmp]', function () { var n = $('[data-cmp]:checked').length; $('#cmpBar').toggle(n > 0).find('b').text(n); });
    all();
  }

  function vdp() {
    var v = INV.filter(function (x) { return x.stock === q.get('stock'); })[0] || INV[0], p = priceOf(v), idx = 0;
    document.title = titleOf(v) + ' · ' + D.name;
    $('#crumbV').text(titleOf(v));
    $('#vTitle').html('<span class="y">' + v.year + '</span> ' + v.make + ' ' + v.model + '<span class="tr">' + v.trim + ' · ' + v.ext[0] + '</span>');
    $('#vCond').text(v.cond === 'Certified' ? 'Certified Pre-Owned' : v.cond); $('#vBadges').html(badges(v).replace(/<span class="/g, '<span class="badge-x ').replace(/<span>/g, '<span class="badge-x">'));
    $('#vIds').text('Stock ' + v.stock + ' · Model ' + v.code + ' · VIN on request');
    var imgs = v.imgs.map(imgSrc);
    function show(i) { idx = (i + imgs.length) % imgs.length; $('#gMain').attr({ src: imgs[idx], alt: titleOf(v) + ', photo ' + (idx + 1) + ' of ' + imgs.length }); $('#gCnt').text((idx + 1) + ' / ' + imgs.length); $('#thumbs button').attr('aria-current', 'false').eq(idx).attr('aria-current', 'true'); }
    $('#thumbs').html(imgs.map(function (s, i) { return '<button type="button" aria-label="Photo ' + (i + 1) + '"><img src="' + s + '" alt="" loading="lazy"></button>'; }).join(''));
    $('#thumbs').on('click', 'button', function () { show($(this).index()); });
    $('.gal .p').on('click', function () { show(idx - 1); }); $('.gal .n').on('click', function () { show(idx + 1); });
    $('.gal').on('keydown', function (e) { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
    $('.gal .p,.gal .n').toggle(imgs.length > 1); show(0);
    $('#gNote').text(v.cond === 'New' ? 'Stock photo. May not represent actual vehicle (options, colors, trim and body style may vary).' : 'Representative photos.');
    $('#vStack').html(stackHTML(v, 'vps', true));
    $('#vFin').html(v.cond === 'New' ? '<b>2.9% APR</b> for 36 months for well-qualified buyers when financed through ' + D.lender + '. <button type="button" class="dz" style="background:none;border:0;padding:0;color:var(--cta)" data-title="APR offer" data-disc="2.9% APR for 36 months, $28.99 per month for every $1,000 financed, with approved credit through ' + D.lender + '. Not all buyers will qualify. Not compatible with some rebates. Take delivery by ' + D.expires + '.">Details</button>' : 'Certified and pre-owned financing available with approved credit.');
    $('[data-stock-fill]').attr('data-stock', v.stock);
    if (v.landing) $('#vLanding').html('<a class="landing-link" href="' + v.landing + '"><span><span class="eyebrow" style="color:var(--gold)">Model showcase</span><br><b>See the full ' + v.model + ' story</b></span><span aria-hidden="true">→</span></a>');
    $('#vFeats').html(v.feats.map(function (f) { return '<span>' + f + '</span>'; }).join(''));
    $('#vSpec').html([['Condition', v.cond === 'Certified' ? 'Certified Pre-Owned' : v.cond], ['Mileage', v.miles ? v.miles.toLocaleString('en-US') + ' mi' : 'New'], ['Engine', v.engine], ['Transmission', v.trans], ['Drivetrain', v.drive], ['Exterior', v.ext[0]], ['Interior', v.int], ['MPG (city/hwy)', v.mpg], ['Body style', v.body], ['Stock #', v.stock]].map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join(''));
    $('#vComments').text(v.cond === 'New' ? 'Fresh off the truck and through our pre-delivery inspection. Window sticker on request. Ask about current incentives; they change monthly and we’ll always show you the math.' : 'Inspected by our service department, with full service records and a clean history report. Ask us for the inspection sheet; we’ll send it before you drive over.');
    var sim = INV.filter(function (x) { return x.stock !== v.stock && (x.body === v.body || x.model === v.model); }).slice(0, 3);
    $('#similar').html(sim.map(cardHTML).join(''));
    // payment calculator: finance + lease
    var term = 72;
    $('#cPrice').val(p.price);
    function fin() {
      var price = +$('#cPrice').val() || 0, down = +$('#cDown').val() || 0, trade = +$('#cTrade').val() || 0, apr = +$('#cApr').val() || 0, r = apr / 1200, amt = Math.max(0, price - down - trade);
      var m = r ? amt * r / (1 - Math.pow(1 + r, -term)) : amt / term; $('#cOut').text(money(m)); $('#cAmt').text(money(amt));
    }
    $('#calcFin').on('input change', 'input', fin);
    $('#calcFin .terms button').on('click', function () { $(this).attr('aria-pressed', 'true').siblings().attr('aria-pressed', 'false'); term = +$(this).data('m'); fin(); });
    function lease() {
      var msrp = v.msrp || v.retail, cap = p.price - (+$('#lDown').val() || 0), resid = msrp * (+$('#lRes').val() / 100), mf = +$('#lMf').val() || 0, n = +$('#lTerm').val();
      var dep = (cap - resid) / n, rent = (cap + resid) * mf, pay = Math.max(0, dep + rent); $('#lOut').text(money(pay));
    }
    $('#calcLease').on('input change', 'input,select', lease);
    $('a[href="#calcLease"]').on('shown.bs.tab', lease);
    if (v.cond !== 'New') $('a[href="#calcLease"]').parent().hide();
    fin();
    if (location.hash === '#calc') setTimeout(function () { document.getElementById('calc').scrollIntoView(); }, 200);
  }

  function specials() {
    // "View Inventory (n)" counts come from the same inventory the SRP uses
    $('[data-count-model]').each(function () { var m = $(this).data('count-model'), t = $(this).data('count-trim') || ''; var n = INV.filter(function (v) { return v.cond === 'New' && v.model === m && v.trim.indexOf(t) > -1; }).length; $(this).find('.n').text(n); });
    // savings headline is computed, not typed: discount + rebate for the stock unit
    $('[data-save-stock]').each(function () { var v = INV.filter(function (x) { return x.stock === $(this).data('save-stock'); }.bind(this))[0]; $(this).text(money(priceOf(v).savings) + ' off MSRP'); });
    function tab(t) { $('.sp-tabs button').attr('aria-selected', 'false').filter('[data-t="' + t + '"]').attr('aria-selected', 'true'); $('[data-sp]').hide().filter('[data-sp="' + t + '"]').show(); }
    $('.sp-tabs button').on('click', function () { tab($(this).data('t')); });
    tab(location.hash === '#service' ? 'service' : 'new');
  }
})(jQuery);
