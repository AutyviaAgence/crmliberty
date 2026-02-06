import { StatsCards } from "@/components/dashboard/StatsCards";
import { UrgentTasksWidget } from "@/components/dashboard/UrgentTasksWidget";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { PipelineWidget } from "@/components/dashboard/PipelineWidget";
import { IdeasWidget } from "@/components/dashboard/IdeasWidget";

export default function DashboardPage() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* Left Column (Main Stats & Tasks) - 60% approx on XL */}
            <div className="xl:col-span-3">
                <StatsCards />

                <UrgentTasksWidget />

                <ActivityTimeline />
            </div>

            {/* Right Column (Pipeline & Ideas) - 40% approx on XL */}
            <div className="xl:col-span-2">
                <PipelineWidget />

                <IdeasWidget />
            </div>
        </div>
    );
}
