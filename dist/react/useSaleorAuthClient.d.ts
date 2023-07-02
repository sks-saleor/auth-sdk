import { SaleorAuthClient, SaleorAuthClientProps } from '../SaleorAuthClient.js';
import '../types.js';

interface UseSaleorAuthClient {
    saleorAuthClient: SaleorAuthClient;
    isAuthenticating: boolean;
}
/**
 * This hook should be used only once per application.
 * @see Use {@link useSaleorAuthContext} for accessing the auth state.
 */
declare const useSaleorAuthClient: ({ saleorApiUrl, storage, onAuthRefresh, }: SaleorAuthClientProps) => UseSaleorAuthClient;

export { UseSaleorAuthClient, useSaleorAuthClient };
