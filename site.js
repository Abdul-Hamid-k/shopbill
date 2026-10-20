// Small enhancements. The page is complete HTML without this file.
(function () {
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');
  function closeMenu() { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); btn.focus(); } });
  document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) closeMenu(); });

  // highlight the menu link of the section being read
  if ('IntersectionObserver' in window) {
    var links = {};
    document.querySelectorAll('nav a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (!a || !e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
        a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var sec = document.getElementById(id); if (sec) spy.observe(sec); });
  }

  // mark the download that fits this device
  var android = /Android/i.test(navigator.userAgent);
  var pick = android ? document.querySelector('.dcard[data-kind="arm64"]') : document.querySelector('.dcard[data-group="windows"]');
  if (pick) {
    pick.classList.add('rec');
    pick.querySelector('.dbadge').hidden = false;
    var b = pick.querySelector('.btn');
    if (b) b.classList.remove('ghost');
  }

  // click a screenshot to see it large
  var lb = document.getElementById('lb');
  if (lb && lb.showModal) {
    var big = lb.querySelector('img');
    document.querySelectorAll('.shot img, .shotstack .laptop').forEach(function (im) {
      im.tabIndex = 0;
      im.setAttribute('role', 'button');
      im.setAttribute('aria-label', 'Enlarge: ' + im.alt);
      var open = function () {
        // the widest version of the picture
        var src = im.currentSrc || im.src;
        var source = im.parentElement && im.parentElement.querySelector('source');
        if (source && source.srcset) {
          var parts = source.srcset.split(',').map(function (s) { return s.trim().split(/\s+/); });
          var best = parts.reduce(function (a, c) { return parseInt(c[1], 10) > parseInt(a[1], 10) ? c : a; }, parts[0]);
          if (best && best[0]) src = best[0];
        }
        big.src = src; big.alt = im.alt; lb.showModal();
      };
      im.addEventListener('click', open);
      im.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    lb.addEventListener('click', function () { lb.close(); });
  }
})();
