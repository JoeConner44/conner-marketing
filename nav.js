(function () {
  var B = '';
  var p = window.location.pathname;

  function a(href) {
    var slug = href.replace(B, '').replace(/\/$/, '');
    var cur = p.replace(/\/$/, '');
    if (slug === '' && (cur === B || cur === B + '/index.html')) return 'active';
    if (slug !== '' && cur.indexOf(slug) === 0) return 'active';
    return '';
  }

  var inSvc = p.indexOf('/services') === 0;

  // Inject nav styles
  var style = document.createElement('style');
  style.textContent = `
    .nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; flex-direction: column; gap: 5px; }
    .nav-hamburger span { display: block; width: 22px; height: 2px; background: var(--navy-dark); border-radius: 2px; transition: all 0.25s; }
    .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-hamburger.open span:nth-child(2) { opacity: 0; }
    .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .mobile-menu {
      display: none; position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
      background: rgba(255,255,255,0.98); backdrop-filter: blur(12px);
      z-index: 199; flex-direction: column; padding: 1.5rem 1.5rem 2rem;
      overflow-y: auto; border-top: 1px solid rgba(26,63,111,0.1);
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu a { font-size: 1.1rem; font-weight: 400; color: var(--text-dark); text-decoration: none; padding: 0.9rem 0; border-bottom: 1px solid rgba(26,63,111,0.08); transition: color 0.2s; }
    .mobile-menu a:hover, .mobile-menu a.active { color: var(--navy); }
    .mobile-menu .mobile-section-label { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin: 1.25rem 0 0.5rem; }
    .mobile-menu .mobile-sub a { font-size: 0.95rem; padding: 0.65rem 0; color: var(--text-muted); border-bottom: 1px solid rgba(26,63,111,0.05); }
    .mobile-menu .mobile-cta { margin-top: 1.5rem; background: var(--navy); color: white !important; text-align: center; border-radius: 2rem; padding: 1rem !important; font-weight: 500 !important; border-bottom: none !important; font-size: 1rem !important; }
    .mobile-menu .mobile-cta:hover { background: var(--navy-light) !important; color: white !important; }
    @media (max-width: 768px) {
      nav ul { display: none !important; }
      .nav-hamburger { display: flex !important; }
      .nav-brand-text { display: none; }
    }
  `;
  document.head.appendChild(style);

  var navHTML = '<nav>' +
    '<a href="/" class="logo" style="display:flex;align-items:center;gap:0.7rem;text-decoration:none;">' +
      '<img src="/cms-logo.png" alt="CMS Logo" style="height:42px;width:auto;display:block;">' +
      '<span class="nav-brand-text" style="font-family:Playfair Display,serif;font-size:1.55rem;font-weight:400;color:#1a3f6f;line-height:1;letter-spacing:-0.04em;white-space:nowrap;">Conner Marketing Solutions</span>' +
    '</a>' +
    '<ul>' +
      '<li><a href="/" class="' + a('/') + '">Home</a></li>' +
      '<li class="has-dropdown">' +
        '<a href="/services/" class="' + (inSvc ? 'active' : '') + '">Services</a>' +
        '<div class="dropdown">' +
          '<a href="/services/web-design/">Web Design &amp; Development</a>' +
          '<a href="/services/local-seo/">Local SEO</a>' +
          '<a href="/services/social-media/">Social Media Marketing</a>' +
          '<a href="/services/digital-advertising/">Digital Advertising</a>' +
          '<a href="/services/promotional/">Promotional Marketing</a>' +
          '<a href="/services/hosting/">Website Hosting</a>' +
        '</div>' +
      '</li>' +
      '<li><a href="/portfolio/" class="' + a('/portfolio/') + '">Portfolio</a></li>' +
      '<li><a href="/about/" class="' + a('/about/') + '">About</a></li>' +
      '<li><a href="/learn/" class="' + a('/learn/') + '">Learn</a></li>' +
      '<li><a href="/contact/" class="nav-cta">Get a Quote</a></li>' +
    '</ul>' +
    '<button class="nav-hamburger" id="hamburger" aria-label="Menu">' +
      '<span></span><span></span><span></span>' +
    '</button>' +
    '<a href="/contact/" class="nav-cta" style="display:none;" id="mobile-cta">Get a Quote</a>' +
  '</nav>' +
  '<div class="mobile-menu" id="mobile-menu">' +
    '<a href="/" class="' + a('/') + '">Home</a>' +
    '<a href="/services/">Services</a>' +
    '<div class="mobile-section-label">Our Services</div>' +
    '<div class="mobile-sub">' +
      '<a href="/services/web-design/">Web Design &amp; Development</a>' +
      '<a href="/services/local-seo/">Local SEO</a>' +
      '<a href="/services/social-media/">Social Media Marketing</a>' +
      '<a href="/services/digital-advertising/">Digital Advertising</a>' +
      '<a href="/services/promotional/">Promotional Marketing</a>' +
      '<a href="/services/hosting/">Website Hosting</a>' +
    '</div>' +
    '<a href="/portfolio/" class="' + a('/portfolio/') + '">Portfolio</a>' +
    '<a href="/about/" class="' + a('/about/') + '">About</a>' +
    '<a href="/learn/" class="' + a('/learn/') + '">Learn</a>' +
    '<a href="/contact/" class="mobile-cta">Get a Quote →</a>' +
  '</div>';

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Show mobile CTA button in nav on mobile
  var mobileCta = document.getElementById('mobile-cta');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  function isMobile() { return window.innerWidth <= 768; }

  function updateMobileCta() {
    if(mobileCta) mobileCta.style.display = isMobile() ? 'inline-flex' : 'none';
  }
  updateMobileCta();
  window.addEventListener('resize', updateMobileCta);

  hamburger.addEventListener('click', function() {
    var open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

document.body.insertAdjacentHTML('beforeend',
    '<footer>' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<div class="footer-logo">Conner Marketing Solutions</div>' +
          '<p>We design, develop, and host websites that rank — helping local businesses across Georgia grow their online presence.</p>' +
          '<p style="margin-top:.75rem;color:rgba(255,255,255,.45);font-size:.85rem;"><a href="tel:7707789877" style="color:rgba(255,255,255,.6);text-decoration:none;">(770) 778-9877</a></p>' +
        '</div>' +
        '<div class="footer-col"><h4>Services</h4><ul>' +
          '<li><a href="' + B + '/services/web-design/">Web Design &amp; Dev</a></li>' +
          '<li><a href="' + B + '/services/local-seo/">Local SEO</a></li>' +
          '<li><a href="' + B + '/services/social-media/">Social Media</a></li>' +
          '<li><a href="' + B + '/services/digital-advertising/">Digital Ads</a></li>' +
          '<li><a href="' + B + '/services/promotional/">Promotional</a></li>' +
          '<li><a href="' + B + '/services/hosting/">Hosting</a></li>' +
        '</ul></div>' +
        '<div class="footer-col"><h4>Company</h4><ul>' +
          '<li><a href="' + B + '/about/">About</a></li>' +
          '<li><a href="' + B + '/portfolio/">Portfolio</a></li>' +
          '<li><a href="' + B + '/learn/">Learn</a></li>' +
          '<li><a href="' + B + '/contact/">Contact</a></li>' +
        '</ul></div>' +
        '<div class="footer-col"><h4>Contact</h4><ul>' +
          '<li><a href="tel:7707789877">(770) 778-9877</a></li>' +
          '<li><a href="' + B + '/contact/">Free Quote</a></li>' +
          '<li><a href="mailto:info@connermarketing.com">info@connermarketing.com</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<p>&copy; ' + new Date().getFullYear() + ' Conner Marketing Solutions. All rights reserved.</p>' +
        '<div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap;justify-content:center;">' +
          '<a href="/terms/" style="color:rgba(255,255,255,.35);font-size:.78rem;text-decoration:none;transition:color .2s;" onmouseover="this.style.color=\'rgba(255,255,255,.8)\'" onmouseout="this.style.color=\'rgba(255,255,255,.35)\'">Terms &amp; Conditions</a>' +
          '<a href="/privacy/" style="color:rgba(255,255,255,.35);font-size:.78rem;text-decoration:none;transition:color .2s;" onmouseover="this.style.color=\'rgba(255,255,255,.8)\'" onmouseout="this.style.color=\'rgba(255,255,255,.35)\'">Privacy Policy</a>' +
          '<span style="color:rgba(255,255,255,.28);font-size:.78rem;">Designed &amp; built by CMS.</span>' +
        '</div>' +
      '</div>' +
    '</footer>'
  );

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card,.step,.contact-detail,.scroll-reveal,.pcard,.post-card,.value-card,.why-item').forEach(function(el) {
    el.style.opacity='0'; el.style.transform='translateY(24px)';
    el.style.transition='opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  window.handleSubmit = function(btn) {
    btn.textContent='Sending…'; btn.style.background='#2a5fa8';
    setTimeout(function(){ btn.textContent='✓ Message Sent!'; btn.style.background='#1a5c3a'; }, 1200);
  };
})();
