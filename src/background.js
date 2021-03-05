const browser = require("webextension-polyfill");
import {addRequestDoneListener} from "./background/addRequestDoneListener";
import {StoreListingCache} from "./background/StoreListingCache";
import {parseSearchItemsResponse} from "./background/parseSearchItemsResponse";
import { forceTryCatch } from "./utils";

const RESPONSES_CACHE = new StoreListingCache();

/////////////
/// intercept store listing request

const ULR_FILTER = {
  urls: [
    "https://store.bricklink.com/ajax/clone/store/searchitems.ajax?*"
  ]
};

const onShopPageItemsResponse = (requestDetails, dataRaw) => {
  const dataJson = JSON.parse(dataRaw);
  const data = parseSearchItemsResponse(requestDetails, dataJson);
  RESPONSES_CACHE.addListings(requestDetails.originUrl, data);
};

addRequestDoneListener(onShopPageItemsResponse, ULR_FILTER);

/////////////
/// inter-extension communication

const handleInterExtensionMessage = (message, sender, sendResponse) => {
  const tabUrl = sender?.tab?.url;
  console.log("RCV:", { tabUrl, message });
  if (!tabUrl) { return; }

  switch(message.type) {
    case "GET_LISTING_DETAILS": {
      const listingData = RESPONSES_CACHE.getListingItem(tabUrl, message.data);
      sendResponse(listingData);
      break;
    }
    default:
      console.error(`Unrecognised message`, message);
  }
};

browser.runtime.onMessage.addListener(
  forceTryCatch(handleInterExtensionMessage)
);
