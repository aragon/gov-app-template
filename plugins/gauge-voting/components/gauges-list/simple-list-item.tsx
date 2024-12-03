import { Avatar, DataListItem } from "@aragon/ods";
import { type GaugeItem } from "./types";
import { Fragment, useState } from "react";
import { shortenAddress } from "@/utils/address";
import { GaugeDetailsDialog } from "./gauge-details-dialog";

type GaugeItemProps = {
  props: GaugeItem;
};

export const SimpleGaugeListItem: React.FC<GaugeItemProps> = ({ props }) => {
  const metadata = props.metadata;
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Fragment>
        <div>
          <GaugeDetailsDialog
            selectedGauge={props}
            openDialog={openDialog}
            onClose={() => {
              setOpenDialog(false);
            }}
          />
          <DataListItem
            key={metadata?.name}
            className="mt-2 flex flex-col gap-x-4 border border-neutral-100 p-4 md:flex-row md:items-center"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <div className="flex w-full flex-row items-center gap-x-3">
              <Avatar
                alt="Gauge icon"
                size="lg"
                src={metadata?.logo}
                fallback={
                  <span className="flex size-full items-center justify-center bg-primary-400 text-neutral-0">
                    {metadata?.name.slice(0, 2).toUpperCase()}
                  </span>
                }
              />
              <div className="flex flex-col">
                <p className="title text-neutral-900">{metadata?.name}</p>
                <p className="text-neutral-600">{shortenAddress(props.address)}</p>
              </div>
            </div>
          </DataListItem>
        </div>
        <div className="hidden">
          <DataListItem key={metadata?.name} className="my-2 border border-neutral-100 px-4 py-2">
            <dl className="flex flex-col divide-y divide-neutral-100">
              <div className="flex justify-between py-2">
                <div className="flex items-center gap-x-4">
                  <Avatar
                    alt="Gauge icon"
                    size="lg"
                    src={metadata?.logo}
                    fallback={
                      <span className="flex size-full items-center justify-center bg-primary-400 text-neutral-0">
                        {metadata?.name.slice(0, 2).toUpperCase()}
                      </span>
                    }
                  />
                  {metadata?.name}
                </div>
              </div>
            </dl>
          </DataListItem>
        </div>
      </Fragment>
    </>
  );
};
