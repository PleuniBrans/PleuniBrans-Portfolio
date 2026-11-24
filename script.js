// Beweging voor de portfolio: de naam, de fotostapel en de menubalk.
(function () {
  var nav = document.querySelector('.nav');

  // de naam in losse letters knippen, zodat ze apart kunnen springen
  document.querySelectorAll('.hero h1 .line > span').forEach(function (el) {
    el.innerHTML = el.textContent.split('').map(function (ch) {
      return '<span class="ch" aria-hidden="true">' + ch + '</span>';
    }).join('');
  });

  // fotostapel: slepen om opzij te schuiven, tikken om de bovenste naar achteren te sturen
  var stack = document.querySelector('.stack');
  if (stack) {
    var cards = Array.prototype.slice.call(stack.querySelectorAll('.card'));
    var top = cards.length;
    cards.forEach(function (c, i) { c.style.zIndex = i + 1; c.draggable = false; });
    var hint = stack.querySelector('.hint');
    if (hint && window.matchMedia('(pointer: coarse)').matches) hint.textContent = "Tik op de foto's";

    cards.forEach(function (card) {
      var sx, sy, ox = 0, oy = 0, moved = false, active = false;
      card.addEventListener('pointerdown', function (e) {
        active = true; moved = false;
        sx = e.clientX; sy = e.clientY;
        card.style.zIndex = ++top;
        card.classList.add('drag');
        card.setPointerCapture(e.pointerId);
      });
      card.addEventListener('pointermove', function (e) {
        if (!active) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        card.style.setProperty('--dx', (ox + dx) + 'px');
        card.style.setProperty('--dy', (oy + dy) + 'px');
      });
      function end(e) {
        if (!active) return;
        active = false;
        card.classList.remove('drag');
        if (moved) {
          ox += e.clientX - sx; oy += e.clientY - sy;
          // niet helemaal uit beeld laten verdwijnen
          var lim = stack.offsetWidth * 0.6;
          ox = Math.max(-lim, Math.min(lim, ox)); oy = Math.max(-lim, Math.min(lim * 0.6, oy));
          card.style.setProperty('--dx', ox + 'px');
          card.style.setProperty('--dy', oy + 'px');
        } else {
          // tik: deze foto gaat onderop de stapel
          cards.forEach(function (c) { c.style.zIndex = (+c.style.zIndex || 0) + 1; });
          card.style.zIndex = 1;
        }
      }
      card.addEventListener('pointerup', end);
      card.addEventListener('pointercancel', function () { active = false; card.classList.remove('drag'); card.style.setProperty('--dx', ox + 'px'); card.style.setProperty('--dy', oy + 'px'); });
    });
  }

  // menubalk krijgt een achtergrond zodra je scrolt
  function update() { if (nav) nav.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
