/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied. See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthReadyContextType {
  isAuthReady: boolean;
  setAuthReady: (ready: boolean) => void;
}

const AuthReadyContext = createContext<AuthReadyContextType | undefined>(undefined);

export const AuthReadyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setAuthReady = (ready: boolean) => {
    setIsAuthReady(ready);
  };

  return (
    <AuthReadyContext.Provider value={{ isAuthReady, setAuthReady }}>
      {children}
    </AuthReadyContext.Provider>
  );
};

export const useAuthReady = (): AuthReadyContextType => {
  const context = useContext(AuthReadyContext);
  if (!context) {
    throw new Error('useAuthReady must be used within an AuthReadyProvider');
  }
  return context;
};