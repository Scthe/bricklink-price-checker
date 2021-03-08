import { pick } from "../utils";

const isValidQueryValue = v => typeof v === "string" && v.length > 0;

const parseQuery = query => {
  const keysWithValues = Object.keys(query).filter(
    key => isValidQueryValue(query[key])
  );
  return pick(query, keysWithValues);
};

const getListedItems = (groups, categories) => {
  const propsToCopy = [
    "itemNo", "itemID", "itemName", "itemType",
    "colorID", "colorName",
    "invID", "invPrice", "invQty",
    "salePrice", "rawConvertedPrice"
  ];

  return groups[0].items.map(e => ({
    ...pick(e, propsToCopy),
    categoryName: categories.find(c => c.type === e.itemType)?.title || "",
  }));
};

export const parseSearchItemsResponse = (requestDetails, data) => {
  // console.log(data.result)
  const { query, groups, categories } = data.result;

  return {
    query: parseQuery(query),
    listedItems: getListedItems(groups, categories),
    request: {
      originUrl: requestDetails.originUrl,
      ajaxUrl: requestDetails.url,
    }
  };
};
