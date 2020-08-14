// @flow
import React, {useContext, useState} from 'react';
import Form from 'react-bootstrap/Form';

import type {Response} from './shared/types';
import {MESSAGE} from './shared/constants';

import WSContext from './WSContext';
import Button from './components/CustomButton';

const ERRORS = {
  NAME: {
    BLANK: 'Please enter a name',
    TAKEN: MESSAGE.NAME_TAKEN,
  }
};

const Setup = () => {
  const ws = useContext(WSContext);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<?string>(ERRORS.NAME.BLANK);
  const [loading, setLoading] = useState(false);
  const onNameChange = (e) => {
    const newName: string = e.target.value;
    setName(newName);
    if (newName.length === 0) {
      setNameError(ERRORS.NAME.BLANK);
    } else if (!!nameError) {
      setNameError(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!!nameError) {
      return;
    }
    if (name.length === 0) {
      setNameError(ERRORS.NAME.BLANK);
      return;
    }
    setLoading(true);
    ws.sendNameUpdate(name).then((res: Response) => {
      if (res.error) {
        setNameError(res.message);
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <h2>Enter a name to join the game</h2>
      <Form noValidate onSubmit={onSubmit}>
        <Form.Group controlId='nameInput'>
          <Form.Label>Name</Form.Label>
          <Form.Control autoFocus isInvalid={!!nameError} placeholder='Name' required value={name} onChange={onNameChange} maxLength={20} />
          <Form.Control.Feedback type='invalid'>{nameError}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='submitButton'>
          <Button text='Join' isDisabled={!!nameError} isLoading={loading} />
        </Form.Group>
      </Form>
    </div>
  );
};

export default Setup;
