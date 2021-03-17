if (
  window.location.href.includes("https://app.tapsi.cab/") &&
  window.localStorage.token
) {
  const event = new CustomEvent("PassAccessToken", {
    detail: window.localStorage.token,
  });

  window.dispatchEvent(event);
}
