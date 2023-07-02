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

// src/react/SaleorAuthProvider.tsx
var SaleorAuthProvider_exports = {};
__export(SaleorAuthProvider_exports, {
  SaleorAuthProvider: () => SaleorAuthProvider
});
module.exports = __toCommonJS(SaleorAuthProvider_exports);

// src/utils.ts
var import_printer = require("graphql/language/printer.js");
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

// src/react/context.ts
var import_react = require("react");
var createSafeContext = () => {
  const context = (0, import_react.createContext)(void 0);
  function useSafeContext() {
    const value = (0, import_react.useContext)(context);
    if (value === void 0) {
      throw new Error("useContext must be inside a Provider with a value");
    }
    return value;
  }
  return [useSafeContext, context.Provider];
};
var [useSaleorAuthContext, Provider] = createSafeContext();

// src/react/SaleorAuthProvider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SaleorAuthProvider = ({
  children,
  saleorAuthClient,
  isAuthenticating
}) => {
  invariant(
    saleorAuthClient,
    "Missing Saleor Auth Client - are you sure you created it using useSaleorAuthClient?"
  );
  const { signIn, signOut, checkoutSignOut, resetPassword } = saleorAuthClient;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, { value: { isAuthenticating, signIn, signOut, checkoutSignOut, resetPassword }, children });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SaleorAuthProvider
});
