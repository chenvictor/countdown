import React from 'react';
import Button from 'react-bootstrap/Button';

const CustomButton = ({
  text,
  isLoading = false,
  isDisabled = false,
}) => {
  return <Button type='submit' disabled={isDisabled || isLoading}>{isLoading ? 'Loading...' : text}</Button>
};

export default CustomButton;
