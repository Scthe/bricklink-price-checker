import { parse } from 'node-html-parser';

const parseForSaleRow = el => {
  if (el.childNodes.length !== 3) {
    return undefined;
  }
  return {
    quantity: parseInt(el.childNodes[1].innerText, 10),
    price: el.childNodes[2].innerText,
  };
};

const parseForSaleTable = el => {
  return el.childNodes.map(parseForSaleRow).filter(e => e != null);
};

const parseHTMLResp = async resp => {
  const text = await resp.text();
  const root = parse(text, {
    blockTextElements: {
      script: true,	// keep text content when parsing
      noscript: true,	// keep text content when parsing
      style: true,		// keep text content when parsing
      pre: true			// keep text content when parsing
    },
  });
  const table = root.querySelectorAll('.pcipgInnerTable');
  const tablePricesNew = table[2];
  const tablePricesUsed = table[3];
  return {
    partsNew: parseForSaleTable(tablePricesNew),
    partsUsed: parseForSaleTable(tablePricesUsed),
  };
};

export const fetchPartData = async ({
  idItem,
  idColor,
  currency,
}) => {
  // https://www.bricklink.com/v2/catalog/catalogitem_pgtab.page?idItem=189263&st=2&gm=1&gc=0&ei=0&prec=2&showflag=0&showbulk=0&currency=114
  // https://www.bricklink.com/v2/catalog/catalogitem_pgtab.page?idItem=444&idColor=7&st=2&gm=1&gc=0&ei=0&prec=2&showflag=0&showbulk=0&currency=114
  // https://www.bricklink.com/v2/catalog/catalogitem_pgtab.page?idItem=444&idColor=10&st=2&gm=1&gc=0&ei=0&prec=2&showflag=0&showbulk=0&currency=114

  /*console.log('[REQUEST PART]', {
    idItem,
    idColor,
    currency,
  });*/

  let url = `https://www.bricklink.com/v2/catalog/catalogitem_pgtab.page?idItem=${idItem}&st=2&gm=1&gc=0&ei=0&prec=2&showflag=0&showbulk=0`;
  if (idColor) {
    url += `&idColor=${idColor}`
  }
  if (currency) {
    url += `&currency=${currency}`
  }

  const resp = await fetch(url, {
    "referrer": "https://www.bricklink.com/v2/catalog/catalogitem.page",
  });

  return parseHTMLResp(resp);
}
