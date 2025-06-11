import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Main from './Main';

const MainRoutes: React.FC = () => (
  <Routes>
    <Route index element={<Main />} />
    <Route path="*" element={<Navigate to="." />} />
  </Routes>
);

export default MainRoutes;
