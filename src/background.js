const browser = require("webextension-polyfill");
import {addRequestDoneListener} from "./background/addRequestDoneListener";
import {pick} from "./utils";

const ULR_FILTER = {
  urls: [
    "https://store.bricklink.com/ajax/clone/store/searchitems.ajax?*"
  ]
};

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
};

addRequestDoneListener(
  onShopPageItemsResponse,
  ULR_FILTER,
);
