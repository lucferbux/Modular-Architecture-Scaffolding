import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFound, NavDataItem } from 'mod-arch-shared';
import useUser from './hooks/useUser';
import Settings from './pages/settings/Settings';

export const useAdminSettings = (): NavDataItem[] => {
  const { clusterAdmin } = useUser();

  if (!clusterAdmin) {
    return [];
  }

  return [
    {
      label: 'Settings',
      children: [{ label: 'App', path: '/settings' }],
    },
  ];
};

export const useNavData = (): NavDataItem[] => [
  {
    label: 'App',
    path: '/app',
  },
  ...useAdminSettings(),
];

const AppRoutes: React.FC = () => {
  const { clusterAdmin } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/model-registry" replace />} />
      {/* <Route path="/app/*" element={<AppRoute />} /> */}
      <Route path="*" element={<NotFound />} />
      {/* TODO: [Conditional render] Follow up add testing and conditional rendering when in standalone mode*/}
      {clusterAdmin && <Route path="/settings" element={<Settings />} />}
    </Routes>
  );
};

export default AppRoutes;
