import { Button, IconType, InputText, TextArea } from "@aragon/ods";
import React, { type ReactNode, useState } from "react";
import { Else, ElseIf, If, Then } from "@/components/if";
import { MainSection } from "@/components/layout/main-section";
import { useCreateProposal } from "../hooks/useCreateProposal";
import { useAccount } from "wagmi";
import { useCanCreateProposal } from "../hooks/useCanCreateProposal";
import { MissingContentView } from "@/components/MissingContentView";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { type Address, isAddress, toHex, zeroAddress } from "viem";
import { ProposalActions } from "@/components/proposalActions/proposalActions";
import { useGetContracts } from "@/plugins/gauge-stake/hooks/useGetContract";
import { Token } from "@/plugins/gauge-stake/types/tokens";
//import { PUB_ENS_CHAIN } from "@/constants";
//import { config } from "@/components/WalletContainer";
import { usePinJSONtoIPFS } from "../hooks/usePinJSONtoIPFS";
import { GaugeDetailsDialog } from "@/plugins/gauge-voting/components/gauges-list/gauge-details-dialog";

export default function Create() {
  const { address: selfAddress, isConnected } = useAccount();
  const { canCreate } = useCanCreateProposal();
  const { title, actions, setTitle, setSummary, setDescription, setActions, isCreating, submitProposal } =
    useCreateProposal();
  const [openPreview, setOpenPreview] = useState(false);
  const [gaugeAddress, setGaugeAddress] = useState<string | undefined>();
  //const [validGaugeAddress, setValidGaugeAddress] = useState("");
  const [gaugeDescription, setGaugeDescription] = useState("");
  const [gaugeLogo, setGaugeLogo] = useState("");
  const [resources, setResources] = useState<{ field: string; value: string; url: string }[]>([]);
  const filteredResources = resources.filter((resource) => resource.field && resource.value);
  const { mutate: uploadMetadata, isPending: uploadingIpfs } = usePinJSONtoIPFS({
    name: title,
    description: gaugeDescription,
    logo: gaugeLogo,
    resources: filteredResources,
  });

  const { data: token1Contracts } = useGetContracts(Token.TOKEN_1);
  const { data: token2Contracts } = useGetContracts(Token.TOKEN_2);

  const token1VoterContract = token1Contracts?.voterContract.result;
  const token2VoterContract = token2Contracts?.voterContract.result;

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
    setDescription(`Create ${event?.target?.value} gauge`);
    setSummary(`Create ${event?.target?.value} gauge`);
  };

  const handleGaugeDescriptionInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGaugeDescription(event?.target?.value);
  };

  //const handleGaugeAddressValidInput = (event?: { address?: string; name?: string }) => {
  //  if (!event?.address) return;
  //  setValidGaugeAddress(event?.address);
  //};
  //
  //const handleGaugeAddressInput = (event?: string) => {
  //  setGaugeAddress(event);
  //};

  const handleGaugeAddressInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGaugeAddress(event?.target?.value);
  };

  const handleGaugeLogoInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGaugeLogo(event?.target?.value);
  };

  const removeResource = (idx: number) => {
    resources.splice(idx, 1);
    setResources([].concat(resources as any));
  };
  const onResourceValueChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    resources[idx].value = event.target.value;
    setResources([].concat(resources as any));
  };
  const onResourceUrlChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    resources[idx].url = event.target.value;
    setResources([].concat(resources as any));
  };
  const onResourceFieldChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    resources[idx].field = event.target.value;
    setResources([].concat(resources as any));
  };

  const createGauge = async () => {
    if (!isAddress(gaugeAddress ?? "")) return;
    if (!token1VoterContract || !isAddress(token1VoterContract)) return;
    if (!token2VoterContract || !isAddress(token2VoterContract)) return;

    uploadMetadata(undefined, {
      onSuccess: async (ipfsPin) => {
        const ipfsCid = toHex(ipfsPin).slice(2);
        const ipfsLength = toHex(ipfsPin.length).slice(2);
        const cleanedGaugeAddress = gaugeAddress?.slice(2);

        setActions([
          {
            to: token1VoterContract,
            data: `0x071d2171000000000000000000000000${cleanedGaugeAddress}000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000${ipfsLength}${ipfsCid}000000000000000000000000000000000000000000000000000000000000`,
            value: 0n,
          },
          {
            to: token2VoterContract,
            data: `0x071d2171000000000000000000000000${cleanedGaugeAddress}000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000${ipfsLength}${ipfsCid}000000000000000000000000000000000000000000000000000000000000`,
            value: 0n,
          },
        ]);
      },
    });
  };

  const submitGauge = async () => {
    await submitProposal();
  };

  return (
    <MainSection narrow={true}>
      <div className="w-full justify-between">
        <h1 className="mb-8 line-clamp-1 flex flex-1 shrink-0 text-2xl font-normal leading-tight text-neutral-800 md:text-3xl">
          Create Gauge
        </h1>

        <PlaceHolderOr selfAddress={selfAddress} canCreate={canCreate} isConnected={isConnected}>
          <div className="mb-6">
            <InputText
              label="Name"
              inputClassName="placeholder:text-neutral-600"
              maxLength={100}
              placeholder="Gauge name"
              variant="default"
              value={title}
              readOnly={isCreating}
              onChange={handleTitleInput}
            />
          </div>

          <div className="mb-6">
            <InputText //AddressInput
              //chainId={PUB_ENS_CHAIN.id}
              //wagmiConfig={config}
              placeholder="0x12...3456"
              inputClassName="placeholder:text-neutral-600"
              maxLength={42}
              readOnly={isCreating}
              label="Address"
              onChange={handleGaugeAddressInput}
              value={gaugeAddress}
              //onChange={handleGaugeAddressInput}
              //onAccept={handleGaugeAddressValidInput}
            />
          </div>

          <div className="mb-6">
            <TextArea
              label="Description"
              placeholder="Gauge description"
              inputClassName="placeholder:text-neutral-600"
              variant="default"
              value={gaugeDescription}
              readOnly={isCreating}
              onChange={handleGaugeDescriptionInput}
            />
          </div>

          <div className="mb-6">
            <InputText
              className=""
              label="Logo"
              placeholder="https://..."
              inputClassName="placeholder:text-neutral-600"
              variant="default"
              value={gaugeLogo}
              readOnly={isCreating}
              onChange={handleGaugeLogoInput}
            />
          </div>

          <div className="mb-6 flex flex-col gap-y-2 md:gap-y-3">
            <div className="flex flex-col gap-0.5 md:gap-1">
              <div className="flex gap-x-3">
                <p className="text-base font-normal leading-tight text-neutral-800 md:text-lg">Resources</p>
              </div>
              <p className="text-sm font-normal leading-normal text-neutral-500 md:text-base">
                Add links to external resources
              </p>
            </div>
            <div className="flex flex-col gap-y-4 rounded-xl border border-neutral-100 bg-neutral-0 p-4">
              <If lengthOf={resources} is={0}>
                <p className="text-sm font-normal leading-normal text-neutral-500 md:text-base">
                  There are no resources yet. Click the button below to add the first one.
                </p>
              </If>
              {resources.map((resource, idx) => {
                return (
                  <div key={idx} className="flex flex-col gap-y-3 py-3 md:py-4">
                    <div className="flex items-center gap-x-3">
                      <InputText
                        label="Field name"
                        value={resource.field}
                        onChange={(e) => onResourceFieldChange(e, idx)}
                        placeholder="Website, Docs, Github, etc."
                        inputClassName="placeholder:text-neutral-600"
                        readOnly={isCreating}
                      />
                      <InputText
                        label="Value or URL name"
                        readOnly={isCreating}
                        value={resource.value}
                        onChange={(e) => onResourceValueChange(e, idx)}
                        placeholder="100, Aragon Network Wiki, etc."
                        inputClassName="placeholder:text-neutral-600"
                      />
                      <InputText
                        label="URL"
                        value={resource.url}
                        onChange={(e) => onResourceUrlChange(e, idx)}
                        placeholder="https://aragon.org/wiki/..."
                        inputClassName="placeholder:text-neutral-600"
                        readOnly={isCreating}
                      />
                      <Button
                        size="sm"
                        className="mt-8"
                        variant="tertiary"
                        onClick={() => removeResource(idx)}
                        iconLeft={IconType.MINUS}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="mt-3">
              <Button
                variant="tertiary"
                size="sm"
                iconLeft={IconType.PLUS}
                disabled={isCreating}
                onClick={() => {
                  setResources(resources.concat({ field: "", value: "", url: "" }));
                }}
              >
                Add resource
              </Button>
            </span>
          </div>

          {/* Actions */}

          {!!actions.length && (
            <ProposalActions
              actions={actions}
              emptyListDescription="The proposal has no actions defined yet. Select a type of action to add to the proposal."
            />
          )}

          {/* Submit */}

          <div className="mt-6 flex w-full flex-col gap-3 md:flex-row">
            <Button
              onClick={() => {
                setOpenPreview(true);
              }}
            >
              Preview
            </Button>
            <Button
              isLoading={isCreating || uploadingIpfs}
              className="border-primary-400"
              size="lg"
              variant={actions.length ? "primary" : "secondary"}
              onClick={actions.length ? () => submitGauge() : () => createGauge()}
            >
              <If lengthOf={actions} above={0}>
                <Then>Submit proposal</Then>
                <Else>Upload metadata</Else>
              </If>
            </Button>
          </div>

          <GaugeDetailsDialog
            selectedGauge={{
              token: Token.TOKEN_1,
              address: (gaugeAddress ?? zeroAddress) as Address,
              info: {
                active: true,
                created: 0n,
                metadataURI: "url",
              },
              metadata: {
                name: title,
                description: gaugeDescription,
                logo: gaugeLogo,
                resources: filteredResources,
              },
            }}
            openDialog={openPreview}
            onClose={() => {
              setOpenPreview(false);
            }}
          />
        </PlaceHolderOr>
      </div>
    </MainSection>
  );
}

const PlaceHolderOr = ({
  selfAddress,
  isConnected,
  canCreate,
  children,
}: {
  selfAddress: Address | undefined;
  isConnected: boolean;
  canCreate: boolean | undefined;
  children: ReactNode;
}) => {
  const { open } = useWeb3Modal();
  return (
    <If true={!selfAddress || !isConnected}>
      <Then>
        {/* Not connected */}
        <MissingContentView callToAction="Connect wallet" onClick={() => open()}>
          Please connect your wallet to continue.
        </MissingContentView>
      </Then>
      <ElseIf true={!canCreate}>
        {/* Not a member */}
        <MissingContentView>
          You cannot create proposals on the multisig because you are not currently defined as a member.
        </MissingContentView>
      </ElseIf>
      <Else>{children}</Else>
    </If>
  );
};
