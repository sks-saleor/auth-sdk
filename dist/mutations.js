"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/mutations.ts
var mutations_exports = {};
__export(mutations_exports, {
  CHECKOUT_CUSTOMER_DETACH: () => CHECKOUT_CUSTOMER_DETACH,
  ExternalAuthenticationURL: () => ExternalAuthenticationURL,
  ExternalObtainAccessTokens: () => ExternalObtainAccessTokens,
  PASSWORD_RESET: () => PASSWORD_RESET,
  TOKEN_CREATE: () => TOKEN_CREATE,
  TOKEN_REFRESH: () => TOKEN_REFRESH,
  accountErrorFragment: () => accountErrorFragment
});
module.exports = __toCommonJS(mutations_exports);
var import_graphql_tag = __toESM(require("graphql-tag"));
var accountErrorFragment = import_graphql_tag.default`
  fragment AccountErrorFragment on AccountError {
    code
    field
    message
  }
`;
var TOKEN_REFRESH = import_graphql_tag.default`
  ${accountErrorFragment}
  mutation refreshToken($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;
var CHECKOUT_CUSTOMER_DETACH = import_graphql_tag.default`
  mutation checkoutCustomerDetach($checkoutId: ID!) {
    checkoutCustomerDetach(id: $checkoutId) {
      errors {
        message
        field
        code
      }
    }
  }
`;
var TOKEN_CREATE = import_graphql_tag.default`
  mutation tokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      errors {
        message
        field
        code
      }
    }
  }
`;
var PASSWORD_RESET = import_graphql_tag.default`
  mutation passwordReset($email: String!, $password: String!, $token: String!) {
    setPassword(email: $email, password: $password, token: $token) {
      token
      refreshToken
      errors {
        message
        field
        code
      }
    }
  }
`;
var ExternalAuthenticationURL = import_graphql_tag.default`
  mutation externalAuthenticationUrl($pluginId: String!, $input: JSONString!) {
    externalAuthenticationUrl(pluginId: $pluginId, input: $input) {
      authenticationData
      errors {
        code
        field
        message
      }
    }
  }
`;
var ExternalObtainAccessTokens = import_graphql_tag.default`
  mutation AuthObtainAccessToken($pluginId: String!, $input: JSONString!) {
    externalObtainAccessTokens(pluginId: $pluginId, input: $input) {
      token
      refreshToken
      user {
        id
        email
      }
      errors {
        field
        code
        message
      }
    }
  }
`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CHECKOUT_CUSTOMER_DETACH,
  ExternalAuthenticationURL,
  ExternalObtainAccessTokens,
  PASSWORD_RESET,
  TOKEN_CREATE,
  TOKEN_REFRESH,
  accountErrorFragment
});
