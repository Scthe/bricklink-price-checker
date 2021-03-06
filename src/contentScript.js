const browser = require("webextension-polyfill");
import { setStyle, getNodeText, forceTryCatch, afterAllPageLoaded, executeAfterCondition, fromSeconds } from "./utils";
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


const initialize = forceTryCatch(() => {
  const listedItems = document.querySelectorAll(".store-items article.item");

  for (const itemEl of listedItems) {
    const itemName = getItemData(itemEl);
    addPriceCheckButton(itemEl, itemName);
  }
});

executeAfterCondition(
  () => document.querySelector(".store-items") != null,
  initialize,
  fromSeconds(90)
);

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
  newBtnNode.addEventListener('click', forceTryCatch(onPriceCheck));
  container.appendChild(newBtnNode);

  parentEl.appendChild(container);

  async function onPriceCheck() {
    // TODO error handling when this throws
    const {item, prices} = await getItemDetailsFromStoreRequest(itemName);
    console.log("[Got prices]", {itemName, item, prices});

    container.textContent = ''; // clear content

    const linktoItemPageEl = document.createElement('a');
    linktoItemPageEl.textContent = item.itemNo;
    const colorParam = item.colorName.length > 0 ? `C=${item.colorID}` : "";
    linktoItemPageEl.href = `https://www.bricklink.com/v2/catalog/catalogitem.page?${item.itemType}=${item.itemNo}#T=P&${colorParam}`;
    linktoItemPageEl.target = "_blank";
    linktoItemPageEl.rel = "”noopener noreferrer”";
    container.appendChild(linktoItemPageEl);

    addRow("Cheapest USED", prices.partsUsed[0]?.price || "-");
    addRow("Cheapest NEW ", prices.partsNew[0]?.price || "-");
  }

  function addRow(label, price) {
    const textEl = document.createElement("span");
    textEl.textContent = `${label}: ${price}`;
    setStyle(textEl, {
      display: 'block',
      color: "#3a3a3a",
    });
    container.appendChild(textEl);
  }
}

function getItemDetailsFromStoreRequest(itemName) {
  const message = {
    type: "GET_LISTING_DETAILS",
    data: itemName,
  };

  return new Promise((resolve, reject) => {
    // there are too many ways this code can break (e.g. extension inter communication)
    // to handle errors in nice way
    const timeoutId = setTimeout(() => reject(), fromSeconds(20));

    browser.runtime.sendMessage(message, async response => {
      const prices = await fetchPartData({
        idItem: response.itemID,
        idColor: response.colorID, // if 0 or colorName is "", then???
      });
      resolve({item: response, prices});
      clearTimeout(timeoutId);
    });
  })
}
