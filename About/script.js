
// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    navToggle.setAttribute('aria-expanded', (!open).toString());
  });
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && e.target !== navToggle) {
      navLinks.style.display = 'none';
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
// Active link
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path) a.setAttribute('aria-current','page');
  });
})();
// Year auto
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
