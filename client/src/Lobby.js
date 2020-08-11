import React, {useState} from 'react';

import Form from 'react-bootstrap/Form';
import Button from './components/CustomButton';

const ERRORS = {
  NAME: {
    BLANK: 'Please enter a name',
    TAKEN: 'This name is taken'
  }
};

const Lobby = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(ERRORS.NAME.BLANK);
  const [loading, setLoading] = useState(false);
  const onNameChange = (e) => {
    const newName = e.target.value;
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
    setTimeout(() => {
      setLoading(false);
      setNameError(ERRORS.NAME.TAKEN);
    }, 1500);
  };
  console.log({loading});

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

export default Lobby;
