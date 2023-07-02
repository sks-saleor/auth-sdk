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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ExternalProvider: () => ExternalProvider,
  SaleorAuthClient: () => SaleorAuthClient,
  SaleorExternalAuth: () => SaleorExternalAuth
});
module.exports = __toCommonJS(src_exports);

// src/SaleorAuthStorageHandler.ts
var getStorageAuthEventKey = (prefix) => [prefix, "saleor_storage_auth_change"].filter(Boolean).join("+");
var getStorageAuthStateKey = (prefix) => [prefix, "saleor_auth_module_auth_state"].filter(Boolean).join("+");
var getRefreshTokenKey = (prefix) => [prefix, "saleor_auth_module_refresh_token"].filter(Boolean).join("+");
var SaleorAuthStorageHandler = class {
  constructor(storage, prefix) {
    this.storage = storage;
    this.prefix = prefix;
    this.handleStorageChange = (event) => {
      const { oldValue, newValue, type, key } = event;
      if (oldValue === newValue || type !== "storage" || key !== getStorageAuthStateKey(this.prefix)) {
        return;
      }
      this.sendAuthStateEvent(newValue);
    };
    this.cleanup = () => {
      window.removeEventListener("storage", this.handleStorageChange);
    };
    /* auth state */
    this.sendAuthStateEvent = (authState) => {
      const event = new CustomEvent(getStorageAuthEventKey(this.prefix), { detail: { authState } });
      window.dispatchEvent(event);
    };
    this.getAuthState = () => this.storage.getItem(getStorageAuthStateKey(this.prefix)) || "signedOut";
    this.setAuthState = (authState) => {
      this.storage.setItem(getStorageAuthStateKey(this.prefix), authState);
      this.sendAuthStateEvent(authState);
    };
    /* refresh token */
    this.getRefreshToken = () => this.storage.getItem(getRefreshTokenKey(this.prefix)) || null;
    this.setRefreshToken = (token) => {
      this.storage.setItem(getRefreshTokenKey(this.prefix), token);
    };
    /* performed on logout */
    this.clearAuthStorage = () => {
      this.setAuthState("signedOut");
      this.storage.removeItem(getRefreshTokenKey(this.prefix));
    };
    window.addEventListener("storage", this.handleStorageChange);
  }
};

// src/utils.ts
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

// src/SaleorAuthClient.ts
var import_cookie = __toESM(require("cookie"));
var SaleorAuthClient = class {
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
  constructor({ saleorApiUrl, storage, onAuthRefresh }) {
    this.accessToken = null;
    this.tokenRefreshPromise = null;
    this.cleanup = () => {
      this.storageHandler?.cleanup();
    };
    this.runAuthorizedRequest = (input, init) => {
      if (!this.accessToken) {
        return fetch(input, init);
      }
      const headers = init?.headers || {};
      const iss = getTokenIss(this.accessToken);
      const shouldAddAuthHeader = input.toString() === iss;
      return fetch(input, {
        ...init,
        headers: shouldAddAuthHeader ? { ...headers, Authorization: `Bearer ${this.accessToken}` } : headers
      });
    };
    this.handleRequestWithTokenRefresh = async (input, init) => {
      const refreshToken = this.storageHandler?.getRefreshToken();
      invariant(refreshToken, "Missing refresh token in token refresh handler");
      if (this.accessToken) {
        return this.fetchWithAuth(input, init);
      }
      this.onAuthRefresh?.(true);
      if (this.tokenRefreshPromise) {
        const response = await this.tokenRefreshPromise;
        const res = await response.clone().json();
        const {
          errors: graphqlErrors,
          data: {
            tokenRefresh: { errors, token }
          }
        } = res;
        this.onAuthRefresh?.(false);
        if (errors?.length || graphqlErrors?.length || !token) {
          this.tokenRefreshPromise = null;
          this.storageHandler?.clearAuthStorage();
          return fetch(input, init);
        }
        this.storageHandler?.setAuthState("signedIn");
        this.accessToken = token;
        this.tokenRefreshPromise = null;
        return this.runAuthorizedRequest(input, init);
      }
      this.tokenRefreshPromise = fetch(
        this.saleorApiUrl,
        getRequestData(TOKEN_REFRESH, { refreshToken })
      );
      return this.fetchWithAuth(input, init);
    };
    this.handleSignIn = async (response) => {
      const readResponse = await response.json();
      const responseData = "tokenCreate" in readResponse.data ? readResponse.data.tokenCreate : readResponse.data.setPassword;
      if (!responseData) {
        return readResponse;
      }
      const { errors, token, refreshToken } = responseData;
      if (!token || errors.length) {
        this.storageHandler?.setAuthState("signedOut");
        return readResponse;
      }
      if (token) {
        this.accessToken = token;
      }
      if (refreshToken) {
        this.storageHandler?.setRefreshToken(refreshToken);
      }
      this.storageHandler?.setAuthState("signedIn");
      return readResponse;
    };
    this.fetchWithAuth = async (input, init) => {
      const refreshToken = this.storageHandler?.getRefreshToken();
      if (!this.accessToken) {
        this.accessToken = import_cookie.default.parse(document.cookie).token;
        document.cookie = import_cookie.default.serialize("token", "", { expires: /* @__PURE__ */ new Date(0), path: "/" });
      }
      if (this.accessToken && !isExpiredToken(this.accessToken)) {
        return this.runAuthorizedRequest(input, init);
      }
      if (refreshToken) {
        return this.handleRequestWithTokenRefresh(input, init);
      }
      return fetch(input, init);
    };
    this.resetPassword = async (variables) => {
      const response = await fetch(this.saleorApiUrl, getRequestData(PASSWORD_RESET, variables));
      return this.handleSignIn(response);
    };
    this.signIn = async (variables) => {
      const response = await fetch(this.saleorApiUrl, getRequestData(TOKEN_CREATE, variables));
      return this.handleSignIn(response);
    };
    this.signOut = () => {
      this.accessToken = null;
      this.storageHandler?.clearAuthStorage();
      document.cookie = import_cookie.default.serialize("token", "", { expires: /* @__PURE__ */ new Date(0), path: "/" });
    };
    this.checkoutSignOut = async (variables) => {
      const response = await this.runAuthorizedRequest(
        this.saleorApiUrl,
        getRequestData(CHECKOUT_CUSTOMER_DETACH, variables)
      );
      const readResponse = await response.json();
      const {
        data: {
          checkoutCustomerDetach: { errors }
        }
      } = readResponse;
      if (!errors?.length) {
        this.signOut();
      }
      return readResponse;
    };
    this.storageHandler = storage ? new SaleorAuthStorageHandler(storage, saleorApiUrl) : null;
    this.onAuthRefresh = onAuthRefresh;
    this.saleorApiUrl = saleorApiUrl;
    window.storageHandler = this.storageHandler;
    window.saleorAuthClient = this;
  }
};

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

// src/types.ts
var ExternalProvider = /* @__PURE__ */ ((ExternalProvider2) => {
  ExternalProvider2["OpenIDConnect"] = "mirumee.authentication.openidconnect";
  ExternalProvider2["SaleorCloud"] = "cloud_auth.CloudAuthorizationPlugin";
  return ExternalProvider2;
})(ExternalProvider || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExternalProvider,
  SaleorAuthClient,
  SaleorExternalAuth
});
