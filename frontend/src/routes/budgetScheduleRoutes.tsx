import React from 'react';
import { Route } from 'react-router-dom';
import BudgetScheduleLayout from '../pages/budgetSchedule/BudgetScheduleLayout';
import BudgetSchedulePage from '../pages/budgetSchedule/BudgetSchedulePage';

export const budgetScheduleRoutes = (
  <Route path="/budget-schedule" element={<BudgetScheduleLayout />}>
    <Route index element={<BudgetSchedulePage />} />
  </Route>
);
