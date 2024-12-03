import { PUB_GET_REWARDS_URL } from "../constants";
import { useQuery } from "@tanstack/react-query";

export function useGetRewardsUrl() {
  return useQuery({
    queryKey: ["rewardsUrl"],
    queryFn: async () => {
      const response = await fetch(PUB_GET_REWARDS_URL);
      const data = await response.text();
      return data.replace(/"/g, "");
    },
  });
}
