// src/utils.ts
import { print } from "graphql/language/printer.js";
var MILLI_MULTIPLYER = 1e3;
var TOKEN_GRACE_PERIOD = 2e3;
var decodeToken = (token) => {
  const tokenParts = token.split(".");
  const decodedTokenData = Buffer.from(tokenParts[1] || "", "base64").toString();
  const parsedTokenData = JSON.parse(decodedTokenData);
  return parsedTokenData;
};
var getTokenExpiry = (token) => {
  const parsedTokenData = decodeToken(token);
  return parsedTokenData.exp * MILLI_MULTIPLYER || 0;
};
var getTokenIss = (token) => {
  const parsedTokenData = decodeToken(token);
  return parsedTokenData.iss;
};
var isExpiredToken = (token) => {
  return getTokenExpiry(token) - TOKEN_GRACE_PERIOD <= Date.now();
};
var getRequestData = (query, variables) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ query: print(query), variables })
});
var InvariantError = class extends Error {
  constructor(message) {
    super(message);
  }
};
function invariant(condition, message) {
  if (!condition) {
    throw new InvariantError(`Invariant Violation: ${message || ""}`);
  }
}

export {
  getTokenIss,
  isExpiredToken,
  getRequestData,
  InvariantError,
  invariant
};
