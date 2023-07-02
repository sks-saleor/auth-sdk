import {
  Provider
} from "./chunk-4GKF3QYL.mjs";
import {
  invariant
} from "./chunk-SO7NQZDM.mjs";

// src/react/SaleorAuthProvider.tsx
import { jsx } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx(Provider, { value: { isAuthenticating, signIn, signOut, checkoutSignOut, resetPassword }, children });
};

export {
  SaleorAuthProvider
};
