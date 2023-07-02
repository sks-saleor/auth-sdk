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

// src/react/useSaleorExternalAuth.ts
var useSaleorExternalAuth_exports = {};
__export(useSaleorExternalAuth_exports, {
  useSaleorExternalAuth: () => useSaleorExternalAuth
});
module.exports = __toCommonJS(useSaleorExternalAuth_exports);
var import_react = require("react");

// src/mutations.ts
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

// src/utils.ts
var import_printer = require("graphql/language/printer.js");
var getRequestData = (query, variables) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ query: (0, import_printer.print)(query), variables })
});

// src/SaleorExternalAuth.ts
var SaleorExternalAuth = class {
  constructor(saleorURL, provider) {
    this.saleorURL = saleorURL;
    this.provider = provider;
  }
  async makePOSTRequest(query, variables) {
    const response = await fetch(this.saleorURL, getRequestData(query, variables));
    const result = await response.json();
    if ("errors" in result) {
      console.error(result.errors[0].message);
      return null;
    }
    return result.data;
  }
  async initiate({ redirectURL }) {
    const {
      externalAuthenticationUrl: { authenticationData: data, errors }
    } = await this.makePOSTRequest(ExternalAuthenticationURL, {
      pluginId: this.provider,
      input: JSON.stringify({ redirectUri: redirectURL })
    });
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }
    const { authorizationUrl } = JSON.parse(data);
    return authorizationUrl;
  }
  async obtainAccessToken({ code, state }) {
    const { externalObtainAccessTokens: data } = await this.makePOSTRequest(
      ExternalObtainAccessTokens,
      {
        pluginId: this.provider,
        input: JSON.stringify({ code, state })
      }
    );
    return data;
  }
};

// src/react/useSaleorExternalAuth.ts
var useSaleorExternalAuth = ({
  saleorURL,
  provider,
  redirectURL
}) => {
  const [state, setState] = (0, import_react.useState)({
    authURL: void 0,
    error: void 0,
    loading: true
  });
  (0, import_react.useEffect)(() => {
    const triggerExternalAuth = async () => {
      try {
        const auth = new SaleorExternalAuth(saleorURL, provider);
        const result = await auth.initiate({ redirectURL });
        setState({ authURL: result, loading: false });
      } catch (error) {
        if (error instanceof Error) {
          setState({ loading: false, error: error.message });
        } else {
          setState({ loading: false, error: "Unknown error" });
        }
      }
    };
    triggerExternalAuth();
  }, [saleorURL]);
  return state;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSaleorExternalAuth
});
