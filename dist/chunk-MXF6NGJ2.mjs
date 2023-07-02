import {
  SaleorExternalAuth
} from "./chunk-C2DPINVG.mjs";

// src/react/useSaleorExternalAuth.ts
import { useState, useEffect } from "react";
var useSaleorExternalAuth = ({
  saleorURL,
  provider,
  redirectURL
}) => {
  const [state, setState] = useState({
    authURL: void 0,
    error: void 0,
    loading: true
  });
  useEffect(() => {
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

export {
  useSaleorExternalAuth
};
