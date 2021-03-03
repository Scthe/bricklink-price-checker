import {dequal as deepEqual} from 'dequal';
import { useEffect, useRef } from 'preact/hooks';

const useDeepCompareMemoize = value => {
  const ref = useRef();
  const signalRef = useRef(0);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return [signalRef.current]
}

export const useDeepCompareEffect = (callback, dependencies) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(callback, useDeepCompareMemoize(dependencies))
}
