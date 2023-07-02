import gql from 'graphql-tag';
import { ExternalProvider } from './types.js';

type RedirectData = {
    code: string;
    state: string;
};
type ExternalObtainAccessToken = {
    token: string;
    refreshToken: string;
    csrfToken: string;
    user: unknown;
};
type ExternalObtainAccessTokenResponse = {
    data: ExternalObtainAccessToken;
} | {
    errors: any[];
};
declare class SaleorExternalAuth {
    private saleorURL;
    private provider;
    constructor(saleorURL: string, provider: ExternalProvider);
    makePOSTRequest(query: ReturnType<typeof gql>, variables: object): Promise<any>;
    initiate({ redirectURL }: {
        redirectURL: string;
    }): Promise<any>;
    obtainAccessToken({ code, state }: RedirectData): Promise<any>;
}

export { ExternalObtainAccessToken, ExternalObtainAccessTokenResponse, SaleorExternalAuth };
