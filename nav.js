(function () {
  var B = '/conner-marketing';
  var p = window.location.pathname;

  function a(href) {
    var slug = href.replace(B, '').replace(/\/$/, '');
    var cur = p.replace(/\/$/, '');
    if (slug === '' && (cur === B || cur === B + '/index.html')) return 'active';
    if (slug !== '' && cur.indexOf(slug) === 0) return 'active';
    return '';
  }

  var inSvc = p.indexOf(B + '/services') === 0;

  document.body.insertAdjacentHTML('afterbegin', '<nav>' +
    '<a href="' + B + '/" class="logo">' +
      '<img src="' + B + '/cms-logo.png" alt="Conner Marketing Solutions" style="height:40px;width:auto;display:block;" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'block\'">' +
      '<span class="logo-text" style="display:none;">CMS.</span>' +
    '</a>' +
    '<ul>' +
      '<li><a href="' + B + '/" class="' + a(B + '/') + '">Home</a></li>' +
      '<li class="has-dropdown">' +
        '<a href="' + B + '/services/" class="' + (inSvc ? 'active' : '') + '">Services</a>' +
        '<div class="dropdown">' +
          '<a href="' + B + '/services/web-design/">Web Design &amp; Development</a>' +
          '<a href="' + B + '/services/local-seo/">Local SEO</a>' +
          '<a href="' + B + '/services/social-media/">Social Media Marketing</a>' +
          '<a href="' + B + '/services/digital-advertising/">Digital Advertising</a>' +
          '<a href="' + B + '/services/promotional/">Promotional Marketing</a>' +
          '<a href="' + B + '/services/hosting/">Website Hosting</a>' +
        '</div>' +
      '</li>' +
      '<li><a href="' + B + '/portfolio/" class="' + a(B + '/portfolio/') + '">Portfolio</a></li>' +
      '<li><a href="' + B + '/about/" class="' + a(B + '/about/') + '">About</a></li>' +
      '<li><a href="' + B + '/learn/" class="' + a(B + '/learn/') + '">Learn</a></li>' +
      '<li><a href="' + B + '/contact/" class="nav-cta">Get a Quote</a></li>' +
    '</ul>' +
  '</nav>');

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
        '<p>Designed &amp; built by CMS.</p>' +
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
