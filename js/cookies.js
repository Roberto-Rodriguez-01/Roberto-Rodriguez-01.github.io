document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const consent = localStorage.getItem("cookieConsent");

  if (!consent) {
    banner.style.display = "flex";
  }

  document.getElementById("cookie-accept").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "all");
    banner.style.display = "none";
    // Optionally enable analytics or tracking here
  });

  document.getElementById("cookie-decline").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "essential");
    banner.style.display = "none";
    // Optionally disable analytics here
  });
});
