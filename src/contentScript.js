const browser = require("webextension-polyfill");
import {
  forceTryCatch, fromSeconds, executeAfterCondition,
  getNodeText, clearChildren, createElement,
} from "./utils";
import { fetchPartData } from "./content/fetchPartData";
import * as ui from "./content/ui";
import * as Styles from "./content/styles";

const initialize = forceTryCatch(() => {
  const listedItems = document.querySelectorAll(".store-items article.item");

  for (const itemEl of listedItems) {
    const itemName = getItemData(itemEl);
    if (itemName != null) {
      addPriceCheckButton(itemEl, itemName);
    }
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
  if (itemNameEl.length === 1) {
    return {
      colorName: undefined,
      itemName: getNodeText(itemNameEl[0]),
    };
  }
  return null;
}

function addPriceCheckButton(itemEl, itemName) {
  const cartBtnEl = itemEl.querySelector(".addToCart");
  const parentEl = cartBtnEl.parentNode;

  const container = createElement(parentEl, "div", {
    style: Styles.CONTAINER,
  });

  ui.renderCheckPriceButton(container, {
    onClick: createPriceCheckHandler(container, itemName),
  });
}

function createPriceCheckHandler (container, clickedItem) {
  let loaderEl;

  return forceTryCatch(async () => {
    try {
      clearChildren(container);
      loaderEl = ui.renderLoader(container);

      const item = await getItemDetailsFromStoreRequest(clickedItem);
      ui.renderPartLink(container, {part: item});

      const prices = await fetchPartData({
        idItem: item.itemID,
        idColor: item.colorID,
      });
      ui.renderPriceDetails(container, {item, prices});
    } catch (e) {
      console.log(e);
      // No `clearChildren(container);`. Render below whatever was OK
      ui.renderErrorMessage(container, {
        text: "Error, could not get the prices"
      });
      throw e;
    } finally {
      container.removeChild(loaderEl);
    }
  });
};

/** Get clicked item details from store listing AJAX using background script */
function getItemDetailsFromStoreRequest(clickedItem) {
  // there are too many ways this code can break (e.g. extension inter communication)
  // to handle errors in nice way
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(), fromSeconds(20));

    const message = {
      type: "GET_LISTING_DETAILS",
      data: clickedItem,
    };
    browser.runtime.sendMessage(message, async response => {
      resolve(response);
      clearTimeout(timeoutId);
    });
  })
}
