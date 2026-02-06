import { CalendarView } from "@/components/marketing/CalendarView";
import { InfluenceurWidget } from "@/components/marketing/InfluencerWidget";

export default function MarketingPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 h-[calc(100vh-140px)]">
            {/* Calendar (65% -> 6.5/10) */}
            <div className="lg:col-span-7 h-full flex flex-col">
                <CalendarView />
            </div>

            {/* Influencers (35% -> 3.5/10) */}
            <div className="lg:col-span-3 h-full overflow-hidden">
                <InfluenceurWidget />
            </div>
        </div>
    );
}
