// src/react/apollo.ts
import * as Apollo from "@apollo/client";
import { useMemo } from "react";
var { ApolloClient, createHttpLink, InMemoryCache } = Apollo;
var useAuthenticatedApolloClient = ({
  uri,
  fetchWithAuth: fetch,
  typePolicies
}) => {
  const httpLink = createHttpLink({ uri, fetch });
  const apolloClient = useMemo(
    () => new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache({ typePolicies })
    }),
    []
  );
  return {
    apolloClient,
    reset: () => apolloClient.resetStore(),
    refetch: () => apolloClient.refetchQueries({ include: "active" })
  };
};
export {
  useAuthenticatedApolloClient
};
