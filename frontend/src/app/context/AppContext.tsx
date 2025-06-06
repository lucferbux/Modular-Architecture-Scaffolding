import * as React from 'react';
import { useQueryParamNamespaces } from 'mod-arch-shared';
import useAppAPIState, {
  AppAPIState,
} from '~/app/hooks/useAppAPIState';
import { BFF_API_VERSION, URL_PREFIX } from '~/app/utilities/const';

export type AppContextType = {
  apiState: AppAPIState;
  refreshAPIState: () => void;
};

type AppContextProviderProps = {
  children: React.ReactNode;
  AppName: string;
};

export const AppContext = React.createContext<AppContextType>({
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  apiState: { apiAvailable: false, api: null as unknown as AppAPIState['api'] },
  refreshAPIState: () => undefined,
});

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
  AppName,
}) => {
  const hostPath = AppName
    ? `${URL_PREFIX}/api/${BFF_API_VERSION}/app/${AppName}`
    : null;

  const queryParams = useQueryParamNamespaces();

  const [apiState, refreshAPIState] = useAppAPIState(hostPath, queryParams);

  return (
    <AppContext.Provider
      value={React.useMemo(
        () => ({
          apiState,
          refreshAPIState,
        }),
        [apiState, refreshAPIState],
      )}
    >
      {children}
    </AppContext.Provider>
  );
};
