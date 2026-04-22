/* =========================================================
 *  $JANNY  — minimal vanilla JS
 *  - Copy contract address
 *  - Live price widget from Dexscreener
 *  - Year auto-stamp in footer
 * ========================================================= */

(() => {
  const CONTRACT = "0x5ff46696d6e4896137acb1628b06e28c10ee9634";
  const DEX_URL  = `https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`;
  const CACHE_KEY = "janny_price_v1";
  const CACHE_TTL = 60_000; // 60s

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- copy button ---------- */
  const copyBtn = document.getElementById("copy-btn");
  const toast   = document.getElementById("toast");

  const showToast = (msg = "Copied!") => {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    toast.dataset.show = "true";
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.dataset.show = "false";
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 1800);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT);
    } catch {
      // fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = CONTRACT;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
    copyBtn.classList.add("copied");
    copyBtn.querySelector(".copy__text").textContent = "Copied";
    showToast("Address copied to clipboard");
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.querySelector(".copy__text").textContent = "Copy";
    }, 1800);
  };

  if (copyBtn) copyBtn.addEventListener("click", copyAddress);

  /* ---------- live price widget ---------- */
  const widget = document.getElementById("price-widget");

  const fmtUsd = (n) => {
    if (n == null || !isFinite(n)) return "—";
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(2) + "K";
    if (n >= 1)   return "$" + n.toFixed(2);
    if (n > 0)    return "$" + n.toPrecision(4);
    return "—";
  };

  const renderPrice = (pair) => {
    if (!widget || !pair) return;
    const priceEl  = widget.querySelector('[data-field="price"]');
    const mcapEl   = widget.querySelector('[data-field="mcap"]');
    const changeEl = widget.querySelector('[data-field="change"]');

    priceEl.textContent = fmtUsd(parseFloat(pair.priceUsd));

    const mcap = pair.marketCap ?? pair.fdv;
    mcapEl.textContent = fmtUsd(mcap);

    const change = pair?.priceChange?.h24;
    if (typeof change === "number") {
      const sign = change >= 0 ? "+" : "";
      changeEl.textContent = sign + change.toFixed(2) + "%";
      changeEl.classList.toggle("up", change >= 0);
      changeEl.classList.toggle("down", change < 0);
    } else {
      changeEl.textContent = "—";
    }
    widget.hidden = false;
  };

  const pickBestPair = (pairs) => {
    if (!Array.isArray(pairs) || pairs.length === 0) return null;
    // prefer ethereum pairs, then highest 24h volume
    const eth = pairs.filter(p => p.chainId === "ethereum");
    const pool = eth.length ? eth : pairs;
    return pool.sort((a, b) => (b?.volume?.h24 ?? 0) - (a?.volume?.h24 ?? 0))[0];
  };

  const loadPrice = async () => {
    // cache check
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { t, data } = JSON.parse(raw);
        if (Date.now() - t < CACHE_TTL) { renderPrice(data); return; }
      }
    } catch {}

    try {
      const res = await fetch(DEX_URL, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const pair = pickBestPair(json.pairs || []);
      if (!pair) return;
      renderPrice(pair);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data: pair }));
      } catch {}
    } catch {
      // silent fail — widget stays hidden
    }
  };

  loadPrice();

  /* ---------- gallery (manifest-driven) ---------- */
  const galleryGrid = document.getElementById("gallery-grid");
  const gallerySection = document.getElementById("gallery");
  const galleryNav = document.getElementById("gallery-nav");

  const buildLightbox = (src) => {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img src="${src}" alt="">`;
    box.addEventListener("click", () => box.remove());
    document.body.appendChild(box);
  };

  const renderGallery = (items) => {
    if (!galleryGrid || !Array.isArray(items) || items.length === 0) return;
    const frag = document.createDocumentFragment();
    items.forEach((item, i) => {
      const src = typeof item === "string" ? `assets/img/gallery/${item}` : item.src;
      const alt = typeof item === "string" ? `Janny meme #${i + 1}` : (item.alt || "");
      const a = document.createElement("button");
      a.type = "button";
      a.className = "gallery__item";
      a.innerHTML = `<img src="${src}" alt="${alt}" loading="lazy">`;
      a.addEventListener("click", () => buildLightbox(src));
      frag.appendChild(a);
    });
    galleryGrid.appendChild(frag);
    gallerySection.hidden = false;
    if (galleryNav) galleryNav.hidden = false;
  };

  const loadGallery = async () => {
    try {
      const res = await fetch("assets/img/gallery/manifest.json", { cache: "no-store" });
      if (!res.ok) return;
      const list = await res.json();
      renderGallery(list);
    } catch {
      // no manifest, gallery stays hidden
    }
  };
  loadGallery();

  /* ---------- pause videos if saved-data or slow connection ---------- */
  const conn = navigator.connection;
  if (conn && (conn.saveData || /^(slow-2g|2g)$/.test(conn.effectiveType))) {
    document.querySelectorAll("video").forEach(v => {
      v.removeAttribute("autoplay");
      v.pause();
      v.preload = "none";
    });
  }
})();
