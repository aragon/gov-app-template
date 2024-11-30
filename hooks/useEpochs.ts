import { EPOCH_CLOCK_ABI } from "@/artifacts/PWNEpochClock.sol";
import { PUB_PWN_EPOCH_CLOCK_ADDRESS } from "@/constants";
import { useChainIdTypesafe } from "@/utils/chains";
import { useReadContract } from "wagmi";

export const SECONDS_IN_EPOCH = 2_419_200 as const;

export function useEpochs() {
  const chainId = useChainIdTypesafe();

  const { data: initialEpochTimestamp, isLoading: isLoadingInitialEpochTimestamp } = useReadContract({
    abi: EPOCH_CLOCK_ABI,
    address: PUB_PWN_EPOCH_CLOCK_ADDRESS[chainId],
    functionName: "INITIAL_EPOCH_TIMESTAMP",
    chainId,
  });

  const formatEpochDate = (timestamp: number) => {
    const dateFormatter = new Intl.DateTimeFormat(navigator.language ?? "en-US");
    return dateFormatter.format(new Date(timestamp));
  };

  const getStartAndEndDateOfEpoch = (epochNumber: number): [number, number] | undefined => {
    if (!initialEpochTimestamp) {
      return undefined;
    }

    epochNumber = epochNumber - 1; // epoch starts on 1
    const startDate = new Date((Number(initialEpochTimestamp) + epochNumber * SECONDS_IN_EPOCH) * 1000);
    const endDate = startDate.getTime() + SECONDS_IN_EPOCH * 1000;
    return [startDate.getTime(), endDate];
  };

  return {
    isLoadingInitialEpochTimestamp,
    initialEpochTimestamp,
    getStartAndEndDateOfEpoch,
    formatEpochDate,
  };
}

export const getSecondsTillNextEpoch = (initialEpochTimestamp: number): number => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return Math.abs(SECONDS_IN_EPOCH - (currentTimestamp % initialEpochTimestamp));
};
