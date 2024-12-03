import { useQueryClient } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

export function useSetTimestamp(timestamp: bigint) {
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  const setTimestamp = () => {
    publicClient
      ?.request({
        method: "evm_setNextBlockTimestamp" as any,
        params: [timestamp] as any,
        id: "1234",
      })
      .then(() => {
        setTimeout(() => {
          queryClient.invalidateQueries();
        }, 6000);
      });
  };

  return {
    setTimestamp,
  };
}
