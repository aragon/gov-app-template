import { EPOCH_DURATION } from "../../constants";
import { type VeTokenItem } from "./types";
import { Token } from "../../types/tokens";
import { TOKEN_1_NAME, TOKEN_2_NAME } from "../../constants";

export function epochsSince(timestamp: number, now: number): string {
  const diff = now - timestamp;
  if (diff < 0) return "-";

  const epochsRatio = diff / EPOCH_DURATION;
  return Math.ceil(epochsRatio).toString();
}

export function filterTokens(items: VeTokenItem[], filter: string) {
  if (!filter) return items;

  return items.filter((item) => {
    if (item.id.toString().includes(filter)) return true;
    else if (item.token === Token.TOKEN_1 && TOKEN_1_NAME.includes(filter)) return true;
    else if (item.token === Token.TOKEN_2 && TOKEN_2_NAME.includes(filter)) return true;

    return false;
  });
}
