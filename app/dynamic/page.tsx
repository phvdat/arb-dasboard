import Loading from "@/components/common/Loading";
import DynamicClient from "@/components/dynamic/DynamicClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DynamicClient />
    </Suspense>
  );
}
