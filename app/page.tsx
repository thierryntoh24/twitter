import { useAuth } from "@/utils/context/AuthContext";
import React, { Suspense } from "react";
import PageContent from "./pagecontent";

export default function Home() {
  return (
    <section>
      <Suspense
        fallback={
          <div className=" flex w-full py-24 align-middle justify-center items-center">
            Loading...
          </div>
        }
      >
        <PageContent />
      </Suspense>
    </section>
  );
}
