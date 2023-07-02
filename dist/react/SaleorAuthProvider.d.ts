import * as react_jsx_runtime from 'react/jsx-runtime';
import { UseSaleorAuthClient } from './useSaleorAuthClient.js';
import { PropsWithChildren } from 'react';
import '../SaleorAuthClient.js';
import '../types.js';

declare const SaleorAuthProvider: ({ children, saleorAuthClient, isAuthenticating, }: PropsWithChildren<UseSaleorAuthClient>) => react_jsx_runtime.JSX.Element;

export { SaleorAuthProvider };
