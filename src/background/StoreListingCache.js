import { equalStringCaseInsensitive } from "../utils";

const matchesItem = (listingItem, itemQuery) => {
  const {colorName, itemName} = itemQuery;
  const matchesName = equalStringCaseInsensitive(listingItem.itemName, itemName);
  const matchesColor = colorName == null || equalStringCaseInsensitive(colorName, listingItem.colorName);
  /*console.log({
    itemQuery,
    itemName: listingItem.itemName,
    colorName: listingItem.colorName,
  })*/
  return matchesName && matchesColor;
}

export class StoreListingCache {
  cache = {};

  addListings(storeListingUrl, items) {
    console.log(`CACHE[${storeListingUrl}] adding listing with ${items.listedItems.length} items`)
    this.cache[storeListingUrl] = items;
  }

  getListingItem(storeListingUrl, itemQuery) {
    const listingRequest = this.cache[storeListingUrl] || {};
    const allItems = listingRequest?.listedItems || [];
    console.log(`CACHE[${storeListingUrl}] will search within ${allItems.length} items`)
    return allItems.find(e => matchesItem(e, itemQuery));
  }
}
