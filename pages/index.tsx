import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    console.log("in useEffect");
    router.push("/plugins/community-voting/#/");
  }, []);

  return null; // or a loading component
}
