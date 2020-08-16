// @flow

import React, {useContext, useState} from 'react';
import Form from 'react-bootstrap/Form';

import type {Response} from '../shared';

import WSContext from '../WSContext';
import Button from './CustomButton';

const BLANK_NAME_ERROR = 'Please enter a name';

const Setup = () => {
  const ws = useContext(WSContext);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<?string>(BLANK_NAME_ERROR);
  const [loading, setLoading] = useState(false);
  const onNameChange = (e) => {
    const newName: string = e.target.value;
    setName(newName);
    if (newName.length === 0) {
      setNameError(BLANK_NAME_ERROR);
    } else if (!!nameError) {
      setNameError(null);
    }
  };
  const validateName = () => {
    const trimmed = name.trim();
    if (trimmed !== name) {
      setName(trimmed);
    }
  };

  const submitName = () => {
    if (!!nameError) {
      return;
    }
    if (name.length === 0) {
      setNameError(BLANK_NAME_ERROR);
      return;
    }
    setLoading(true);
    ws.sendNameUpdate(name).then((res: Response) => {
      if (res.error) {
        setNameError(res.message);
        setLoading(false);
      }
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    submitName();
  };

  return (
    <div>
      <h2>Enter a name to join the game</h2>
      <Form noValidate onSubmit={onSubmit}>
        <Form.Group controlId='nameInput'>
          <Form.Label>Name</Form.Label>
          <Form.Control onBlur={validateName} autoFocus isInvalid={!!nameError} placeholder='Name' required value={name} onChange={onNameChange} maxLength={20} />
          <Form.Control.Feedback type='invalid'>{nameError}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='submitButton'>
          <Button text='Join' isDisabled={!!nameError} isLoading={loading} onClick={submitName} />
        </Form.Group>
      </Form>
    </div>
  );
};

export default Setup;
