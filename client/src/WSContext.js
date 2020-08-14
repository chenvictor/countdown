// @flow

import React from 'react';
import WebSocketClient from './wsclient';

const dummy: WebSocketClient = ('lol': any);

const WSContext = React.createContext<WebSocketClient>(dummy);

export default WSContext;