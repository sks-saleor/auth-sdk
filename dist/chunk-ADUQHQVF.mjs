import {
  SaleorAuthStorageHandler
} from "./chunk-AGLW26UI.mjs";
import {
  CHECKOUT_CUSTOMER_DETACH,
  PASSWORD_RESET,
  TOKEN_CREATE,
  TOKEN_REFRESH
} from "./chunk-ZWSDMY53.mjs";
import {
  getRequestData,
  getTokenIss,
  invariant,
  isExpiredToken
} from "./chunk-SO7NQZDM.mjs";

// src/SaleorAuthClient.ts
import cookie from "cookie";
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
        this.accessToken = cookie.parse(document.cookie).token;
        document.cookie = cookie.serialize("token", "", { expires: /* @__PURE__ */ new Date(0), path: "/" });
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
      document.cookie = cookie.serialize("token", "", { expires: /* @__PURE__ */ new Date(0), path: "/" });
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

export {
  SaleorAuthClient
};
