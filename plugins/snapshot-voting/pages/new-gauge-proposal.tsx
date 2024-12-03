import { Button } from "@/components/odsModified/button";
import { PleaseWaitSpinner } from "@/components/please-wait";
import Unauthorized from "@/components/unAuthorized/unAuthorized";
import { AlertInline, InputText, RadioCard, RadioGroup } from "@aragon/ods";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { type z } from "zod";
import { DateTimeSelector } from "../components/dateTimeSelector/dateTimeSelector";
import { endSwitchValues, ProposalCreationSchema } from "../components/newProposalForm/types";
import { useCanCreateProposal } from "../hooks/useCanCreateProposal";
import { ProposalDetails } from "../nav/routes";
import { proposalList } from "../services/proposals";
import { useCreateGaugeProposal } from "../hooks/useCreateGaugeProposal";
import { SimpleGaugeList } from "@/plugins/gauge-voting/components/gauges-list/gauge-list-simple";

export default function NewGaugeProposal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isAuthorized, isDisconnected, isUnAuthorized, isAuthenticating } = useCanCreateProposal();

  const formValues = useForm<z.infer<typeof ProposalCreationSchema>>({
    resolver: zodResolver(ProposalCreationSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      endSwitch: "duration",
      start: {
        date: dayjs().format("YYYY-MM-DD"), // Default to today
        time: dayjs().add(5, "minute").format("HH:mm"), // Default to current time
      },
      end: {
        date: dayjs().format("YYYY-MM-DD"), // Default to today
        time: dayjs().add(10, "minute").format("HH:mm"), // Default to current time + 5 mins
      },
    },
  });

  const {
    control,
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  } = formValues;

  const [endSwitch] = useWatch({
    control,
    name: ["endSwitch"],
  });

  const [indexingStatus, setIndexingStatus] = useState<"idle" | "pending" | "success">("idle");

  const onProposalSubmitted = useCallback(
    async (newProposalId?: string) => {
      setIndexingStatus("pending");
      if (newProposalId) {
        setIndexingStatus("success");
        router.push(ProposalDetails.getPath(newProposalId));
        queryClient.invalidateQueries({ queryKey: proposalList().queryKey, refetchType: "all", type: "all" });
      }
    },
    [queryClient, router]
  );

  const { createProposal, isConfirming } = useCreateGaugeProposal(onProposalSubmitted);

  const handleCreateProposal = async (values: z.infer<typeof ProposalCreationSchema>) => {
    console.debug({ values });
    if (isAuthorized) {
      const startDate = new Date();
      let endDate;
      const { endSwitch, end } = values;

      if (endSwitch === "duration" && startDate) {
        const week = 7 * 24 * 60 * 60 * 1000;
        endDate = new Date(startDate.valueOf() + week);
      } else if (endSwitch === "date") {
        endDate = new Date(`${end.date}T${end.time}`);
      }
      console.debug({ startDate, endDate, values });

      if (startDate && endDate) {
        createProposal(startDate, endDate, values.title, values.body?.trim(), values.discussion?.trim());
      }
    }
  };

  const resetEndDates = () => {
    resetField("end.date", { defaultValue: dayjs().format("YYYY-MM-DD") });
    resetField("end.time", { defaultValue: dayjs().add(10, "minute").format("HH:mm") });
  };

  const getCtaLabel = () => {
    if (isDisconnected) {
      return "Connect Wallet";
    } else if (isConfirming) {
      return "Opening Window";
    } else if (indexingStatus === "pending") {
      return "Indexing...";
    } else {
      return "Open Voting Window";
    }
  };

  if (isAuthenticating) {
    return <PleaseWaitSpinner />;
  } else if (isUnAuthorized || isDisconnected) {
    return <Unauthorized />;
  }

  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-y-10 px-4 pb-8 pt-12 md:gap-y-12 md:px-6 md:pb-12">
      <div>This will immediately activate the next voting window on snapshot.</div>
      <section>
        <SimpleGaugeList />
      </section>
      {/* CONTENT */}
      <InputText
        label="Title"
        maxLength={100}
        helpText="Give your proposal a title"
        {...register("title")}
        {...(errors.title?.message
          ? {
              variant: "critical",
              alert: { variant: "critical", message: errors.title.message },
              "aria-invalid": "true",
            }
          : {})}
      />

      {/* SETTINGS */}
      <FormProvider {...formValues}>
        {/* End Time */}
        <div className="flex flex-col gap-y-4">
          <Controller
            control={control}
            name="endSwitch"
            render={({ field: { onChange, ...rest } }) => (
              <RadioGroup
                className="gap-x-6 sm:!flex-row"
                label="End date"
                helpText="Define when the voting window should end. After the end date, a new voting window will need to be opened. Votes do not carry over to the next window."
                {...rest}
                onValueChange={(value) => {
                  resetEndDates();
                  onChange(value);
                }}
              >
                {endSwitchValues.map((v) => (
                  <RadioCard key={v.label} label={v.label} value={v.value} description="" className="flex-1" />
                ))}
              </RadioGroup>
            )}
          />
          {endSwitch === "date" && <DateTimeSelector prefix="end" />}
        </div>
      </FormProvider>
      <div className="flex flex-col gap-y-3">
        <span>
          <Button
            variant="primary"
            size="lg"
            className="!rounded-full"
            disabled={isUnAuthorized || isDisconnected}
            isLoading={isConfirming || indexingStatus === "pending"}
            onClick={handleSubmit(handleCreateProposal)}
          >
            {getCtaLabel()}
          </Button>
        </span>
        {isUnAuthorized && (
          <AlertInline message="Connected wallet is not whitelisted for proposal creation" variant="critical" />
        )}
      </div>
    </main>
  );
}
