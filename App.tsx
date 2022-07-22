/* eslint-disable linebreak-style */
import * as React from 'react';
import { AuthProvider } from './src/auth/AuthProvider';
import NavigationComponent from './src/components/Navigation';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

const pubnub = new PubNub({
  publishKey: 'pub-c-24692584-25f8-4bc8-8a6b-765058e95407',
  subscribeKey: 'sub-c-139ad80b-7230-4c5a-9fd3-bbecf6b76b62',
  uuid: 'asd',
});

export default function App() {
  return (
    <PubNubProvider client={pubnub}>
      <AuthProvider>
        <NavigationComponent />
      </AuthProvider>
    </PubNubProvider>
  );
}
