import { addressUtils } from "@aragon/ods";
import { type Address } from "viem";

export const shortenAddress = (address: Address) => addressUtils.truncateAddress(address);
