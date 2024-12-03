import { Button } from "@/components/odsModified/button";
import { PleaseWaitSpinner } from "@/components/please-wait";
import Unauthorized from "@/components/unAuthorized/unAuthorized";
import { EMAIL_PATTERN, URL_PATTERN, URL_WITH_PROTOCOL_PATTERN } from "@/utils/input-values";
import { AlertInline, InputText, RadioCard, RadioGroup } from "@aragon/ods";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { type z } from "zod";
import { DateTimeSelector } from "../components/dateTimeSelector/dateTimeSelector";
import {
  endSwitchValues,
  MAX_BODY_CHAR_COUNT,
  ProposalCreationSchema,
  startSwitchValues,
} from "../components/newProposalForm/types";
import { TextAreaRichText } from "../components/textAreaRichText/textAreaRichText";
import { useCanCreateProposal } from "../hooks/useCanCreateProposal";
import { useCreateProposal } from "../hooks/useCreateProposal";
import { ProposalDetails } from "../nav/routes";
import { proposalList } from "../services/proposals";

const UrlRegex = new RegExp(URL_PATTERN);
const EmailRegex = new RegExp(EMAIL_PATTERN);
const UrlWithProtocolRegex = new RegExp(URL_WITH_PROTOCOL_PATTERN);

export default function NewProposal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isAuthorized, isDisconnected, isUnAuthorized, isAuthenticating } = useCanCreateProposal();

  const formValues = useForm<z.infer<typeof ProposalCreationSchema>>({
    resolver: zodResolver(ProposalCreationSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      body: "<p></p>",
      discussion: "",
      startSwitch: "now",
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
    setValue,
    getValues,
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  } = formValues;

  const [startSwitch, endSwitch] = useWatch({
    control,
    name: ["startSwitch", "endSwitch"],
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

  const { createProposal, isConfirming } = useCreateProposal(onProposalSubmitted);

  const handleCreateProposal = async (values: z.infer<typeof ProposalCreationSchema>) => {
    if (isAuthorized) {
      let startDate;
      let endDate;
      const { startSwitch, endSwitch, start, end } = values;

      if (startSwitch === "now") {
        startDate = new Date();
      } else if (startSwitch === "date") {
        startDate = new Date(`${start.date}T${start.time}`);
      }

      if (endSwitch === "duration" && startDate) {
        const week = 7 * 24 * 60 * 60 * 1000;
        endDate = new Date(startDate.valueOf() + week);
      } else if (endSwitch === "date") {
        endDate = new Date(`${end.date}T${end.time}`);
      }

      if (startDate && endDate) {
        createProposal(startDate, endDate, values.title, values.body?.trim(), values.discussion?.trim());
      }
    }
  };

  const addProtocolToLink = () => {
    const value = getValues("discussion");

    if (value && UrlRegex.test(value) && !EmailRegex.test(value) && !UrlWithProtocolRegex.test(value)) {
      setValue("discussion", `http://${value}`);
    }
  };

  const resetStartDates = () => {
    resetField("start.date", { defaultValue: dayjs().format("YYYY-MM-DD") });
    resetField("start.time", { defaultValue: dayjs().add(5, "minute").format("HH:mm") });
  };

  const resetEndDates = () => {
    resetField("end.date", { defaultValue: dayjs().format("YYYY-MM-DD") });
    resetField("end.time", { defaultValue: dayjs().add(10, "minute").format("HH:mm") });
  };

  const getCtaLabel = () => {
    if (isDisconnected) {
      return "Connect to create proposal";
    } else if (isConfirming) {
      return "Creating proposal";
    } else if (indexingStatus === "pending") {
      return "Indexing proposal";
    } else {
      return "Create proposal";
    }
  };

  if (isAuthenticating) {
    return <PleaseWaitSpinner />;
  } else if (isUnAuthorized || isDisconnected) {
    return <Unauthorized />;
  }

  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-y-10 px-4 pb-8 pt-12 md:gap-y-12 md:px-6 md:pb-12">
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
      <Controller
        name="body"
        control={control}
        render={({ field }) => {
          const charCount = field.value?.length ?? 0;
          return (
            <div className="flex flex-col gap-y-3">
              <TextAreaRichText
                label="Description"
                helpText="Add a description for your proposal"
                onChange={field.onChange}
                value={field.value}
                onBlur={field.onBlur}
                isOptional={true}
                {...(errors.body?.message
                  ? {
                      variant: "critical",
                      alert: { variant: "critical", message: errors.body.message },
                      "aria-invalid": "true",
                    }
                  : {})}
              />
              {!errors.body?.message && (
                <p
                  className={classNames("text-xs font-normal leading-tight text-neutral-500 md:text-sm", {
                    "animate-shake": charCount === MAX_BODY_CHAR_COUNT,
                  })}
                >
                  {charCount}/{MAX_BODY_CHAR_COUNT}
                </p>
              )}
            </div>
          );
        }}
      />

      <InputText
        label="Discussion"
        helpText="Add a link to where the proposal discussion took place"
        isOptional={true}
        placeholder="https://..."
        {...register("discussion")}
        onBlur={(e) => {
          addProtocolToLink();
          register("discussion").onBlur(e);
        }}
        {...(errors.discussion?.message
          ? {
              variant: "critical",
              alert: { variant: "critical", message: errors.discussion?.message },
              "aria-invalid": "true",
            }
          : {})}
      />

      {/* SETTINGS */}
      <FormProvider {...formValues}>
        {/* Start Time */}
        <div className="flex flex-col gap-y-4">
          <Controller
            control={control}
            name="startSwitch"
            render={({ field: { onChange, ...rest } }) => (
              <RadioGroup
                label="Start date"
                helpText="Define when a proposal should be open for voting. If now is selected, the proposal is immediately active after publishing."
                className="gap-x-6 sm:!flex-row"
                {...rest}
                onValueChange={(value) => {
                  resetStartDates();
                  onChange(value);
                }}
              >
                {startSwitchValues.map((v) => (
                  <RadioCard key={v.label} label={v.label} value={v.value} description="" className="flex-1" />
                ))}
              </RadioGroup>
            )}
          />
          {startSwitch === "date" && <DateTimeSelector />}
        </div>

        {/* End Time */}
        <div className="flex flex-col gap-y-4">
          <Controller
            control={control}
            name="endSwitch"
            render={({ field: { onChange, ...rest } }) => (
              <RadioGroup
                className="gap-x-6 sm:!flex-row"
                label="End date"
                helpText="Define when your proposal should end. After the end date, there is no way to vote on the proposal."
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
