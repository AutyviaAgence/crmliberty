"use client";

import { useState } from "react";
import { IdeaInput } from "@/components/ideas/IdeaInput";
import { IdeasList } from "@/components/ideas/IdeasList";

export default function IdeasPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 lg:h-[calc(100vh-120px)]">
      <div className="lg:col-span-3">
        <IdeaInput onSaved={() => setRefreshKey((k) => k + 1)} />
      </div>
      <div className="lg:col-span-2 h-full">
        <IdeasList refreshKey={refreshKey} />
      </div>
    </div>
  );
}
