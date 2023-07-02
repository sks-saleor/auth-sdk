import { Fetch } from '../types.js';
import * as Apollo from '@apollo/client';

type Options = {
    uri: string;
    fetchWithAuth: Fetch;
    typePolicies?: Apollo.TypePolicies;
};
declare const useAuthenticatedApolloClient: ({ uri, fetchWithAuth: fetch, typePolicies, }: Options) => {
    apolloClient: Apollo.ApolloClient<Apollo.NormalizedCacheObject>;
    reset: () => Promise<Apollo.ApolloQueryResult<any>[] | null>;
    refetch: () => Apollo.RefetchQueriesResult<Promise<Apollo.ApolloQueryResult<any>>>;
};

export { useAuthenticatedApolloClient };
