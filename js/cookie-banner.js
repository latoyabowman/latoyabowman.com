(function () {
  var MOUNT_ID = "imbali-cookie-banner-mount";
  var CONSENT_KEY = "imbali_cookie_consent";
  var STYLE_ID = "imbali-cookie-banner-styles";

  var CSS = [
    "#imbali-cookie-banner {",
    "  display: none;",
    "  position: fixed;",
    "  bottom: 0;",
    "  left: 0;",
    "  right: 0;",
    "  z-index: 9999;",
    "  background: #0F0D0A;",
    "  color: #F0EDE8;",
    "  font-family: 'Outfit', system-ui, sans-serif;",
    "  padding: 18px 24px;",
    "  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);",
    "}",
    "#imbali-cookie-banner.is-visible {",
    "  display: block;",
    "}",
    ".imbali-cookie-banner__inner {",
    "  max-width: 1000px;",
    "  margin: 0 auto;",
    "  display: flex;",
    "  flex-wrap: wrap;",
    "  align-items: center;",
    "  justify-content: space-between;",
    "  gap: 16px;",
    "}",
    ".imbali-cookie-banner__text {",
    "  margin: 0;",
    "  font-size: 13px;",
    "  font-weight: 300;",
    "  line-height: 1.5;",
    "  color: #E8E5DE;",
    "  flex: 1;",
    "  min-width: 240px;",
    "}",
    ".imbali-cookie-banner__link {",
    "  color: #9FC9D9;",
    "  text-decoration: underline;",
    "}",
    ".imbali-cookie-banner__actions {",
    "  display: flex;",
    "  gap: 8px;",
    "  flex-shrink: 0;",
    "}",
    "#imbali-cookie-decline {",
    "  background: transparent;",
    "  color: #B8B5AC;",
    "  border: 1px solid #4A4742;",
    "  padding: 9px 16px;",
    "  border-radius: 4px;",
    "  font-family: 'Outfit', sans-serif;",
    "  font-size: 12.5px;",
    "  font-weight: 400;",
    "  cursor: pointer;",
    "  transition: all 0.2s ease;",
    "}",
    "#imbali-cookie-decline:hover {",
    "  border-color: #6B6B65;",
    "  color: #E8E5DE;",
    "}",
    "#imbali-cookie-accept {",
    "  background: #0a4a63;",
    "  color: #FFFFFF;",
    "  border: none;",
    "  padding: 9px 18px;",
    "  border-radius: 4px;",
    "  font-family: 'Outfit', sans-serif;",
    "  font-size: 12.5px;",
    "  font-weight: 500;",
    "  cursor: pointer;",
    "  transition: all 0.2s ease;",
    "}",
    "#imbali-cookie-accept:hover {",
    "  background: #08394d;",
    "}"
  ].join("\n");

  var HTML = [
    '<div id="imbali-cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">',
    '  <div class="imbali-cookie-banner__inner">',
    '    <p class="imbali-cookie-banner__text">',
    "      This site uses cookies for booking, payment, and basic analytics — nothing sold, nothing shady.",
    '      <a href="/privacy" class="imbali-cookie-banner__link">Learn more</a>',
    "    </p>",
    '    <div class="imbali-cookie-banner__actions">',
    '      <button type="button" id="imbali-cookie-decline">Decline</button>',
    '      <button type="button" id="imbali-cookie-accept">Accept</button>',
    "    </div>",
    "  </div>",
    "</div>"
  ].join("");

  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {}
  }

  function hideBanner(banner) {
    banner.classList.remove("is-visible");
  }

  function init() {
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) return;

    if (!document.getElementById(STYLE_ID)) {
      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    mount.innerHTML = HTML;

    var banner = document.getElementById("imbali-cookie-banner");
    var acceptBtn = document.getElementById("imbali-cookie-accept");
    var declineBtn = document.getElementById("imbali-cookie-decline");

    if (!banner || !acceptBtn || !declineBtn) return;

    if (!getConsent()) {
      banner.classList.add("is-visible");
    }

    acceptBtn.addEventListener("click", function () {
      setConsent("accepted");
      hideBanner(banner);
    });

    declineBtn.addEventListener("click", function () {
      setConsent("declined");
      hideBanner(banner);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
