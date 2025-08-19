import React from 'react';
import { Route } from 'react-router-dom';
import RealEstateLayout from '../pages/realestate/RealEstateLayout';
import DashboardPage from '../pages/DashboardPage';
import RealEstatesPage from '../pages/RealEstatesPage';
import ApartmentTradesPage from '../pages/ApartmentTradesPage';

export const realestateRoutes = (
  <Route path="/" element={<RealEstateLayout />}>
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="realestates" element={<RealEstatesPage />} />
    <Route path="apartments" element={<ApartmentTradesPage />} />
  </Route>
);
