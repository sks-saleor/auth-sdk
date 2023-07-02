import * as react from 'react';
import { UseSaleorAuthClient } from './useSaleorAuthClient.js';
import { SaleorAuthClient } from '../SaleorAuthClient.js';
import '../types.js';

type SaleorAuthContextConsumerProps = Pick<UseSaleorAuthClient, "isAuthenticating"> & Omit<SaleorAuthClient, "fetchWithAuth" | "cleanup">;
declare const createSafeContext: <TValue>() => readonly [() => TValue & ({} | null), react.Provider<TValue | undefined>];
declare const useSaleorAuthContext: () => Pick<UseSaleorAuthClient, "isAuthenticating"> & Omit<SaleorAuthClient, "fetchWithAuth" | "cleanup">;
declare const Provider: react.Provider<SaleorAuthContextConsumerProps | undefined>;

export { Provider, createSafeContext, useSaleorAuthContext };
