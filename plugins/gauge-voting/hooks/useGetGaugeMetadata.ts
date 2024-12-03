import { fetchIpfsAsJson } from "@/utils/ipfs";
import { type JsonValue } from "@/utils/types";
import { useQueries, type UseQueryOptions } from "@tanstack/react-query";

export function useGetGaugeMetadata<T = JsonValue>(ipfsUris: string[]) {
  type TQueries = UseQueryOptions<
    {
      metadata: T;
      ipfsUri: string;
    },
    Error
  >[];

  const metadata = useQueries<TQueries>({
    queries: [...new Set(ipfsUris)].map((ipfsUri) => {
      return {
        queryKey: ["ipfs", ipfsUri ?? ""],
        queryFn: async () => {
          try {
            const metadata = await fetchIpfsAsJson(ipfsUri);
            return {
              metadata,
              ipfsUri,
            };
          } catch (error) {
            console.error("Failed to fetch IPFS metadata", error);
            throw error;
          }
        },
        retry: true,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retryOnMount: false,
        staleTime: 60,
      };
    }),
  });

  return {
    metadata,
  };
}
