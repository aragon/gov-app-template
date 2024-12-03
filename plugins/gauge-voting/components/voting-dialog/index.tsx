import {
  AlertInline,
  Avatar,
  Button,
  DataListContainer,
  DataListRoot,
  DialogContent,
  DialogHeader,
  DialogRoot,
  formatterUtils,
  IconType,
  NumberFormat,
} from "@aragon/ods";
import { useEffect, useState } from "react";
import { VotingListItem } from "./voting-item";
import { type GaugeItem } from "../gauges-list/types";
import { Token } from "../../types/tokens";
import { useVote } from "../../hooks/useVote";
import { useGetAccountVp } from "../../hooks/useGetAccountVp";
import { type Address, formatUnits } from "viem";
import { useOwnedTokens } from "../../hooks/useOwnedTokens";
import { useGetVps } from "../../hooks/useGetVps";
import { useQueryClient } from "@tanstack/react-query";
import { TOKEN_1_NAME, TOKEN_2_NAME } from "../../constants";

type VotingDialogProps = {
  selectedGauges: GaugeItem[];
  voted: boolean;
  onRemove: (gauge: GaugeItem) => void;
};

type Vote = {
  address: Address;
  votes: number;
};

export const VotingDialog: React.FC<VotingDialogProps> = ({ selectedGauges, voted, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [token1Votes, setToken1Votes] = useState<Vote[]>([]);
  const [token2Votes, setToken2Votes] = useState<Vote[]>([]);

  const { ownedTokens: token1OwnedTokensData } = useOwnedTokens(Token.TOKEN_1);
  const { ownedTokens: token2OwnedTokensData } = useOwnedTokens(Token.TOKEN_2);

  const token1OwnedTokens = [...(token1OwnedTokensData ?? [])];
  const token2OwnedTokens = [...(token2OwnedTokensData ?? [])];

  const { data: token1OwnedTokensWithVp } = useGetVps(Token.TOKEN_1, token1OwnedTokens);
  const { data: token2OwnedTokensWithVp } = useGetVps(Token.TOKEN_2, token2OwnedTokens);

  const { vp: token1Vp } = useGetAccountVp(Token.TOKEN_1);
  const { vp: token2Vp } = useGetAccountVp(Token.TOKEN_2);

  const formattedToken1Vp = formatterUtils.formatNumber(formatUnits(token1Vp ?? 0n, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });
  const formattedToken2Vp = formatterUtils.formatNumber(formatUnits(token2Vp ?? 0n, 18), {
    format: NumberFormat.TOKEN_AMOUNT_SHORT,
  });

  const queryClient = useQueryClient();

  const { vote: token2Vote, isConfirming: token2IsConfirming } = useVote(
    Token.TOKEN_2,
    token2OwnedTokensWithVp ?? [],
    token2Votes.map((v) => ({ gauge: v.address, weight: BigInt(Math.floor(v.votes * 100)) })),
    async () => {
      await queryClient.invalidateQueries({ queryKey: ["readContracts", { functionName: "gaugeVotes" }] });
      await queryClient.invalidateQueries({ queryKey: ["readContracts", { functionName: "usedVotingPower" }] });
      // TODO: Remove this when we have a better way to invalidate the cache
      await queryClient.invalidateQueries();
      setOpen(false);
    }
  );
  const { vote: token1Vote, isConfirming: token1IsConfirming } = useVote(
    Token.TOKEN_1,
    token1OwnedTokensWithVp ?? [],
    token1Votes.map((v) => ({ gauge: v.address, weight: BigInt(Math.floor(v.votes * 100)) })),
    token2Vote
  );

  const tolerance = 1e-9;

  const totalToken1Votes = token1Votes.reduce((acc, v) => acc + v.votes, 0);
  const totalToken2Votes = token2Votes.reduce((acc, v) => acc + v.votes, 0);
  const isValidVotes =
    (Math.abs(totalToken1Votes - 100) < tolerance || totalToken1Votes === 0) &&
    (totalToken2Votes === 0 || Math.abs(totalToken2Votes - 100) < tolerance) &&
    (Math.abs(totalToken1Votes - 100) < tolerance || Math.abs(totalToken2Votes - 100) < tolerance);

  useEffect(() => {
    if (!selectedGauges.length) {
      setOpen(false);
    }
  }, [selectedGauges.length]);

  const distributeEvenly = () => {
    const votes = selectedGauges.map((gauge, index) => {
      return {
        address: gauge.address,
        votes: (Math.floor(10000 / selectedGauges.length) + (index === 0 ? 10000 % selectedGauges.length : 0)) / 100,
      };
    });
    if (token1Vp) setToken1Votes(votes);
    if (token2Vp) setToken2Votes(votes);
  };

  const resetValues = () => {
    setToken1Votes([]);
    setToken2Votes([]);
  };

  return (
    <>
      <Button
        size="lg"
        responsiveSize={{ md: "sm" }}
        isLoading={open}
        onClick={() => {
          setOpen(true);
        }}
        variant="primary"
        disabled={!selectedGauges.length}
      >
        {!voted ? "Vote now" : "Edit votes"}
      </Button>
      <DialogRoot open={open} onInteractOutside={() => setOpen(false)} containerClassName="!max-w-[1200px]">
        <DialogHeader
          title="Distribute your votes"
          onCloseClick={() => setOpen(false)}
          onBackClick={() => setOpen(false)}
        />
        <DialogContent className="mt-3 flex flex-col gap-y-4 md:gap-y-6">
          <div className="mb-4 flex w-full flex-row items-center gap-4 md:hidden">
            <Button
              className="flex w-1/2"
              size="md"
              responsiveSize={{ md: "sm" }}
              variant="secondary"
              onClick={distributeEvenly}
            >
              Distribute evenly
            </Button>
            <Button
              className="flex w-1/2"
              size="md"
              responsiveSize={{ md: "sm" }}
              variant="tertiary"
              onClick={resetValues}
            >
              Reset
            </Button>
          </div>
          <DataListRoot entityLabel="Projects" pageSize={selectedGauges.length} className="gap-y-6">
            <DataListContainer>
              {selectedGauges.map((gauge, pos) => (
                <VotingListItem
                  key={pos}
                  gauge={gauge}
                  token1Votes={token1Votes.find((v) => v.address === gauge.address)?.votes}
                  token2Votes={token2Votes.find((v) => v.address === gauge.address)?.votes}
                  totalToken1Votes={token1Votes.reduce((acc, v) => acc + v.votes, 0)}
                  totalToken2Votes={token2Votes.reduce((acc, v) => acc + v.votes, 0)}
                  tolerance={tolerance}
                  onRemove={() => {
                    setToken1Votes(token1Votes.filter((v) => v.address !== gauge.address));
                    setToken2Votes(token2Votes.filter((v) => v.address !== gauge.address));
                    onRemove(gauge);
                  }}
                  onChange={(token, val) => {
                    const newValue = {
                      address: gauge.address,
                      votes: val,
                    };

                    if (token === Token.TOKEN_1) {
                      setToken1Votes((votes) => {
                        const oldVotes = votes.filter((v) => v.address !== gauge.address);
                        oldVotes.push(newValue);
                        return oldVotes;
                      });
                    } else {
                      setToken2Votes((votes) => {
                        const oldVotes = votes.filter((v) => v.address !== gauge.address);
                        oldVotes.push(newValue);
                        return oldVotes;
                      });
                    }
                  }}
                />
              ))}
            </DataListContainer>
          </DataListRoot>
        </DialogContent>
        <div>
          <div className="flex flex-col gap-x-8 gap-y-2 px-8 py-4 md:flex-row md:items-center">
            <p className="title flex text-sm text-neutral-900">Your total votes</p>
            <div className="flex flex-row gap-2 md:flex-row md:gap-8">
              <div className="flex flex-row items-center gap-2 md:justify-center">
                <Avatar alt="Gauge icon" size="sm" responsiveSize={{ md: "sm" }} src="/token-1-icon.png" />
                <p>
                  {formattedToken1Vp} {TOKEN_1_NAME}
                </p>
              </div>
              <div className="flex flex-row items-center gap-2 md:justify-center">
                <Avatar alt="Gauge icon" size="sm" responsiveSize={{ md: "sm" }} src="/token-2-icon.png" />
                <p>
                  {formattedToken2Vp} {TOKEN_2_NAME}
                </p>
              </div>
            </div>

            <div className="hidden grow flex-row justify-end gap-4 md:flex">
              <Button size="md" responsiveSize={{ md: "sm" }} variant="secondary" onClick={distributeEvenly}>
                Distribute evenly
              </Button>
              <Button size="md" responsiveSize={{ md: "sm" }} variant="tertiary" onClick={resetValues}>
                Reset
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col-reverse gap-4 px-6 pb-6 md:flex-row">
            <div className="flex flex-row gap-4">
              <Button
                className="flex-grow"
                size="md"
                iconLeft={IconType.APP_PROPOSALS}
                isLoading={token1IsConfirming || token2IsConfirming}
                disabled={!isValidVotes}
                onClick={() => {
                  token1Vote();
                }}
              >
                Submit votes
              </Button>
              <Button
                className="hidden md:block"
                size="md"
                variant="tertiary"
                onClick={() => {
                  resetValues();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
            {!isValidVotes && (
              <AlertInline
                className="ml-2 justify-center"
                variant="critical"
                message="Percentages must add up to 100%"
              />
            )}
          </div>
        </div>
      </DialogRoot>
    </>
  );
};
