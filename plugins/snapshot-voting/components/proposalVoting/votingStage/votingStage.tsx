import { PUB_CHAIN } from "@/constants";
import { ProposalStatus } from "@/plugins/snapshot-voting/services/snapshot/domain";
import { getSimpleRelativeTimeFromDate } from "@/utils/dates";
import { AccordionItem, AccordionItemContent, AccordionItemHeader, Heading, Tabs, formatterUtils } from "@aragon/ods";
import { Tabs as RadixTabsRoot } from "@radix-ui/react-tabs";
import dayjs from "dayjs";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { VotesDataList } from "../votesDataList";
import { VotingBreakdown, type IBreakdownMajorityVotingResult } from "../votingBreakdown";
import { type VotingCta } from "../votingBreakdown/types";
import { VotingDetails } from "../votingDetails";
import { VotingStageStatus } from "./votingStageStatus";

export interface IVotingStageDetails {
  censusBlock: number;
  startDate: string;
  endDate: string;
  strategy: string;
  options: string;
}

export interface IVotingStageProps {
  title: string;
  number: number | null;
  disabled: boolean;
  status: ProposalStatus.ACCEPTED | ProposalStatus.REJECTED | ProposalStatus.ACTIVE;

  proposalId?: string;
  result?: IBreakdownMajorityVotingResult;
  details?: IVotingStageDetails;
  cta?: VotingCta;
}

export const VotingStage: React.FC<IVotingStageProps> = (props) => {
  const { cta, details, disabled, title, number, result, proposalId = "", status } = props;

  const [relativeDate, setRelativeDate] = useState(() => getSimpleRelativeTimeFromDate(dayjs(details?.endDate)));
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Callback ref to capture the portalled node when it is available
  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setNode(node);
    }
  }, []);

  const resize = useCallback(() => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newHeight = `${entry.contentRect.height}px`;
          const oldHeight = contentRef.current?.style["--radix-collapsible-content-height" as any];

          // Only update if the height has actually changed
          if (oldHeight !== newHeight) {
            requestAnimationFrame(() => {
              contentRef.current?.style.setProperty("--radix-collapsible-content-height", newHeight);
            });
          }
        }
      });

      resizeObserver.observe(node);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [node]);

  useLayoutEffect(resize, [resize]);

  useEffect(() => {
    if (details?.endDate)
      setInterval(() => {
        if (dayjs(details.endDate).isBefore(dayjs())) {
          setRelativeDate("0");
        } else {
          setRelativeDate(getSimpleRelativeTimeFromDate(dayjs(details?.endDate)));
        }
      }, 1000);
  }, [details?.endDate]);

  const defaultTab = status === ProposalStatus.ACTIVE ? "breakdown" : "details";
  const stageKey = `Stage ${number ?? 1}`;
  const formattedSnapshotBlock = formatterUtils.formatNumber(details?.censusBlock) ?? "";
  const snapshotBlockURL = `${PUB_CHAIN.blockExplorers?.default.url}/block/${details?.censusBlock}`;
  const tabClassNames =
    "!border-primary-500 data-[state=active]:!shadow-primary-500 active:data-[state=active]:!shadow-primary-500";

  return (
    <AccordionItem
      key={stageKey}
      value={stageKey}
      disabled={disabled}
      className="border-t border-t-neutral-100 bg-neutral-0"
    >
      <AccordionItemHeader className="!items-start !gap-y-5">
        <div className="flex w-full gap-x-6">
          <div className="flex flex-1 flex-col items-start gap-y-2">
            <Heading size="h3" className="line-clamp-1 text-left">
              {title}
            </Heading>
            <VotingStageStatus status={status} endDate={relativeDate} />
          </div>
          {number && <span className="hidden leading-tight text-neutral-500 sm:block">{stageKey}</span>}
        </div>
      </AccordionItemHeader>

      <AccordionItemContent ref={contentRef} className="!md:pb-0 !pb-0">
        <RadixTabsRoot defaultValue={defaultTab} ref={setRef}>
          <Tabs.List>
            <Tabs.Trigger value="breakdown" label="Breakdown" className={tabClassNames} />
            <Tabs.Trigger value="votes" label="Votes" className={tabClassNames} />
            <Tabs.Trigger value="details" label="Details" className={tabClassNames} />
          </Tabs.List>
          <Tabs.Content value="breakdown">
            <div className="py-4 pb-8">
              {result && details && <VotingBreakdown cta={cta} result={result} proposalId={proposalId} />}
            </div>
          </Tabs.Content>
          <Tabs.Content value="votes">
            <div className="py-4 pb-8">
              <VotesDataList proposalId={proposalId} />
            </div>
          </Tabs.Content>
          <Tabs.Content value="details">
            <div className="py-4 pb-8">
              {details && (
                <VotingDetails
                  snapshotBlock={formattedSnapshotBlock}
                  startDate={details.startDate}
                  endDate={details.endDate}
                  snapshotBlockURL={snapshotBlockURL}
                  strategy={details.strategy}
                  options={details.options}
                />
              )}
            </div>
          </Tabs.Content>
        </RadixTabsRoot>
      </AccordionItemContent>
    </AccordionItem>
  );
};
