import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DeploymentMode, useModularArchContext } from 'mod-arch-shared';
import App from './screens/App';
import AppCoreLoader from './AppCoreLoader';
import { AppUrl } from './screens/routeUtils';

const AppRoutes: React.FC = () => {
  const { deploymentMode } = useModularArchContext();
  const isIntegrated = deploymentMode === DeploymentMode.Integrated;
  return (
    <Routes>
        <Route index element={<App empty={false} />} />
        <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};

export default AppRoutes;
