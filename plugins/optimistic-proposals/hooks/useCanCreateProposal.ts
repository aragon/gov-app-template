import { keccak256, toHex } from "viem";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { DaoAbi } from "@/artifacts/DAO.sol";
import { PUB_DAO_ADDRESS, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { ADDRESS_ZERO } from "@/utils/evm";
import { useChainIdTypesafe } from "@/utils/chains";

export function useCanCreateProposal() {
  const { address } = useAccount();
  const chainId = useChainIdTypesafe();

  const [hasCreatePermission, setHasCreatePermission] = useState(false);

  // Check if PROPOSER_PERMISSION is granted to the current wallet
  // Note: only the stewards multisig (PUB_STEWARD_SAFE_MULTISIG_ADDRESS) has permission to create optimistic proposals
  const {
    data: hasCreatePermissionData,
    refetch: hasCreatePermissionRefetch,
    status: hasCreatePermissionStatus,
  } = useReadContract({
    chainId,
    address: PUB_DAO_ADDRESS[chainId],
    abi: DaoAbi,
    functionName: "hasPermission",
    // where, who, permissionId, data
    args: [
      PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS[chainId],
      address ?? ADDRESS_ZERO,
      keccak256(toHex("PROPOSER_PERMISSION")),
      "0x",
    ],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    setHasCreatePermission(!!hasCreatePermissionData);
  }, [hasCreatePermissionStatus]);

  useEffect(() => {
    hasCreatePermissionRefetch();
  }, [address, chainId]);

  return address && hasCreatePermission;
}
