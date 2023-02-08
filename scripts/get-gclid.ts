(function (cookieArg: string) {
  function getGclid(): string | undefined {
    const fromCookie = getCookie("_gcl_aw") ?? getCookie("_gac_UA-174249142-1");
    if (fromCookie) {
      const [, , gclid] = fromCookie.split(".", 3);
      if (gclid) {
        return gclid;
      }
    }
    return undefined;
  }

  function getCookie(name: string): string | undefined {
    const value = `; ${cookieArg}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const popped = parts.pop();
      if (popped) {
        return popped.split(";").shift();
      }
    }
    return undefined;
  }

  if (typeof window.history.replaceState === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  if (url.searchParams.get("gclid")) {
    return;
  }

  const gclid = getGclid();
  if (!gclid) {
    return;
  }
  url.searchParams.set("gclid", gclid);

  window.history.replaceState({ path: url.href }, "", url.href);
})(document.cookie);
