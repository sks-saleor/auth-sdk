"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  InvariantError: () => InvariantError,
  getRequestData: () => getRequestData,
  getTokenIss: () => getTokenIss,
  invariant: () => invariant,
  isExpiredToken: () => isExpiredToken
});
module.exports = __toCommonJS(utils_exports);
var import_printer = require("graphql/language/printer.js");
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
  body: JSON.stringify({ query: (0, import_printer.print)(query), variables })
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InvariantError,
  getRequestData,
  getTokenIss,
  invariant,
  isExpiredToken
});
