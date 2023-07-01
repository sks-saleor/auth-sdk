import { useEffect } from "react";
import { SaleorAuthEvent, getStorageAuthEventKey } from "../SaleorAuthStorageHandler";
import pubsub from "../pubsub";

interface UseAuthChangeProps {
  saleorApiUrl: string;
  onSignedIn?: () => void;
  onSignedOut?: () => void;
}

// used to handle client cache invalidation on login / logout and when
// token refreshin fails
export const useAuthChange = ({ saleorApiUrl, onSignedOut, onSignedIn }: UseAuthChangeProps) => {
  const handleAuthChange = (event: SaleorAuthEvent) => {
    const isCustomAuthEvent = event?.type === getStorageAuthEventKey(saleorApiUrl);

    if (!isCustomAuthEvent) {
      return;
    }

    const { authState } = event.detail;

    if (authState === "signedIn") {
      onSignedIn?.();
    } else if (authState === "signedOut") {
      onSignedOut?.();
    }
  };

  useEffect(() => {
    // for current pubsub
    const subsciption = pubsub.addListener(getStorageAuthEventKey(saleorApiUrl), handleAuthChange);

    return () => {
      subsciption?.remove();
    };
  }, []);
};
