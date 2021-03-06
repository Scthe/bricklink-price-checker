export const identity = e => e;

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

/* by default there is no info in console in ff?! Why?! */
export const forceTryCatch = fn => (...args) => {
  try {
    fn(...args);
  } catch(e) {
    console.error("[bricklink-price-checker Error]", e);
    throw e;
  }
};

/** seconds to miliseconds */
export const fromSeconds = seconds => seconds * 1000;

/** Cannot be used in extensions when relying on external requests.. */
export const afterAllPageLoaded = cb => {
  if (document.readyState === 'complete') {
    cb();
  } else {
    window.addEventListener('load', cb);
  }
};


/** Execute callback once checkFn returns true */
export const executeAfterCondition = (checkFn, cb, timeoutMs) => {
  const intervalId = setInterval(() => {
    if (checkFn()) {
      clearInterval(intervalId);
      cb();
    }
  }, fromSeconds(1));

  setTimeout(() => clearInterval(intervalId), timeoutMs);
};
