// Scrollanimaties voor de portfolio
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.querySelector('.progress');
  var photo = document.querySelector('.photo');
  var sticker = document.querySelector('.sticker');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var words = [];

  // zin in woorden knippen, zodat ze bij het scrollen één voor één oplichten
  var st = document.querySelector('.statement');
  if (st) {
    var text = st.textContent.trim().split(/\s+/);
    st.setAttribute('aria-label', text.join(' '));
    st.innerHTML = text.map(function (w) {
      return '<span class="w" aria-hidden="true">' + w + '</span>';
    }).join(' ');
    words = Array.prototype.slice.call(st.querySelectorAll('.w'));
  }

  // referenties verschijnen bij het scrollen
  var rv = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

    if (!reduce) {
      if (photo && y < vh * 1.2) {
        photo.style.transform = 'translateY(' + (y * -0.12) + 'px) rotate(' + (y * 0.006) + 'deg)';
      }
      if (sticker && y < vh * 1.2) {
        sticker.style.transform = 'rotate(' + (-12 + y * 0.35) + 'deg)';
      }
      // projectkaarten: de vorige kaart krimpt als de volgende erover schuift
      cards.forEach(function (c, i) {
        var next = cards[i + 1];
        if (!next) return;
        var top = next.getBoundingClientRect().top;
        var p = Math.min(1, Math.max(0, 1 - (top - 90) / (vh * 0.7)));
        c.style.transform = 'scale(' + (1 - p * 0.06) + ')';
        c.style.filter = 'brightness(' + (1 - p * 0.18) + ')';
      });
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
