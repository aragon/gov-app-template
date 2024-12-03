import { PUB_SNAPSHOT_API_URL, SNAPSHOT_API_KEY } from "../../constants";
import { snapshotProposalQuery, snapshotProposalsQuery, snapshotVotesQuery, snapshotVotingPowerQuery } from "./gql/gql";
import { type SnapshotVoteQueryData, type SnapshotProposalQueryData } from "./gql/types";
import { type IFetchVotedParams, type IFetchVotesParams, type IFetchVotingPowerParams } from "./params";
import { logger } from "../../../../services/logger";

export async function fetchProposal(id: string): Promise<SnapshotProposalQueryData | null> {
  const data = await fetchData<SnapshotProposalQueryData | null>("proposal", snapshotProposalQuery, {
    id,
  });

  return data;
}

export async function fetchProposals(space: string): Promise<SnapshotProposalQueryData[]> {
  const data = await fetchData<SnapshotProposalQueryData[]>("proposals", snapshotProposalsQuery, {
    space,
    first: 1000,
  });

  return data;
}

export async function fetchVoted(params: IFetchVotedParams): Promise<SnapshotVoteQueryData[]> {
  const data = await fetchData<SnapshotVoteQueryData[]>("votes", snapshotVotesQuery, {
    space: params.space,
    voter: params.voter,
    proposal: params.proposalId,
    first: 1,
  });

  return data;
}

export async function fetchVotingPower(params: IFetchVotingPowerParams): Promise<string> {
  const data = await fetchData<SnapshotVoteQueryData>("vp", snapshotVotingPowerQuery, {
    space: params.space,
    voter: params.voter,
    proposal: params.proposalId,
  });

  return data.vp;
}

export async function fetchVotes(params: IFetchVotesParams): Promise<SnapshotVoteQueryData[]> {
  const limit = params.limit ?? 10;
  const page = params.page ?? 1;

  const data = await fetchData<SnapshotVoteQueryData[]>("votes", snapshotVotesQuery, {
    space: params.space,
    proposal: params.proposalId,
    voter: params.voter,
    first: limit,
    skip: (page - 1) * limit,
  });

  return data;
}

async function fetchData<T>(func: string, query: string, variables?: Record<string, any>): Promise<T> {
  try {
    const response = await fetch(PUB_SNAPSHOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SNAPSHOT_API_KEY,
      },
      body: JSON.stringify({ query, variables }),
    });

    const parsed = await response.json();
    return parsed.data[func] as T;
  } catch (err) {
    logger.error(
      `Failed to fetch Snapshot. URL: ${PUB_SNAPSHOT_API_URL}, Vars: ${JSON.stringify(variables)} Err:`,
      JSON.stringify(err)
    );
    throw new Error(`Failed to fetch Snapshot`);
  }
}
