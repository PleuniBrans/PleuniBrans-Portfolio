// Beweging voor de portfolio. Alles blijft statisch als iemand 'minder beweging' heeft ingesteld.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.nav');
  var bar = document.querySelector('.progress');
  var lines = document.querySelectorAll('.hero h1 .line > span');
  // de naam in losse letters knippen, zodat ze apart kunnen springen
  lines.forEach(function (el) {
    el.innerHTML = el.textContent.split('').map(function (ch) {
      return '<span class="ch" aria-hidden="true">' + ch + '</span>';
    }).join('');
  });
  var pimg = document.querySelector('.p-hero-img img');
  var st = document.querySelector('.statement');
  var words = [];

  // de openingszin in woorden knippen, zodat ze bij het scrollen oplichten
  if (st) {
    var text = st.textContent.trim().split(/\s+/);
    st.setAttribute('aria-label', text.join(' '));
    st.innerHTML = text.map(function (w) {
      return '<span class="w" aria-hidden="true">' + w + '</span>';
    }).join(' ');
    words = Array.prototype.slice.call(st.querySelectorAll('.w'));
  }

  // lijnen en foto's verschijnen één keer als ze in beeld komen
  var targets = document.querySelectorAll('.row, .about-photo, .reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (nav) nav.classList.toggle('solid', y > 40);

    if (!reduce && y < vh * 1.3) {
      // de twee naamregels schuiven bij het scrollen in tegengestelde richting weg
      if (lines.length === 2) {
        lines[0].style.transform = 'translateX(' + (-y * 0.12) + 'px)';
        lines[1].style.transform = 'translateX(' + (y * 0.12) + 'px)';
      }
      if (pimg) pimg.style.transform = 'translateY(' + (y * 0.05) + 'px)';
    }

    if (words.length && st) {
      var r = st.getBoundingClientRect();
      var prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
      var n = Math.round(prog * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
