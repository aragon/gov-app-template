import { type Address } from "viem";
import { type Token } from "@/types/tokens";

export type Gauge = {
  gauge: Address;
  weight: bigint;
};

export type GaugeItem = {
  token: Token;
  address: Address;
  info: GaugeInfo;
  metadata?: GaugeMetadata;
};

export type GaugeInfo = {
  active: boolean;
  created: bigint;
  metadataURI: string;
};

export type Resource = {
  field: string;
  value: string;
  url: string;
};

export type GaugeMetadata = {
  name: string;
  description: string;
  logo: string;
  resources: Resource[];
};
