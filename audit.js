// Live audit widget: runs Google PageSpeed Insights (mobile) from the visitor's browser.
(function () {
  // TODO: add a free Google Cloud API key (PageSpeed Insights API enabled), restricted to
  // HTTP referrers https://connermarketing.com/*. Without one, Google's shared quota often returns 429
  // and visitors see the fallback message.
  var PSI_KEY = '';
  var root = document.getElementById('audit-widget');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var form = root.querySelector('form'), input = root.querySelector('input'), btn = root.querySelector('button[type=submit]');
  var out = root.querySelector('.aw-out'), status = root.querySelector('.aw-status');

  function normalize(v) {
    v = v.trim();
    if (!v) return null;
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
    try {
      var u = new URL(v);
      if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(u.hostname) || /^\d+(\.\d+){3}$/.test(u.hostname)) return null;
      return u.origin + (u.pathname === '/' ? '' : u.pathname);
    } catch (e) { return null; }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tone(s) { return s >= 90 ? 'good' : s >= 50 ? 'mid' : 'bad'; }

  var steps = ['Loading your site on a mobile connection', 'Measuring speed', 'Checking search basics', 'Checking accessibility'];
  var timer;
  function startStatus() {
    var i = 0; status.hidden = false; status.textContent = steps[0];
    timer = setInterval(function () { i = Math.min(i + 1, steps.length - 1); status.textContent = steps[i] + '...'; }, 4500);
  }
  function stopStatus() { clearInterval(timer); status.hidden = true; }

  function gauge(label, score) {
    var C = 2 * Math.PI * 42;
    return '<div class="aw-gauge ' + tone(score) + '" role="img" aria-label="' + esc(label) + ' score ' + score + ' out of 100">' +
      '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" cx="50" cy="50" r="42" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" data-target="' + (C * (1 - score / 100)).toFixed(1) + '"/></svg>' +
      '<span class="num" data-n="' + score + '">' + (reduce ? score : 0) + '</span><span class="lab">' + esc(label) + '</span></div>';
  }
  function check(ok, text) { return '<li class="' + (ok ? 'ok' : 'no') + '"><span aria-hidden="true">' + (ok ? '✓' : '✕') + '</span>' + esc(text) + '</li>'; }

  function show(data, site) {
    var L = data.lighthouseResult, c = L.categories, a = L.audits;
    var perf = Math.round(c.performance.score * 100), seo = Math.round(c.seo.score * 100), acc = Math.round(c.accessibility.score * 100);
    var lcp = a['largest-contentful-paint'] && a['largest-contentful-paint'].displayValue;
    var lcpOk = a['largest-contentful-paint'] && a['largest-contentful-paint'].score >= 0.9;
    var worst = Math.min(perf, seo, acc);
    var verdict = worst >= 90 ? 'Your site’s basics are in good shape. The full audit looks at Google rankings, your Business Profile and your competitors.'
      : perf < 50 ? 'Your site is slow on phones. That costs you calls and hurts your Google rankings.'
      : 'There is room to improve. Most of these fixes are quick.';
    out.innerHTML = '<div class="aw-host">Mobile results for <strong>' + esc(site.replace(/^https?:\/\//, '')) + '</strong></div>' +
      '<div class="aw-gauges">' + gauge('Mobile speed', perf) + gauge('Search basics', seo) + gauge('Accessibility', acc) + '</div>' +
      '<ul class="aw-checks">' +
        (lcp ? check(lcpOk, 'Main content shows in ' + lcp) : '') +
        (a['viewport'] ? check(a['viewport'].score === 1, 'Set up for phone screens') : '') +
        (a['is-on-https'] ? check(a['is-on-https'].score === 1, 'Secure (HTTPS)') : '') +
        (a['is-crawlable'] ? check(a['is-crawlable'].score === 1, 'Google is allowed to index it') : '') +
        (a['document-title'] ? check(a['document-title'].score === 1, 'Has a page title for search results') : '') +
        (a['meta-description'] ? check(a['meta-description'].score === 1, 'Has a search description') : '') +
      '</ul><p class="aw-verdict">' + verdict + '</p>' +
      '<p class="aw-note">Not checked here: your Google Business Profile, map pack ranking and competitors. The free audit covers those.</p>' +
      '<a class="btn" href="/free-audit/?site=' + encodeURIComponent(site) + '" data-track="audit_widget_cta">Get the full audit</a>';
    out.hidden = false;
    if (window.cmsTrack) window.cmsTrack('audit_widget_result', { speed: perf, seo: seo, accessibility: acc });
    animate();
  }

  function animate() {
    out.querySelectorAll('.aw-gauge').forEach(function (g) {
      var fg = g.querySelector('.fg'), n = g.querySelector('.num'), target = +n.getAttribute('data-n');
      if (reduce) { fg.setAttribute('stroke-dashoffset', fg.getAttribute('data-target')); return; }
      requestAnimationFrame(function () { fg.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)'; fg.setAttribute('stroke-dashoffset', fg.getAttribute('data-target')); });
      var t0 = null;
      (function tick(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1100, 1); n.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(performance.now());
    });
  }

  function fail(site, msg) {
    out.innerHTML = '<p class="aw-verdict">' + msg + '</p><a class="btn" href="/free-audit/' + (site ? '?site=' + encodeURIComponent(site) : '') + '" data-track="audit_widget_fallback">Get the free audit instead</a>';
    out.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var site = normalize(input.value);
    out.hidden = true; out.innerHTML = '';
    if (!site) { fail('', 'Enter your website address, like yourbusiness.com.'); out.querySelector('a').remove(); return; }
    btn.disabled = true; btn.textContent = 'Checking...'; startStatus();
    var url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&category=seo&category=accessibility&url=' + encodeURIComponent(site) + (PSI_KEY ? '&key=' + PSI_KEY : '');
    var ctrl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 70000);
    fetch(url, ctrl ? { signal: ctrl.signal } : undefined).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.lighthouseResult) throw new Error((d.error && d.error.code) || 'no result');
      show(d, site);
    }).catch(function () {
      fail(site, 'We couldn’t run the live check on that address right now. We can run it for you by hand, free, within 24 hours.');
    }).then(function () { clearTimeout(to); stopStatus(); btn.disabled = false; btn.textContent = 'Check my site'; });
  });
})();
