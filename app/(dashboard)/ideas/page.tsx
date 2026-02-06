import { IdeaInput } from "@/components/ideas/IdeaInput";
import { IdeasList } from "@/components/ideas/IdeasList";

export default function IdeasPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-140px)]">
            {/* Left Input Area (60%) */}
            <div className="lg:col-span-3">
                <IdeaInput />
            </div>

            {/* Right History (40%) */}
            <div className="lg:col-span-2 h-full">
                <IdeasList />
            </div>
        </div>
    );
}
