import { pick } from "../utils";

const isValidQueryValue = v => typeof v === "string" && v.length > 0;

const parseQuery = query => {
  const keysWithValues = Object.keys(query).filter(
    key => isValidQueryValue(query[key])
  );
  return pick(query, keysWithValues);
};

const getListedItems = groups => {
  const propsToCopy = [
    "itemNo", "itemID", "itemName", "itemType",
    "colorID", "colorName",
    "invID", "invPrice", "invQty",
    "salePrice", "rawConvertedPrice"
  ];
  return groups[0].items.map(e => pick(e, propsToCopy));
};

export const parseSearchItemsResponse = (requestDetails, data) => {
  const { query, groups } = data.result;

  return {
    query: parseQuery(query),
    listedItems: getListedItems(groups),
    request: {
      originUrl: requestDetails.originUrl,
      ajaxUrl: requestDetails.url,
    }
  };
};
