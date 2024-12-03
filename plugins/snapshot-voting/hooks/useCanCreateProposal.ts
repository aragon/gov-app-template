import { useIsMember } from "@/plugins/multisig/hooks/useIsMember";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useCanCreateProposal = () => {
  const { address } = useAccount();
  const [gatingStatus, setGatingStatus] = useState<"disconnected" | "unauthorized" | "authorized">();
  const { data: isMember, isLoading } = useIsMember(address);

  useEffect(() => {
    if (!address) {
      setGatingStatus("disconnected");
    } else if (isMember === true) {
      setGatingStatus("authorized");
    } else if (isMember === false) {
      setGatingStatus("unauthorized");
    }
  }, [address, isMember]);

  return {
    isDisconnected: gatingStatus === "disconnected",
    isAuthorized: gatingStatus === "authorized",
    isUnAuthorized: gatingStatus === "unauthorized",
    isAuthenticating: isLoading,
  };
};
