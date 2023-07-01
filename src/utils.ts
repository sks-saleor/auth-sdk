import { print } from "graphql/language/printer.js";
import gql from "graphql-tag";
import type { DocumentNode } from "graphql";

const MILLI_MULTIPLYER = 1000;
const TOKEN_GRACE_PERIOD = 2000;

const decodeToken = (token: string): { exp: number; iss: string } => {
  const tokenParts = token.split(".");
  const decodedTokenData = Buffer.from(tokenParts[1] || "", "base64").toString();
  const parsedTokenData = JSON.parse(decodedTokenData);
  return parsedTokenData;
};

// returns timestamp
const getTokenExpiry = (token: string): number => {
  const parsedTokenData = decodeToken(token);
  // because api returns seconds, but Date.now() works in millis
  return parsedTokenData.exp * MILLI_MULTIPLYER || 0;
};

export const getTokenIss = (token: string): string => {
  const parsedTokenData = decodeToken(token);
  return parsedTokenData.iss;
};

export const isExpiredToken = (token: string) => {
  // we'll assume a generous time of 2 seconds for api to
  // process our request
  return getTokenExpiry(token) - TOKEN_GRACE_PERIOD <= Date.now();
};

// query here is document node but because of graphql-tag using
// a different version of graphql and pnpm overrides not working
// https://github.com/pnpm/pnpm/issues/4097
// we're gonna do this instead
export const getRequestData = <TVars extends object>(
  query: ReturnType<typeof gql>,
  variables: TVars,
) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify({ query: print(query as unknown as DocumentNode), variables }),
});

export class InvariantError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function invariant(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new InvariantError(`Invariant Violation: ${message || ""}`);
  }
}
