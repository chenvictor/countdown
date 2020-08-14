// @flow

import React from 'react';
import Button from 'react-bootstrap/Button';

type Variant = 'primary' | 'success' | 'danger';

type Props = {
  text: string,
  isLoading?: bool,
  isDisabled?: bool,
  variant?: Variant,
  onClick: () => void,
};

const CustomButton = ({
  text,
  variant = 'primary',
  isLoading = false,
  isDisabled = false,
  onClick,
}: Props) => {
  return <Button variant={variant} onClick={onClick} disabled={isDisabled || isLoading}>{isLoading ? 'Loading...' : text}</Button>
};

export default CustomButton;
