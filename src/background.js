console.log("[BACKGROUND] start");

const onUrl = req => {
  console.log("Loading: " + req.url);
};

browser.webRequest.onBeforeRequest.addListener(
  onUrl,
  // {urls: ["<all_urls>"]}
  {urls: [
    "https://store.bricklink.com/ajax/clone/store/searchitems.ajax"
  ]}
);
