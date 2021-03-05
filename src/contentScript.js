const browser = require("webextension-polyfill");
import { setStyle, getNodeText, forceTryCatch } from "./utils";
import { fetchPartData } from "./content/fetchPartData";
import * as Styles from "./content/styles";

/*

TODO manifest permissions are too broad!

Background script:
1. Intercept store listing
2. read store name from referrer, rest of data from response
3. cache this entry

Content script:
1. user clicks to get element info
2. detect element from HTML
3. detect shop from url, check url params
4. query background script for shop entry list
4.1. if not found, tell user to refresh the page
5. find clicked item in shop list to read idItem and color, maybe currency code

*/

window.addEventListener('load', forceTryCatch(() => {
  console.log("window.load callback")
  const listedItems = document.querySelectorAll(".store-items article.item");

  for (const itemEl of listedItems) {
    const itemName = getItemData(itemEl);
    addPriceCheckButton(itemEl, itemName);
  }
}));

///////////////////
/// UTILS

function getItemData(itemEl) {
  // one is color, one is name
  const itemNameEl = itemEl.querySelectorAll(".description strong");
  if (itemNameEl.length > 1) {
    return {
      colorName: getNodeText(itemNameEl[0]),
      itemName: getNodeText(itemNameEl[1]),
    };
  }
  return {
    colorName: undefined,
    itemName: getNodeText(itemNameEl[0]),
  };
}

function addPriceCheckButton(itemEl, itemName) {
  const cartBtnEl = itemEl.querySelector(".addToCart");
  const parentEl = cartBtnEl.parentNode;

  const container = document.createElement("div");
  setStyle(container, Styles.CONTAINER);

  const newBtnNode = document.createElement("button");
  newBtnNode.setAttribute('type', 'button');
  newBtnNode.textContent = 'Check Price';
  setStyle(newBtnNode, Styles.PRICE_CHECK_BUTTON);
  newBtnNode.addEventListener('click', onPriceCheck);
  container.appendChild(newBtnNode);

  parentEl.appendChild(container);

  function onPriceCheck() {
    // console.log("clicked", itemName);
    getItemDetailsFromStoreRequest(itemName);
  }
}

function getItemDetailsFromStoreRequest(itemName) {
  const message = {
    type: "GET_LISTING_DETAILS",
    data: itemName,
  };

  browser.runtime.sendMessage(message, response => {
    console.log("Clicked", response);
    fetchPartData({
      idItem: response.itemID,
      idColor: response.colorID, // if 0 or colorName is "", then???
    })
    .then(resp => console.log("prices", resp))
    .catch(e =>  console.error("prices error", e))
  });
}
