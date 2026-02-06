"use client";

import { Task } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, MoreVertical, GripVertical } from "lucide-react"; // Grip for drag handle if needed
import { USERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    const priorityColor =
        task.priority === "URGENT" ? "border-l-[#ff3366]" :
            task.priority === "IMPORTANT" ? "border-l-[#ffaa00]" : "border-l-[#00ff88]";

    const priorityColorHex =
        task.priority === "URGENT" ? "#ff3366" :
            task.priority === "IMPORTANT" ? "#ffaa00" : "#00ff88";

    const assignee = Object.values(USERS).find(u => u.id === task.assignedTo);

    // Parse date safely
    const deadlineDate = new Date(task.deadline);
    const isUrgentDeadline = deadlineDate.getTime() - Date.now() < 86400000;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "bg-surface border border-border rounded-xl p-5 mb-3 flex items-center gap-4 group hover:shadow-lg transition-all border-l-4",
                priorityColor,
                isDragging && "ring-2 ring-primary ring-opacity-50"
            )}
        >
            <Checkbox className="h-6 w-6 rounded-md border-primary/50 data-[state=checked]:bg-primary" />

            <div className="flex-grow min-w-0">
                <h4 className="text-white font-bold text-base truncate">{task.title}</h4>
                <p className="text-text-muted text-sm truncate">{task.description}</p>
            </div>

            <div className="flex items-center gap-3 hidden sm:flex">
                {/* Project Tag */}
                <div className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-xs font-medium">
                    <span className={task.project === "WeHill" ? "text-white" : "text-primary"}>
                        {task.project}
                    </span>
                </div>

                {/* Deadline */}
                <div className={cn("flex items-center gap-1.5 text-xs", isUrgentDeadline ? "text-danger" : "text-text-muted")}>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                        {deadlineDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                </div>

                {/* Assignee */}
                <Avatar
                    src={assignee?.avatar}
                    fallback={assignee?.name.substring(0, 2)}
                    className="h-9 w-9 border-2 cursor-pointer hover:scale-110 transition-transform"
                    style={{ borderColor: priorityColorHex }}
                />
            </div>

            <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-text-muted">
                <MoreVertical className="h-5 w-5" />
            </button>
        </div>
    );
}
