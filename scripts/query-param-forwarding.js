(function () {
  const DOMAIN_WHITE_LIST = [
    "songbirdtherapy.paperform.co",
    "songbirdcare.com",
    "formsort.com",
    "formsort.app",
    "kbsufef9mn.formsort.app",
    "start.songbirdcare.com",
    "signup.songbirdcare.com",
  ];

  const QUERY_PARAMS_WHITE_LIST = new Set([
    "utm_medium",
    "utm_source",
    "utm_campaign",
    "gclid",
  ]);

  const FILTERED_SEARCH_PARAMS = getFilteredSearchParams(
    window.location.search,
    QUERY_PARAMS_WHITE_LIST
  );

  modifyATags(DOMAIN_WHITE_LIST, QUERY_PARAMS_WHITE_LIST);

  function modifyATags(domains, queryParams) {
    const links = document.querySelectorAll("a");
    for (const link of links) {
      const hostname = link.hostname;
      if (!hostname.includes("#") && !hostMatchesDomains(domains, hostname)) {
        continue;
      }
      const url = new URL(link.href);
      for (const [key, value] of FILTERED_SEARCH_PARAMS.entries()) {
        url.searchParams.set(key, value);
      }
      link.href = url.toString();
    }
  }

  function hostMatchesDomains(domains, host) {
    return domains.some((domain) => host.includes(domain));
  }

  function getFilteredSearchParams(search, queryParamsWhiteList) {
    const searchParams = new URLSearchParams(search);
    const filteredSearchParams = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (queryParamsWhiteList.has(key)) {
        filteredSearchParams.set(key, value);
      }
    }
    return filteredSearchParams;
  }
})();
