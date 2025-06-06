import {
  APIOptions,
  handleRestFailures,
  Namespace,
  UserSettings,
  ModelRegistryKind,
  assembleModArchBody,
  isModArchResponse,
  restCREATE,
  restDELETE,
  restGET,
  restPATCH,
} from 'mod-arch-shared';
import { ModelRegistry } from '~/app/types';
import { BFF_API_VERSION, URL_PREFIX } from '~/app/utilities/const';

export const getUser =
  (hostPath: string) =>
  (opts: APIOptions): Promise<UserSettings> =>
    handleRestFailures(
      restGET(hostPath, `${URL_PREFIX}/api/${BFF_API_VERSION}/user`, {}, opts),
    ).then((response) => {
      if (isModArchResponse<UserSettings>(response)) {
        return response.data;
      }
      throw new Error('Invalid response format');
    });

export const getNamespaces =
  (hostPath: string) =>
  (opts: APIOptions): Promise<Namespace[]> =>
    handleRestFailures(
      restGET(hostPath, `${URL_PREFIX}/api/${BFF_API_VERSION}/namespaces`, {}, opts),
    ).then((response) => {
      if (isModArchResponse<Namespace[]>(response)) {
        return response.data;
      }
      throw new Error('Invalid response format');
    });
