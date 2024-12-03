import { PUB_SNAPSHOT_GAUGES_SPACE, PUB_SNAPSHOT_SPACE } from "../../constants";
import { type IFetchPaginatedParams, type IInfinitePaginatedResponse } from "@/utils/types";
import { type Address } from "viem";
import { type IProposal, type IProposalVote, type IVoted } from "./domain";
import { fetchProposal, fetchProposals, fetchVotes, fetchVotingPower } from "./fetch";
import { parseVotesData } from "./gql/transformers/votes";
import { parseProposalQueryData } from "./transformers/proposals";

class SnapshotService {
  private readonly space;

  constructor(_space = PUB_SNAPSHOT_SPACE) {
    this.space = _space;
  }

  async getProposals(): Promise<IProposal[]> {
    const proposals = await fetchProposals(this.space);
    const parsed = await Promise.all(proposals.map(parseProposalQueryData));
    return parsed;
  }

  async getProposal(proposalId: string): Promise<IProposal | null> {
    const proposal = await fetchProposal(proposalId);

    if (proposal) {
      const parsed = await parseProposalQueryData(proposal);
      return parsed;
    }

    return null;
  }

  async voted(proposalId: string, voter: string): Promise<IVoted> {
    const votesData = await fetchVotes({ proposalId, voter, space: this.space, limit: 1 });
    const parsed = parseVotesData(votesData)[0];

    return { address: voter as Address, hasVoted: !!parsed, vote: parsed };
  }

  async canVote(proposalId: string, voter: string): Promise<boolean> {
    const votingPower = await fetchVotingPower({ proposalId, voter, space: this.space });
    return Number(votingPower) > 0;
  }

  async getVotes(
    params: IFetchPaginatedParams & { proposalId: string }
  ): Promise<IInfinitePaginatedResponse<IProposalVote>> {
    const votesData = await fetchVotes({ ...params, space: this.space });
    const parsed = parseVotesData(votesData);

    return {
      data: parsed,
      pagination: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        count: parsed.length,
      },
    };
  }
}

export const snapshotService = new SnapshotService();
export const snapshotGaugesService = new SnapshotService(PUB_SNAPSHOT_GAUGES_SPACE);
