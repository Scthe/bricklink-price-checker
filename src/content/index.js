import { h, render } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
/** @jsx h */

import { useLegoPart } from '../bricklink/useLegoPart';

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

console.log("=== content/index 5 ===");





const STYLE = {
  position: 'fixed',
  color: 'red',
  fontSize: '20px',
  zIndex: 99999,
  border: '2px solid blue',
  borderRadius: '5px',
  background: 'bisque',
};

export default () => {
  const dd = useLegoPart({
    idItem: '189263',
    // idItem: '444',
    // idColor: '10',
    currency: '114',
  });
  console.log("data", dd.data);

  return (
    <div style={STYLE}>
      hellow!
    </div>
  );
};
