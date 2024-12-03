import { proseClasses } from "@/components/documentParser/utils";
import { CardCollapsible, DocumentParser, Heading } from "@aragon/ods";

interface IBodySectionProps {
  body: string;
}

export const BodySection: React.FC<IBodySectionProps> = (props) => {
  const { body } = props;

  return (
    <CardCollapsible
      buttonLabelClosed="Read full proposal"
      buttonLabelOpened="Read less"
      collapsedSize="md"
      className="shadow-neutral"
    >
      <div className="flex flex-col gap-y-4">
        <Heading size="h2">Proposal description</Heading>
        <hr className="rounded-full border-neutral-100" />
        <DocumentParser document={body} className={proseClasses} />
      </div>
    </CardCollapsible>
  );
};
