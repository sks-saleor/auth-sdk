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

export {
  getStorageAuthEventKey,
  getStorageAuthStateKey,
  getRefreshTokenKey,
  SaleorAuthStorageHandler
};
