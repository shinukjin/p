import React from 'react';
import { Route } from 'react-router-dom';
import AuthLayout from '../pages/auth/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

export const authRoutes = (
  <Route path="/" element={<AuthLayout />}>
    <Route index element={<LoginPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignupPage />} />
  </Route>
);
