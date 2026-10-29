// Lead forms post to the existing Google Form. Entry IDs are the original ones.
(function () {
  var ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSfZbwVhF1d-BIcUfiFW0TpIuMwmNfjsycPBriEdlcj06Z4lSA/formResponse';
  var ENTRY = { first: 'entry.165531712', last: 'entry.393307090', email: 'entry.137094471', phone: 'entry.613100451', business: 'entry.289970755', service: 'entry.2004443733', message: 'entry.227625189' };

  function val(form, name) { var el = form.elements[name]; return el ? el.value.trim() : ''; }

  function send(fields) {
    var iframe = document.createElement('iframe');
    iframe.name = 'gform_iframe'; iframe.style.display = 'none'; iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);
    var f = document.createElement('form');
    f.method = 'POST'; f.action = ACTION; f.target = 'gform_iframe';
    Object.keys(fields).forEach(function (k) {
      var i = document.createElement('input'); i.type = 'hidden'; i.name = ENTRY[k]; i.value = fields[k]; f.appendChild(i);
    });
    document.body.appendChild(f); f.submit();
    setTimeout(function () { document.body.removeChild(f); document.body.removeChild(iframe); }, 3000);
  }

  // Preselect the service from ?service= on the contact form.
  var qs = new URLSearchParams(window.location.search).get('service');
  var sel = document.getElementById('service');
  if (qs && sel) for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text.toLowerCase().indexOf(qs.toLowerCase().split(' ')[0]) === 0) { sel.selectedIndex = i; break; }

  // Prefill the website field on the audit form from ?site= (set by the audit widget).
  var site = new URLSearchParams(window.location.search).get('site');
  var siteInput = document.getElementById('website');
  if (site && siteInput) siteInput.value = site.replace(/^https?:\/\//, '');

  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    var kind = form.getAttribute('data-lead-form');
    var msg = form.querySelector('.form-msg');
    var btn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = val(form, 'name'), phone = val(form, 'phone');
      if (!name || !phone) {
        msg.style.display = 'block'; msg.style.color = '#b42318';
        msg.textContent = 'Please add your name and phone number.'; return;
      }
      var parts = name.split(/\s+/), first = parts.shift(), last = parts.join(' ');
      var fields = { first: first, last: last, phone: phone, email: val(form, 'email') };
      if (kind === 'audit') {
        fields.service = 'Free Website Audit';
        fields.message = 'Website: ' + val(form, 'website');
      } else {
        fields.business = val(form, 'business');
        fields.service = val(form, 'service');
        fields.message = val(form, 'message');
      }
      btn.disabled = true; btn.textContent = 'Sending...';
      send(fields);
      if (window.cmsTrack) window.cmsTrack('form_submit', { form: kind });
      setTimeout(function () {
        btn.textContent = 'Sent';
        msg.style.display = 'block'; msg.style.color = '#0f6b3a';
        msg.textContent = kind === 'audit' ? 'Got it. We will send your audit within 24 hours.' : 'Thanks. We will call you within one business day.';
        form.reset();
      }, 1200);
    });
  });
})();
