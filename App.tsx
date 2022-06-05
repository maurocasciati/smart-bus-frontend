/* eslint-disable linebreak-style */
import * as React from 'react';
import { AuthProvider } from './src/auth/AuthProvider';
import NavigationComponent from './src/components/Navigation';

export default function App() {
  return (
    <AuthProvider>
      <NavigationComponent />
    </AuthProvider>
  );
}
