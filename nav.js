(function () {
  // Business details used in the footer. Edit here.
  var PHONE = '(770) 778-9877', PHONE_HREF = 'tel:7707789877';
  var EMAIL = 'info@connermarketing.com';
  var ADDRESS = '52 Charlotte Circle<br>Statham, GA 30666';
  var HOURS = 'Mon to Fri, 8am to 5pm'; // TODO: confirm hours
  var GTM_ID = 'GTM-XXXXXXX'; // TODO: replace with the real GTM container ID

  var p = window.location.pathname.replace(/\/$/, '');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function active(slug) { return slug === '' ? (p === '' || p === '/index.html') : p.indexOf(slug) === 0; }
  function cls(slug) { return active(slug) ? 'active' : ''; }
  var inSvc = p.indexOf('/services') === 0;

  // Analytics (GTM). Inert until a real container ID is set above.
  window.dataLayer = window.dataLayer || [];
  if (GTM_ID.indexOf('XXXX') === -1) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var g = document.createElement('script');
    g.async = true; g.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(g);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (a) window.dataLayer.push({ event: 'phone_click', link_url: a.getAttribute('href') });
  });
  window.cmsTrack = function (name, data) { window.dataLayer.push(Object.assign({ event: name }, data || {})); };

  var svc = [
    ['/services/web-design/', 'Website Design &amp; Development'],
    ['/services/social-media/', 'Social Media'],
    ['/services/digital-advertising/', 'Ad Management'],
    ['/services/sales-software/', 'Custom Sales Software']
  ];
  var dd = svc.map(function (s) { return '<a href="' + s[0] + '">' + s[1] + '</a>'; }).join('');

  var navHTML =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<nav class="site-nav" aria-label="Main">' +
      '<a href="/" class="logo">' +
        '<img src="/cms-logo-84.png" srcset="/cms-logo-84.png 1x, /cms-logo-168.png 2x" width="42" height="42" alt="CMS logo">' +
        '<span class="logo-text">Conner Marketing Solutions</span>' +
      '</a>' +
      '<ul>' +
        '<li><a href="/" class="' + cls('') + '">Home</a></li>' +
        '<li class="has-dropdown"><a href="/services/" class="' + (inSvc ? 'active' : '') + '" aria-haspopup="true" aria-expanded="false" id="svc-link">Services</a>' +
          '<div class="dropdown"><div class="dropdown-inner">' + dd + '</div></div></li>' +
        '<li><a href="/portfolio/" class="' + cls('/portfolio') + '">Portfolio</a></li>' +
        '<li><a href="/about/" class="' + cls('/about') + '">About</a></li>' +
        '<li><a href="/contact/" class="' + cls('/contact') + '">Contact</a></li>' +
        '<li><a href="/free-audit/" class="nav-cta">Free Audit</a></li>' +
      '</ul>' +
      '<button class="nav-hamburger" id="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>' +
    '</nav>' +
    '<div class="mobile-menu" id="mobile-menu">' +
      '<a href="/">Home</a>' +
      '<a href="/services/">Services</a>' +
      '<div class="mobile-sub">' + dd + '</div>' +
      '<a href="/portfolio/">Portfolio</a>' +
      '<a href="/about/">About</a>' +
      '<a href="/contact/">Contact</a>' +
      '<a href="/free-audit/" class="mobile-cta">Free Audit</a>' +
    '</div>';
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  var hb = document.getElementById('hamburger'), mm = document.getElementById('mobile-menu');
  hb.addEventListener('click', function () {
    var open = mm.classList.toggle('open');
    hb.classList.toggle('open', open);
    hb.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mm.querySelectorAll('a').forEach(function (l) {
    l.addEventListener('click', function () { mm.classList.remove('open'); hb.classList.remove('open'); hb.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; });
  });

  var dlink = document.getElementById('svc-link'), dli = dlink.parentNode;
  function setExp(v) { dlink.setAttribute('aria-expanded', v); }
  dli.addEventListener('mouseenter', function () { setExp('true'); });
  dli.addEventListener('mouseleave', function () { setExp('false'); });
  dli.addEventListener('focusin', function () { setExp('true'); });
  dli.addEventListener('focusout', function (e) { if (!dli.contains(e.relatedTarget)) setExp('false'); });
  dli.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setExp('false'); dlink.focus(); dli.querySelector('.dropdown').style.display = 'none'; setTimeout(function () { dli.querySelector('.dropdown').style.display = ''; }, 300); } });

  var yr = new Date().getFullYear();
  document.body.insertAdjacentHTML('beforeend',
    '<footer><div class="footer-grid">' +
      '<div class="footer-brand"><div class="footer-logo">Conner Marketing Solutions</div>' +
        '<p>Websites, social media, ad management and custom sales software for Georgia service businesses.</p>' +
        '<address>' + ADDRESS + '<br><a href="' + PHONE_HREF + '">' + PHONE + '</a><br><a href="mailto:' + EMAIL + '">' + EMAIL + '</a><br>' + HOURS + '</address></div>' +
      '<div class="footer-col"><h4>Services</h4><ul>' +
        svc.map(function (s) { return '<li><a href="' + s[0] + '">' + s[1] + '</a></li>'; }).join('') +
      '</ul></div>' +
      '<div class="footer-col"><h4>Company</h4><ul>' +
        '<li><a href="/about/">About</a></li><li><a href="/portfolio/">Portfolio</a></li><li><a href="/contact/">Contact</a></li><li><a href="/free-audit/">Free Website Audit</a></li>' +
      '</ul></div>' +
    '</div>' +
    '<div class="footer-bottom"><p>&copy; ' + yr + ' Conner Marketing Solutions. All rights reserved.</p>' +
      '<div class="footer-links"><a href="/terms/">Terms &amp; Conditions</a><a href="/privacy/">Privacy Policy</a><a href="/services/web-design/">Designed &amp; built by CMS</a></div></div></footer>');

  // Headline reveal: words mask in from below, 40ms stagger.
  if (!reduce && 'IntersectionObserver' in window) {
    var heads = document.querySelectorAll('h1, main h2');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.2 });
    heads.forEach(function (h) {
      var label = h.textContent.replace(/\s+/g, ' ').trim();
      var i = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var frag = document.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach(function (t) {
              if (!t) return;
              if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
              var s = document.createElement('span'); s.style.setProperty('--i', i++); s.textContent = t;
              w.appendChild(s); frag.appendChild(w);
            });
            node.replaceChild(frag, c);
          } else if (c.nodeType === 1) walk(c);
        });
      })(h);
      h.setAttribute('aria-label', label);
      h.classList.add('rv');
      io.observe(h);
    });
  }

  // Cursor-following glow on dark sections (desktop, motion allowed).
  if (!reduce && window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) {
    document.querySelectorAll('.glow').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Before/after slider.
  document.querySelectorAll('.ba').forEach(function (ba) {
    var r = ba.querySelector('input[type=range]');
    function set() { ba.style.setProperty('--pos', r.value + '%'); }
    r.addEventListener('input', set); set();
  });
})();
