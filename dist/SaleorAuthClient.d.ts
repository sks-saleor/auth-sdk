import { Fetch, PasswordResetVariables, PasswordResetResponse, TokenCreateVariables, TokenCreateResponse, CustomerDetachVariables, CustomerDetachResponse } from './types.js';

interface SaleorAuthClientProps {
    onAuthRefresh?: (isAuthenticating: boolean) => void;
    saleorApiUrl: string;
    storage?: Storage;
}
declare class SaleorAuthClient {
    private accessToken;
    private tokenRefreshPromise;
    private onAuthRefresh?;
    private saleorApiUrl;
    private storageHandler;
    /**
     * Use ths method to clear event listeners from storageHandler
     *  @example
     *  ```jsx
     *  useEffect(() => {
     *    return () => {
     *      SaleorAuthClient.cleanup();
     *    }
     *  }, [])
     *  ```
     */
    constructor({ saleorApiUrl, storage, onAuthRefresh }: SaleorAuthClientProps);
    cleanup: () => void;
    private runAuthorizedRequest;
    private handleRequestWithTokenRefresh;
    private handleSignIn;
    fetchWithAuth: Fetch;
    resetPassword: (variables: PasswordResetVariables) => Promise<PasswordResetResponse>;
    signIn: (variables: TokenCreateVariables) => Promise<TokenCreateResponse>;
    signOut: () => void;
    checkoutSignOut: (variables: CustomerDetachVariables) => Promise<CustomerDetachResponse>;
}

export { SaleorAuthClient, SaleorAuthClientProps };
