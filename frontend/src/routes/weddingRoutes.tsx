import React from 'react';
import { Route } from 'react-router-dom';
import WeddingLayout from '../pages/wedding/WeddingLayout';
import DashboardPage from '../pages/DashboardPage';
import WeddingHallsPage from '../pages/WeddingHallsPage';
import WeddingServicesPage from '../pages/WeddingServicesPage';

export const weddingRoutes = (
  <Route path="/wedding" element={<WeddingLayout />}>
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="halls" element={<WeddingHallsPage />} />
    <Route path="services" element={<WeddingServicesPage />} />
  </Route>
);
