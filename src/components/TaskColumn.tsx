import React from "react";
import { FolderKanban, CheckCircle, Clock, Inbox, AlertOctagon } from "lucide-react";
import TaskCard from "./TaskCard";
import { Task, TaskStatus } from "../types";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export default function TaskColumn({
  id,
  title,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskColumnProps) {
  const getHeaderIcon = () => {
    switch (id) {
      case "backlog":
        return <AlertOctagon className="w-4 h-4 text-[#8A847E]" />;
      case "todo":
        return <Inbox className="w-4 h-4 text-[#BC6C25]" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-[#606C38] animate-pulse" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-[#606C38]" />;
    }
  };

  const getHeaderClasses = () => {
    switch (id) {
      case "backlog":
        return "border-[#E8E3D9] bg-[#F5F2ED]";
      case "todo":
        return "border-[#E8E3D9] bg-[#FEFAE0]/80";
      case "in_progress":
        return "border-[#606C38]/20 bg-[#FEFAE0]/60 ring-2 ring-[#606C38]/10";
      case "completed":
        return "border-[#E8E3D9] bg-[#F5F2ED]/60";
    }
  };

  return (
    <div className="flex flex-col bg-[#F5F2ED]/40 rounded-3xl p-4 border border-[#E8E3D9] h-full max-h-[750px]" id={`kanban-column-${id}`}>
      {/* Column Title Header */}
      <div className={`flex items-center justify-between p-3 rounded-2xl border mb-4 shadow-sm ${getHeaderClasses()}`}>
        <div className="flex items-center gap-2.5">
          {getHeaderIcon()}
          <span className="font-serif italic text-base text-[#606C38] tracking-tight">{title}</span>
        </div>
        <span className="bg-[#E8E3D9]/60 text-[#4A443F] font-bold text-xs px-2.5 py-0.5 rounded-full select-none">
          {tasks.length}
        </span>
      </div>

      {/* Scrollable list content */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-[350px]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#E8E3D9] rounded-3xl bg-white/40 p-4">
            <FolderKanban className="w-8 h-8 text-[#8A847E]/40 stroke-[1.25] mb-2.5" />
            <p className="text-[13px] text-[#8A847E] font-semibold mb-0.5">Empty pipeline</p>
            <p className="text-[11px] text-[#8A847E] font-normal leading-relaxed max-w-[150px]">
              No work assigned to {title.toLowerCase()}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
