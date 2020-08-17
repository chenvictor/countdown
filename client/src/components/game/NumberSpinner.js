// @flow
import {useEffect, useState, useRef} from 'react';

type Props = {|
  // Number of ms between number change
  ms?: number
|};

// TODO share with server code
const rand = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const genVal = () => rand(100, 1000);

const NumberSpinner = ({
  ms = 50,
}: Props) => {
  const interval = useRef(null);
  const [value, setValue] = useState(genVal())
  useEffect(() => {
    interval.current = setInterval(() => {
      if (interval.current) {
        setValue(genVal());
      }
    }, ms);
    return () => {
      clearInterval(interval.current);
      interval.current = null;
    };
  }, [ms]);
  return value;
}

export default NumberSpinner;