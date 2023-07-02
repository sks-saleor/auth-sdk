type Fetch = typeof fetch;
interface TokenCreateVariables {
    email: string;
    password: string;
}
interface TokenCreateResponse {
    data: {
        tokenCreate: {
            token: string | undefined;
            refreshToken: string | undefined;
            errors: any[];
        };
    };
}
interface TokenRefreshVariables {
    refreshToken: string;
}
interface TokenRefreshResponse {
    errors?: any[];
    data: {
        tokenRefresh: {
            token: string | undefined;
            errors?: any[];
        };
    };
}
interface PasswordResetVariables {
    email: string;
    password: string;
    token: string;
}
interface PasswordResetResponse {
    data: {
        setPassword: {
            token: string | undefined;
            refreshToken: string | undefined;
            errors: any[];
        };
    };
}
interface CustomerDetachVariables {
    checkoutId: string;
}
interface CustomerDetachResponse {
    data: {
        checkoutCustomerDetach: {
            errors: any[];
        };
    };
}
declare enum ExternalProvider {
    OpenIDConnect = "mirumee.authentication.openidconnect",
    SaleorCloud = "cloud_auth.CloudAuthorizationPlugin"
}

export { CustomerDetachResponse, CustomerDetachVariables, ExternalProvider, Fetch, PasswordResetResponse, PasswordResetVariables, TokenCreateResponse, TokenCreateVariables, TokenRefreshResponse, TokenRefreshVariables };
