import { Heading } from "@aragon/ods";

export default function Unauthorized() {
  return (
    <div className="flex w-full flex-col items-center justify-center pt-32 md:pt-60">
      <Heading size="h1">Unauthorized</Heading>
      <p className="text-center text-xl text-neutral-800">You do not have access to this page.</p>
    </div>
  );
}
