import { h, render } from 'preact';
import { useReducer } from 'preact/hooks';
import { useDeepCompareEffect } from "./useDeepCompareEffect";
import { fetchJson } from "../utils";

const STATE_LOADING = { isLoading: true };
const stateData = data => ({ isLoading: false, data });
const stateError = error => ({ isLoading: false, error })

export const useFetch = (url, opts) => {
  const [state, dispatch] = useReducer(
    (_, action) => action,
    STATE_LOADING
  );

  useDeepCompareEffect(() => {
    dispatch(STATE_LOADING);

    let {transformFn, ...optsRest} = opts;

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
