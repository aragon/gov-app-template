export const snapshotProposalsQuery = `
  query Proposals($space: String!, $first: Int = 1000, $skip: Int = 0) {
    proposals(
      first: $first,
      skip: $skip,
      where: {
        space: $space
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      created
      start
      end
      quorum
      link
      discussion
      snapshot
      state
      author
      app
      space {
        id
      }
      scores
      scores_total
      votes
    }
  }
`;

export const snapshotProposalQuery = `
  query Proposal($id: String!) {
    proposal(id: $id) {
      id
      title
      body
      choices
      created
      start
      end
      quorum
      link
      discussion
      snapshot
      state
      author
      app
      space {
        id
      }
      scores
      scores_total
      votes
    }
  }
`;

export const snapshotVotesQuery = `
  query Votes($space: String!, $proposal: String, $voter: String, $first: Int = 1000, $skip: Int = 0) {
    votes(
      first: $first,
      skip: $skip,
      where: {
        space: $space,
        proposal: $proposal,
        voter: $voter
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      proposal {
        id
        choices
      }
      voter
      created
      choice
      vp
      vp_state
      reason
    }
  }
`;

export const snapshotVotingPowerQuery = `
  query VotingPower($space: String!, $voter: String!, $proposal: String) {
    vp(space: $space, voter: $voter, proposal: $proposal) {
      vp
    }
  }`;
