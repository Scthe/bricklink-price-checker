const browser = require("webextension-polyfill");

/**
 * Calls listener with the request details and raw response. Works only on firefox
 */
export const addRequestDoneListener = (listener, urlFilter) => {
  function listenerWrapper(details) {
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();
    let data = "";

    filter.ondata = event => {
      const str = decoder.decode(event.data, {stream: true});
      data += str;
      filter.write(encoder.encode(str));
    }

    filter.onstop = event => {
      filter.close();
      listener(details, data);
    }
  }

  browser.webRequest.onBeforeRequest.addListener(
    listenerWrapper,
    urlFilter,
    ["blocking"]
  );
};
