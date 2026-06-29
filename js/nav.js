(function () {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  window.toggleMenu = function () {
    const menu = document.getElementById('navLinks');
    const btn = document.getElementById('hamburger');
    if (menu) menu.classList.toggle('open');
    if (btn) btn.classList.toggle('open');
  };

  window.closeMenu = function () {
    const menu = document.getElementById('navLinks');
    const btn = document.getElementById('hamburger');
    if (menu) menu.classList.remove('open');
    if (btn) btn.classList.remove('open');
  };

  document.addEventListener('click', function (e) {
    const nav = document.getElementById('navbar');
    if (nav && !nav.contains(e.target)) closeMenu();
  });

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }
})();
