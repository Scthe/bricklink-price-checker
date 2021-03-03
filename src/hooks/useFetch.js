import { h, render } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

export const useFetch = (url, opts) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(async () => {
    try {
      let {transformFn, ...optsRest} = opts;
      transformFn = typeof transformFn === 'function' ? transformFn : () => {};

      const resp = await fetch(url, optsRest);
      console.log('[RESP OK]', resp);
      const data = await transformFn(resp);
      setData(data);
      setLoading(false);
    } catch (e) {
      console.log('[RESP ERR]', e);
      setError(e);
      setLoading(false);
    }
  }, []);

  return { loading, data, error };
};

///////////////////////////////////////////

/*
const STATE_LOADING = { isLoading: true };
const stateData = data => ({ isLoading: false, data });
const stateError = error => ({ isLoading: false, error })

const doRequest = async (url, opts, transformFn) => {
  const resp = await fetch(url, opts);
  return transformFn(resp);
};

const identity = e => e;

export const useFetch = (url, opts) => {
  const [state, dispatch] = useReducer(
    (_, action) => action,
    STATE_LOADING
  );

  useDeepCompareEffect(() => {
    dispatch(STATE_LOADING);

    let {transformFn, ...optsRest} = opts;
    transformFn = typeof transformFn === 'function' ? transformFn : identity;

    doRequest(url, opts, transformFn)
      .then(data => {
        console.log('[RESP OK]', data);
        dispatch(stateData(data));
      })
      .catch(err => {
        console.log('[RESP ERR]', err);
        dispatch(stateError(data));
      });

    return () => dispatch(STATE_LOADING);
  }, [url, opts]);

  return state;
};
*/
