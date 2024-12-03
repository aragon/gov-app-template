import { snapshotService } from "@/plugins/snapshot-voting/services/snapshot/service";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  type IFetchProposalListParams,
  type IFetchProposalParams,
  type IFetchVotedParams,
  type IFetchVotesParams,
  type IFetchVotingPowerParams,
} from "./params";
import { toProposalDataListItems, toProposalDetails } from "./transformers";
import { toProposalVotes } from "./transformers/toProposalVote";

export const proposalKeys = {
  all: ["proposals"] as const,
  proposal: (params: { proposalId: string }) => [...proposalKeys.all, "details", params] as const,
  count: () => ["proposals", "count"] as const,
  list: (params: IFetchProposalListParams) => [...proposalKeys.all, "list", params] as const,
  detail: (params: IFetchProposalParams) => [...proposalKeys.all, "details", params] as const,
};

export const voteKeys = {
  voted: (params: IFetchVotedParams) => ["voted", params] as const,
  canVote: (params: IFetchVotingPowerParams) => ["canVote", params] as const,
  votes: (params: IFetchVotesParams) => ["votes", params] as const,
};

export function proposalList(params: IFetchProposalListParams = {}) {
  return infiniteQueryOptions({
    queryKey: proposalKeys.list(params),
    queryFn: async () => snapshotService.getProposals(),
    initialPageParam: 1,
    getNextPageParam: () => undefined,
    select: (data) => data.pages.flatMap((p) => toProposalDataListItems(p)),
  });
}

export function proposalDetail(params: IFetchProposalParams) {
  const enabled = areAllPropertiesDefined(params);
  return queryOptions({
    queryKey: proposalKeys.detail(params),
    queryFn: async () => {
      const proposal = await snapshotService.getProposal(params.proposalId);
      if (proposal === null) {
        throw new Error("Proposal not found");
      }
      return await toProposalDetails(proposal);
    },
    enabled,
  });
}

export function votes(params: IFetchVotesParams) {
  const enabled = areAllPropertiesDefined(params);
  return infiniteQueryOptions({
    queryKey: voteKeys.votes(params),
    queryFn: (ctx) => snapshotService.getVotes({ ...params, page: ctx.pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      return (lastPage?.pagination?.count ?? 1) < (lastPage?.pagination?.limit ?? 1) ? undefined : lastPageParam + 1;
    },
    select: (data) => data.pages.flatMap((p) => toProposalVotes(p.data.flat())),
    enabled,
  });
}

export function voted(params: IFetchVotedParams) {
  const enabled = areAllPropertiesDefined(params);
  return queryOptions({
    queryKey: voteKeys.voted(params),
    queryFn: () => snapshotService.voted(params.proposalId, params.address),
    enabled,
  });
}

export function canVote(params: IFetchVotingPowerParams) {
  const enabled = areAllPropertiesDefined(params);
  return queryOptions({
    queryKey: voteKeys.canVote(params),
    queryFn: () => snapshotService.canVote(params.proposalId, params.address),
    enabled,
  });
}

function areAllPropertiesDefined<T>(obj: T): boolean {
  for (const key in obj) {
    if (obj[key] == null) {
      return false;
    }
  }
  return true;
}
