(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // Always dismiss the intro screen, even if an optional library fails.
  const hideLoader = () => $(".intro-loader")?.classList.add("loaded");
  window.addEventListener("load", () => setTimeout(hideLoader, 450), { once: true });
  setTimeout(hideLoader, 3500);

  // Theme preference
  const themeKey = "dream-space-home-theme";
  let initialTheme = "dark";
  try { initialTheme = localStorage.getItem(themeKey) || "dark"; } catch (e) {}
  document.body.classList.toggle("light", initialTheme === "light");
  function syncThemeControl() {
    const light = document.body.classList.contains("light");
    const small = $(".theme-switch small");
    const icon = $(".theme-switch span");
    if (small) small.textContent = light ? "DARK" : "LIGHT";
    if (icon) icon.textContent = light ? "☾" : "☼";
  }
  syncThemeControl();
  $(".theme-switch")?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const light = document.body.classList.contains("light");
    try { localStorage.setItem(themeKey, light ? "light" : "dark"); } catch (e) {}
    syncThemeControl();
  });

  // Hero slideshow
  const heroSlides = $$(".hero-property-slide");
  if (heroSlides.length > 1) {
    let slideIndex = Math.max(0, heroSlides.findIndex(s => s.classList.contains("active")));
    setInterval(() => {
      heroSlides[slideIndex]?.classList.remove("active");
      slideIndex = (slideIndex + 1) % heroSlides.length;
      heroSlides[slideIndex]?.classList.add("active");
    }, 5200);
  }

  // Optional property film controls
  const film = $(".property-video"), filmButton = $(".film-play");
  filmButton?.addEventListener("click", () => {
    if (!film) return;
    if (film.paused) { film.play().catch(() => {}); filmButton.textContent = "Ⅱ"; }
    else { film.pause(); filmButton.textContent = "▶"; }
  });

  // Optional motion enhancements; the site remains usable without GSAP.
  if (window.gsap && window.ScrollTrigger) {
    try {
      gsap.registerPlugin(ScrollTrigger);
      if ($(".opening-center")) gsap.from(".opening-center>*", { y:34, opacity:0, duration:1.1, stagger:.14, ease:"power3.out", delay:.55 });
      if ($(".orb-one")) gsap.to(".orb-one", { rotation:25, scale:1.12, duration:12, repeat:-1, yoyo:true, ease:"sine.inOut" });
      if ($(".orb-two")) gsap.to(".orb-two", { rotation:-18, scale:.94, duration:15, repeat:-1, yoyo:true, ease:"sine.inOut" });
      gsap.utils.toArray(".map-heading,.sample-properties-head,.goa-world-heading,.next-step-section h2").forEach(el => gsap.from(el, { y:35, opacity:0, duration:.9, ease:"power3.out", scrollTrigger:{ trigger:el, start:"top 88%", once:true } }));
    } catch (e) { console.warn("Motion effects unavailable", e); }
  }

  // North Goa interactive map (Leaflet + OpenStreetMap)
  let goaMap = null;
  const places = [
    { id:"assagao", name:"Assagao", coordinates:[15.6027,73.8075], detail:"Lush lanes, heritage homes and a slower rhythm." },
    { id:"anjuna", name:"Anjuna", coordinates:[15.5735,73.7405], detail:"A lively mix of beaches, cafés and village life." },
    { id:"vagator", name:"Vagator", coordinates:[15.596,73.735], detail:"Dramatic coastline, sunsets and relaxed hideaways." },
    { id:"siolim", name:"Siolim", coordinates:[15.617,73.786], detail:"A peaceful village setting close to North Goa's coast." }
  ];
  function selectArea(id) {
    const place = places.find(p => p.id === id);
    const label = $("#map-area-label"), title = $("#map-area-title"), copy = $("#map-area-copy");
    if (label) label.textContent = place ? "NORTH GOA / " + place.name.toUpperCase() : "SELECTED LOCATION";
    if (title) title.innerHTML = place ? place.name + "<br><em>North Goa.</em>" : "Explore<br><em>North Goa.</em>";
    if (copy) copy.textContent = place ? place.detail : "Choose a marked area to explore its property neighbourhood.";
    $$(".location-chip").forEach(btn => btn.classList.toggle("active", btn.dataset.location === (place ? id : "all")));
    if (goaMap && place) goaMap.flyTo(place.coordinates, 14, { duration:1.1 });
  }
  function initGoaMap() {
    const el = $("#goa-map-canvas");
    if (!el || !window.L || goaMap) return;
    try {
      goaMap = L.map(el, { scrollWheelZoom:false, zoomControl:false, attributionControl:true }).setView([15.59,73.78], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom:19,
        attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      }).addTo(goaMap);
      L.control.zoom({ position:"bottomright" }).addTo(goaMap);
      places.forEach(place => {
        const icon = L.divIcon({
          className:"dream-map-pin-wrap",
          html:'<span class="dream-map-pin"><i></i>' + place.name + '</span>',
          iconSize:[110,34], iconAnchor:[55,34]
        });
        L.marker(place.coordinates, { icon }).addTo(goaMap).on("click", () => selectArea(place.id));
      });
      setTimeout(() => goaMap && goaMap.invalidateSize(true), 300);
    } catch (e) {
      console.error("Dream Space map could not initialise", e);
      goaMap = null;
    }
  }
  window.addEventListener("load", () => setTimeout(initGoaMap, 250), { once:true });
  window.addEventListener("resize", () => goaMap?.invalidateSize());

  $$(".location-chip").forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.location;
    if (id === "all") {
      selectArea("all");
      goaMap?.flyTo([15.59,73.78], 11, { duration:1.1 });
    } else selectArea(id);
  }));
  $("#map-tilt")?.addEventListener("click", () => {
    if (!goaMap) return;
    const zoomIn = goaMap.getZoom() < 13;
    goaMap.flyTo([15.59,73.78], zoomIn ? 12 : 11, { duration:1 });
    $("#map-tilt").innerHTML = zoomIn ? "ZOOM OUT <span>↗</span>" : "ZOOM IN <span>↗</span>";
  });
  $("#map-reset")?.addEventListener("click", () => {
    goaMap?.flyTo([15.59,73.78], 11, { duration:1.1 });
    selectArea("all");
  });
})();