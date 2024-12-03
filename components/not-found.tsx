import { EmptyState } from "@aragon/ods";
import router from "next/router";
import React from "react";

interface INotFoundProps {
  title?: string;
  message?: string;
  cta?: {
    label: string;
    path: string;
  };
}

export const NotFound: React.FC<INotFoundProps> = ({
  message = "We couldn't find the page that you're looking for.",
  title = "Page not found",
  cta = { label: "Go back", path: "/" },
}) => {
  return (
    <main className="flex h-full flex-1 justify-center py-24">
      <EmptyState
        heading={title}
        objectIllustration={{ object: "NOT_FOUND" }}
        description={message}
        primaryButton={{
          label: cta.label,
          className: "!rounded-full",
          onClick: () => {
            router.replace(cta.path);
          },
        }}
      />
    </main>
  );
};
