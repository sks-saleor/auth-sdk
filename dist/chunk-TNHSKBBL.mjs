import {
  SaleorAuthClient
} from "./chunk-ADUQHQVF.mjs";

// src/react/useSaleorAuthClient.ts
import { useEffect, useMemo, useState } from "react";
var useSaleorAuthClient = ({
  saleorApiUrl,
  storage = typeof window !== "undefined" ? window.localStorage : void 0,
  onAuthRefresh
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const saleorAuthClient = useMemo(
    () => new SaleorAuthClient({
      storage,
      saleorApiUrl,
      onAuthRefresh: (value) => {
        setIsAuthenticating(value);
        onAuthRefresh?.(value);
      }
    }),
    [storage, saleorApiUrl, onAuthRefresh]
  );
  useEffect(
    () => () => {
      saleorAuthClient.cleanup();
    },
    []
  );
  return { saleorAuthClient, isAuthenticating };
};

export {
  useSaleorAuthClient
};
