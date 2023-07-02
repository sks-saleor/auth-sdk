import {
  ExternalAuthenticationURL,
  ExternalObtainAccessTokens
} from "./chunk-ZWSDMY53.mjs";
import {
  getRequestData
} from "./chunk-SO7NQZDM.mjs";

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

export {
  SaleorExternalAuth
};
