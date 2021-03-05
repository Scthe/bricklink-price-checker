export const identity = e => e;

export const fetchJson = async (url, opts, transformFn=identity) => {
  const resp = await fetch(url, opts);
  return transformFn(resp);
};

export const pick = (obj, props) => props.reduce(
  (acc, propName) => ({ ...acc, [propName]: obj[propName] }),
  {}
);
