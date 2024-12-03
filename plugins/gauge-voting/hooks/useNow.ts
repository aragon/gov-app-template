import { PUB_USE_BLOCK_TIMESTAMP } from "@/constants";
import { type DateFormat, formatterUtils } from "@aragon/ods";
import { useEffect, useState } from "react";
import { useBlock } from "wagmi";

export function useNow() {
  const [realTimestamp, setTimestamp] = useState(0);
  const { data } = useBlock({
    query: {
      enabled: PUB_USE_BLOCK_TIMESTAMP,
    },
  });

  const timestamp = Number(data?.timestamp ?? 0n) * 1000;
  useEffect(() => {
    setTimestamp(PUB_USE_BLOCK_TIMESTAMP && timestamp ? timestamp : Date.now());
  }, [timestamp]);

  const getRelativeTime = (timestamp: number, format: DateFormat) => {
    const diffTime = realTimestamp - Date.now();
    return formatterUtils.formatDate(timestamp - diffTime, {
      format,
    });
  };

  return {
    now: realTimestamp,
    getRelativeTime,
  };
}
