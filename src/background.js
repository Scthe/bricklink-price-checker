const browser = require("webextension-polyfill");
import {addRequestDoneListener} from "./background/addRequestDoneListener";
import {pick, equalStringCaseInsensitive} from "./utils";

const ULR_FILTER = {
  urls: [
    "https://store.bricklink.com/ajax/clone/store/searchitems.ajax?*"
  ]
};

// TODO create class for this
const RESPONSES_CACHE = {};

const parseShopPageItemsResponse = data => {
  const isValidQueryValue = v => typeof v === "string" && v.length > 0;

  const parseQuery = query => {
    const keysWithValues = Object.keys(query).filter(
      key => isValidQueryValue(query[key])
    );
    return pick(query, keysWithValues);
  };

  const { query, groups } = data.result;
  return {
    query: parseQuery(query),
    listedItems: groups[0].items.map(e => pick(e, [
      "itemID", "itemName",
      "colorID", "colorName",
      "invID", "invPrice", "invQty",
      "salePrice", "rawConvertedPrice"
    ])),
  };
};

const onShopPageItemsResponse = (requestDetails, dataRaw) => {
  const dataJson = JSON.parse(dataRaw);
  // console.log("requestDetails", requestDetails);
  // console.log("dataJson", dataJson);
  const data = {
    ...parseShopPageItemsResponse(dataJson),
    request: {
      originUrl: requestDetails.originUrl,
      ajaxUrl: requestDetails.url,
    }
  };
  console.log("data", data);
  RESPONSES_CACHE[requestDetails.originUrl] = data;
};

addRequestDoneListener(
  onShopPageItemsResponse,
  ULR_FILTER,
);

const getItemListing = ({
  originUrl, colorName, itemName
}) => {
  const listingRequest = RESPONSES_CACHE[originUrl] || {};
  console.log("listingRequest", listingRequest)
  const allItems = listingRequest?.listedItems || [];
  const item = allItems.find(e => {
    const matchesName = equalStringCaseInsensitive(e.itemName, itemName);
    const matchesColor = colorName == null || equalStringCaseInsensitive(colorName, e.colorName);
    if (matchesName) {
      console.log("maybe", e);
    }
    return matchesName && matchesColor;
  });
  console.log("item", item)
  return item;
  // return {a: "asdasd"}
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabUrl = sender?.tab?.url;
  if (!tabUrl) { return; }

  console.log("RCV:", { tabUrl, message });

  switch(message.type) {
    case "GET_LISTING_DETAILS": {
      const listingData = getItemListing({
        originUrl: tabUrl,
        ...message.data,
      });
      console.log("WILL response", listingData)
      sendResponse(listingData);
      break;
    }
    default:
      console.error(`Unrecognised message`, message);
  }
});
