// @flow
import React, {useContext, useState} from 'react';
import WSContext from './WSContext';

import type {ID} from './types';
import type {WebSocketResponse} from './utils/wsplus';

import Form from 'react-bootstrap/Form';
import Button from './components/CustomButton';

const ERRORS = {
  NAME: {
    BLANK: 'Please enter a name',
    TAKEN: 'This name is taken'
  }
};

type Props = {
  setId: (ID) => void,
}

const Setup = ({setId}: Props) => {
  const ws = useContext(WSContext);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(ERRORS.NAME.BLANK);
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
    console.log('submitting', name);
    setLoading(true);
    ws.sendRes({
      newName: name,
    }).then((res: WebSocketResponse) => {
      setLoading(false);
      if (res.error) {
        console.error(res.message);
        setNameError(res.message);
      } else {
        setId(res.id);
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
