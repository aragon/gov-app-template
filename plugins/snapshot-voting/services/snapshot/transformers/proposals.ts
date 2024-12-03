import { PUB_CHAIN } from "@/constants";
import { type VotingScores, type IProposal } from "../domain";
import { type SnapshotProposalQueryData } from "../gql/types";
import { computeProposalStatus, mapProposalChoice } from "../utils";
import { logger } from "@/services/logger";
import { getEnsName } from "@wagmi/core";
import { config } from "@/context/Web3Modal";
import { mainnet } from "viem/chains";
import { type Address } from "viem";

export async function parseProposalQueryData(proposal: SnapshotProposalQueryData): Promise<IProposal> {
  // get resources
  const resources = [
    {
      name: "Snapshot",
      link: proposal.link,
    },
  ];

  if (proposal.discussion?.startsWith("http")) {
    resources.push({
      name: "Discussion",
      link: proposal.discussion,
    });
  }

  // get creator
  const publishers: { link: string; address: string; name?: string }[] = [
    {
      link: `${PUB_CHAIN.blockExplorers?.default.url}/address/${proposal.author}`,
      address: proposal.author,
    },
  ];

  try {
    const ensNames = await Promise.all(
      publishers.map((p) => getEnsName({ ...config, chain: mainnet }, { address: p.address as Address }))
    );

    publishers.forEach((_, index) => {
      const ensName = ensNames[index];

      if (ensName != null) {
        publishers[index].name = ensName;
      }
    });
  } catch (error) {
    logger.info("Error fetching ens name", error);
  }

  const choices = proposal.choices.map((c) => mapProposalChoice(c));
  const scores: VotingScores[] = proposal.scores.map((s, index) => ({
    choice: choices[index],
    votes: s,
    percentage: proposal.scores_total === 0 ? 0 : (s / proposal.scores_total) * 100,
  }));

  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.body,
    body: proposal.body,
    resources,
    status: computeProposalStatus(proposal.state, scores),
    createdAt: new Date(proposal.created * 1000).toISOString(),
    startDate: new Date(proposal.start * 1000).toISOString(),
    endDate: new Date(proposal.end * 1000).toISOString(),
    publisher: publishers,
    snapshotBlock: proposal.snapshot,
    choices,
    quorum: proposal.quorum,
    scores,
    totalVotes: proposal.votes,
  };
}
