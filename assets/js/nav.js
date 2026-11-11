// Full-screen menu + header that hides on scroll down.
// Without JS the menu stays visible as a plain list (see styles.css).
(function () {
  var root = document.documentElement;
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  root.classList.add("js");
  if (!toggle || !nav || !header) return;

  var label = toggle.querySelector(".nav-toggle-label");

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Close" : "Menu";
    nav.hidden = !open;
    root.classList.toggle("menu-open", open);
    if (open) {
      header.classList.remove("is-hidden");
      root.classList.remove("header-hidden");
      var current = nav.querySelector('[aria-current="page"]') || nav.querySelector("a");
      if (current) current.focus();
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Keep Tab focus inside the open menu (header + nav).
  document.addEventListener("focusin", function (e) {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (!header.contains(e.target)) toggle.focus();
  });

  setOpen(false);

  // Hide the header while scrolling down, show it when scrolling up.
  var lastY = window.scrollY;
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      var hide = y > lastY && y > 160 && !root.classList.contains("menu-open");
      header.classList.toggle("is-hidden", hide);
      root.classList.toggle("header-hidden", hide);
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  // Never hide the header while something inside it has keyboard focus.
  header.addEventListener("focusin", function () {
    header.classList.remove("is-hidden");
    root.classList.remove("header-hidden");
  });
})();
