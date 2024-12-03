import { Button } from "@/components/odsModified/button";
import { Heading, IconType } from "@aragon/ods";
import router from "next/router";
import { MainSection } from "../components/layout/mainSection";
import { ProposalDataList } from "../components/proposalDataList/proposalDataList";
import { useCanCreateProposal } from "../hooks/useCanCreateProposal";
import { NewProposal } from "../nav/routes";

export default function ProposalsPage() {
  const { isAuthorized } = useCanCreateProposal();

  return (
    <MainSection className="md:px-6 md:pb-10 xl:pt-10">
      <div className="mx-auto flex w-full max-w-[768px] flex-col items-center gap-y-6 md:px-6">
        <div className="flex w-full gap-x-10">
          <Heading as="h1" className="line-clamp-1 flex flex-1 shrink-0">
            Proposals
          </Heading>
          {isAuthorized && (
            <Button
              iconLeft={IconType.PLUS}
              size="lg"
              onClick={() => {
                router.push(NewProposal.path);
              }}
            >
              Create proposal
            </Button>
          )}
        </div>
        <ProposalDataList />
      </div>
    </MainSection>
  );
}
