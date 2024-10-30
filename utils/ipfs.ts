import { PUB_IPFS_ENDPOINTS, PUB_APP_NAME } from "@/constants";
import { Hex, fromHex, toBytes } from "viem";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";
import { sha256 } from "multiformats/hashes/sha2";
import { create as createWeb3StorageClient } from "@web3-storage/w3up-client";
import * as Signer from "@ucanto/principal/ed25519";
import { StoreMemory } from "@web3-storage/access/stores/store-memory";
import * as Proof from "@web3-storage/w3up-client/proof";

const IPFS_FETCH_TIMEOUT = 1000; // 1 second
const UPLOAD_FILE_NAME = PUB_APP_NAME.toLowerCase().trim().replaceAll(" ", "-") + ".json";

export function fetchIpfsAsJson(ipfsUri: string) {
  return fetchRawIpfs(ipfsUri).then((res) => res.json());
}

export function fetchIpfsAsText(ipfsUri: string) {
  return fetchRawIpfs(ipfsUri).then((res) => res.text());
}

export function fetchIpfsAsBlob(ipfsUri: string) {
  return fetchRawIpfs(ipfsUri).then((res) => res.blob());
}

export async function uploadToWeb3Storage(strBody: string) {
  // TODO this most likely needs to happen only once
  const client = await createWeb3StorageClient({
    principal: Signer.parse(process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY!),
    store: new StoreMemory(),
  });

  const proof = await Proof.parse(process.env.NEXT_PUBLIC_WEB3_STORAGE_PROOF!);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  const blob = new Blob([strBody], { type: "text/plain" });
  const file = new File([blob], UPLOAD_FILE_NAME);

  console.log(file);

  const uploadedFile = await client.uploadFile(file);
  console.log("uploadedFile");
  console.log(uploadedFile);
  console.log("uploadedFile cid v1");
  console.log(uploadedFile.toString());
  return `ipfs://${uploadedFile.toString()}`;
}

/*
export async function uploadToPinata(strBody: string) {
  const blob = new Blob([strBody], { type: "text/plain" });
  const file = new File([blob], UPLOAD_FILE_NAME);
  const data = new FormData();
  data.append("file", file);
  data.append("pinataMetadata", JSON.stringify({ name: UPLOAD_FILE_NAME }));
  data.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PUB_PINATA_JWT}`,
    },
    body: data,
  });

  const resData = await res.json();

  if (resData.error) throw new Error("Request failed: " + resData.error);
  else if (!resData.IpfsHash) throw new Error("Could not pin the metadata");
  return "ipfs://" + resData.IpfsHash;
}
  */

export async function getContentCid(strMetadata: string) {
  const bytes = raw.encode(toBytes(strMetadata));
  const hash = await sha256.digest(bytes);
  const cid = CID.create(1, raw.code, hash);
  return "ipfs://" + cid.toV1().toString();
}

// Internal helpers

async function fetchRawIpfs(ipfsUri: string): Promise<Response> {
  if (!ipfsUri) throw new Error("Invalid IPFS URI");
  else if (ipfsUri.startsWith("0x")) {
    // fallback
    ipfsUri = fromHex(ipfsUri as Hex, "string");

    if (!ipfsUri) throw new Error("Invalid IPFS URI");
  }

  const uriPrefixes = PUB_IPFS_ENDPOINTS.split(",").filter((uri) => !!uri.trim());
  if (!uriPrefixes.length) throw new Error("No available IPFS endpoints to fetch from");

  const cid = resolvePath(ipfsUri);

  for (const uriPrefix of uriPrefixes) {
    const controller = new AbortController();
    const abortId = setTimeout(() => controller.abort(), IPFS_FETCH_TIMEOUT);
    const response = await fetch(`${uriPrefix}/${cid}`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(abortId);
    if (!response.ok) continue;

    return response; // .json(), .text(), .blob(), etc.
  }

  throw new Error("Could not connect to any of the IPFS endpoints");
}

function resolvePath(uri: string) {
  const path = uri.includes("ipfs://") ? uri.substring(7) : uri;
  return path;
}
