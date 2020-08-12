// @flow

import React from 'react';
import WebSocket from './utils/wsplus';

const WSContext = React.createContext<WebSocket>(new WebSocket('ws://localhost:3001'));

export default WSContext;