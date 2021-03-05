export const identity = e => e;

export const fetchJson = async (url, opts, transformFn=identity) => {
  const resp = await fetch(url, opts);
  return transformFn(resp);
};

export const pick = (obj, props) => props.reduce(
  (acc, propName) => ({ ...acc, [propName]: obj[propName] }),
  {}
);

export const setStyle = (itemEl, styleProps) => {
  Object.keys(styleProps).forEach(key => {
    itemEl.style[key] = styleProps[key];
  });
}

export const getNodeText = itemEl =>
  itemEl.textContent.trim()

export const equalStringCaseInsensitive = (a, b) => {
  const a_ = a.toLowerCase();
  const b_ = b.toLowerCase();
  return a_ === b_;
}
