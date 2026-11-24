// Beweging voor de portfolio: alleen de naam bovenaan en de menubalk.
(function () {
  var nav = document.querySelector('.nav');

  // de naam in losse letters knippen, zodat ze apart kunnen springen
  document.querySelectorAll('.hero h1 .line > span').forEach(function (el) {
    el.innerHTML = el.textContent.split('').map(function (ch) {
      return '<span class="ch" aria-hidden="true">' + ch + '</span>';
    }).join('');
  });

  // menubalk krijgt een achtergrond zodra je scrolt
  function update() { if (nav) nav.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
