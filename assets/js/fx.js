// Visual effects: preloader, photo placeholders, fit-to-width titles,
// scroll reveals, scroll-scrubbed type and parallax, diagram highlights.
// Everything here is decoration: the page is complete without it.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader (first visit per session only) ---------- */
  var loader = document.querySelector(".loader");
  if (loader && root.classList.contains("show-loader")) {
    var hide = function () {
      loader.classList.add("is-done");
      try { sessionStorage.setItem("tr-loaded", "1"); } catch (e) {}
      setTimeout(function () { root.classList.remove("show-loader"); }, 600);
    };
    var started = Date.now();
    var done = function () { setTimeout(hide, Math.max(0, 900 - (Date.now() - started))); };
    if (document.readyState === "complete") done(); else window.addEventListener("load", done);
    setTimeout(hide, 2500); // never block longer than this
  }

  /* ---------- Missing photo placeholders ---------- */
  // Until the real file exists in assets/img/photos/, show its exact name and size.
  Array.prototype.forEach.call(document.querySelectorAll(".ph img"), function (img) {
    var frame = img.closest(".ph");
    function missing() { frame.classList.add("is-missing"); }
    function ok() { frame.classList.remove("is-missing"); }
    if (img.complete) { if (!img.naturalWidth) missing(); }
    img.addEventListener("error", missing);
    img.addEventListener("load", ok);
  });

  /* ---------- Fit text to its container width ---------- */
  var fits = Array.prototype.slice.call(document.querySelectorAll(".fit"));
  function fitAll() {
    fits.forEach(function (el) {
      var box = el.parentElement.clientWidth;
      el.style.fontSize = "100px";
      var w = el.scrollWidth;
      if (w) el.style.fontSize = Math.floor(100 * box / w * 0.995) + "px";
    });
  }
  if (fits.length) {
    fitAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fitAll, 120); });
  }

  /* ---------- Split statements into words ---------- */
  var assembles = Array.prototype.slice.call(document.querySelectorAll("[data-assemble]"));
  assembles.forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.textContent = "";
    words.forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "word";
      s.setAttribute("aria-hidden", "true");
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal, .reveal-clip");
  if ("IntersectionObserver" in window) {
    // A fully clipped element never "intersects", so clip reveals watch their parent.
    var watched = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        (watched.get(en.target) || []).forEach(function (el) { el.classList.add("is-in"); });
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) {
      var target = el.classList.contains("reveal-clip") ? el.parentElement : el;
      if (!watched.has(target)) watched.set(target, []);
      watched.get(target).push(el);
      io.observe(target);
    });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Diagram: link legend items to numbered markers ---------- */
  var legend = document.querySelectorAll(".legend li");
  var markers = document.querySelectorAll(".diagram .marker");
  if (legend.length && markers.length) {
    var setActive = function (n) {
      Array.prototype.forEach.call(legend, function (li, i) { li.classList.toggle("is-active", i === n); });
      Array.prototype.forEach.call(markers, function (m, i) { m.classList.toggle("is-active", i === n); });
    };
    Array.prototype.forEach.call(legend, function (li, i) {
      li.addEventListener("pointerenter", function () { setActive(i); });
      li.addEventListener("pointerleave", function () { setActive(-1); });
    });
    Array.prototype.forEach.call(markers, function (m, i) {
      m.addEventListener("pointerenter", function () { setActive(i); });
      m.addEventListener("pointerleave", function () { setActive(-1); });
    });
  }

  if (reduce) return; // everything below is pure motion

  /* ---------- Scroll-driven effects ---------- */
  var vh = window.innerHeight;
  window.addEventListener("resize", function () { vh = window.innerHeight; });

  // progress 0..1 while the element travels from bottom to top of the viewport
  function progress(el) {
    var r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
  }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  var stretches = document.querySelectorAll("[data-stretch]");
  var parallax = document.querySelectorAll("[data-parallax]");
  var flyers = document.querySelectorAll("[data-fly]");
  var vwords = document.querySelectorAll("[data-vertical]");

  function frame() {
    // Words that assemble (skew + blur + scale) as the section scrolls in.
    assembles.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = clamp01((vh - r.top) / (vh * 0.75));
      var words = el.querySelectorAll(".word");
      var n = words.length;
      Array.prototype.forEach.call(words, function (w, i) {
        var t = easeOut(clamp01(p * 1.6 - (i / n) * 0.6));
        var k = 1 - t;
        w.style.opacity = t.toFixed(3);
        w.style.transform = "translate3d(" + (k * (i % 2 ? 40 : -40)).toFixed(1) + "px," + (k * 50).toFixed(1) + "px,0) skewX(" + (k * -25).toFixed(1) + "deg) scale(" + (1 + k * 0.5).toFixed(3) + ")";
        w.style.filter = k > 0.01 ? "blur(" + (k * 8).toFixed(1) + "px)" : "none";
      });
    });

    // Headline that widens as you scroll (variable font width axis).
    Array.prototype.forEach.call(stretches, function (el) {
      var p = clamp01(progress(el) * 2.2 - 0.25);
      el.style.fontStretch = (62 + p * 63).toFixed(1) + "%";
    });

    // Photos that drift slower than the page.
    Array.prototype.forEach.call(parallax, function (el) {
      var p = progress(el.parentElement);
      var amt = parseFloat(el.getAttribute("data-parallax")) || 10;
      el.style.transform = "translate3d(0," + ((0.5 - p) * amt * 2).toFixed(2) + "%,0) scale(1.15)";
    });

    // Objects that fly across their section.
    Array.prototype.forEach.call(flyers, function (el) {
      var p = progress(el.parentElement);
      var x = (p * 1.4 - 0.2) * (el.parentElement.clientWidth * 0.85);
      el.style.transform = "translate3d(" + x.toFixed(1) + "px," + (Math.sin(p * 12) * 6).toFixed(1) + "px,0) rotate(" + (Math.sin(p * 9) * 6).toFixed(1) + "deg)";
    });

    // Vertical words that slide in opposite directions.
    Array.prototype.forEach.call(vwords, function (el) {
      var p = progress(el.parentElement);
      var dir = el.getAttribute("data-vertical") === "up" ? -1 : 1;
      var base = dir < 0 ? "rotate(180deg) " : "";
      el.style.transform = base + "translate3d(0," + ((p - 0.5) * 30 * dir).toFixed(1) + "%,0)";
    });
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; frame(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();
})();
