(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (/\/(tech|life)\/[^/]+/.test(location.pathname)) return;

  var SPAWN_RATE = 0.5;
  var LIFETIME = 1400;

  window.addEventListener("mousemove", function (e) {
    if (Math.random() > SPAWN_RATE) return;
    var el = document.createElement("span");
    el.className = "frost-speck";
    el.style.left = e.clientX + "px";
    el.style.top = e.clientY + "px";
    el.style.setProperty("--dx", (Math.random() - 0.5) * 50 + "px");
    el.style.setProperty("--dy", -(20 + Math.random() * 50) + "px");
    el.style.setProperty("--size", 3 + Math.random() * 5 + "px");
    el.style.setProperty("--rot", Math.random() * 360 + "deg");
    // Alternate between amethyst and ice-blue, like drifting frost crystals
    el.style.setProperty(
      "--speck-color",
      Math.random() > 0.5 ? "var(--color-accent)" : "var(--color-accent-warm)"
    );
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, LIFETIME);
  }, { passive: true });
})();
