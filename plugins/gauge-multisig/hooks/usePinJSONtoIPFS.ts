import { uploadToPinata } from "@/utils/ipfs";
import { useMutation } from "@tanstack/react-query";

export function usePinJSONtoIPFS(content: any) {
  return useMutation<string>({
    mutationFn: async () => {
      try {
        return await uploadToPinata(JSON.stringify(content));
      } catch (error) {
        console.error("Failed to upload to IPFS", error);
        throw error;
      }
    },
    retry: true,
  });
}
