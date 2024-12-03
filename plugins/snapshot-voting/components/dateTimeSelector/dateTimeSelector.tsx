import { InputDate, InputTime } from "@aragon/ods";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { type ProposalCreationSchema } from "../newProposalForm/types";

interface IDateTimeSelector {
  prefix?: "start" | "end";
}

export const DateTimeSelector: React.FC<IDateTimeSelector> = (props) => {
  const { prefix = "start" } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext<z.infer<typeof ProposalCreationSchema>>();

  return (
    <div className="flex flex-col gap-y-3 rounded-xl border border-neutral-100 bg-neutral-0 p-4 md:flex-row md:gap-x-3 md:gap-y-0">
      <InputDate
        label="Date"
        min={prefix === "start" ? dayjs().format("YYYY-MM-DD") : dayjs().add(5, "minutes").format("YYYY-MM-DD")}
        {...register(`${prefix}.date`)}
        {...(errors[prefix]?.date?.message
          ? {
              variant: "critical",
              alert: { variant: "critical", message: errors[prefix].date.message },
              "aria-invalid": "true",
            }
          : {})}
        className="flex-1"
      />

      <InputTime
        label="Time"
        {...register(`${prefix}.time`)}
        {...(errors[prefix]?.time?.message
          ? {
              variant: "critical",
              alert: { variant: "critical", message: errors[prefix].time.message },
              "aria-invalid": "true",
            }
          : {})}
        {...(prefix === "start" ? { min: dayjs().format("hh:mm") } : {})}
        className="flex-1"
      />
    </div>
  );
};
