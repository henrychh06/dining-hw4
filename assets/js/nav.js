// Collapsible mobile navigation. Without JS the menu simply stays visible.
(function () {
  var root = document.documentElement;
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  root.classList.add("js");
  var mq = window.matchMedia("(max-width: 62rem)");

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
    nav.hidden = !open;
  }
  function sync() { setOpen(!mq.matches); }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mq.matches && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
  mq.addEventListener("change", sync);
  sync();
})();
