import React from "react";
import { Clock, Calendar, Trash2, Edit3, ChevronDown, AlertCircle } from "lucide-react";
import { Task, TaskStatus } from "../types";

interface TaskCardProps {
  key?: string;
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  // Determine if task is overdue (if not completed and due date is past today)
  const isOverdue = (): boolean => {
    if (task.status === "completed" || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  };

  const getPriorityClasses = () => {
    switch (task.priority) {
      case "high":
        return "bg-[#FEFAE0] text-[#BC6C25] border-[#E8E3D9]";
      case "medium":
        return "bg-[#F5F2ED] text-[#DDA15E] border-[#E8E3D9]";
      default:
        return "bg-[#FDFBF7] text-[#8A847E] border-[#E8E3D9]";
    }
  };

  // Human-readable formatted due date
  const formatDueDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC", // Avoid local offsets
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id={`task-card-${task.id}`}
      className={`bg-white p-5 rounded-3xl border ${
        isOverdue() ? "border-[#BC6C25] ring-1 ring-[#BC6C25]/20" : "border-[#E8E3D9] hover:border-[#606C38]/40"
      } shadow-sm group hover:shadow-md transition duration-300 space-y-3`}
    >
      {/* Top badges bar */}
      <div className="flex items-center justify-between">
        {/* Priority */}
        <span
          className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${getPriorityClasses()}`}
        >
          {task.priority}
        </span>

        {/* Mini quick Controls */}
        <div className="flex items-center gap-1 opacity-80 md:opacity-0 group-hover:opacity-100 transition duration-300">
          <button
            id={`edit-task-btn-${task.id}`}
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1 px-1.5 rounded-lg text-[#8A847E] hover:text-[#4A443F] hover:bg-[#F5F2ED] transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`delete-task-btn-${task.id}`}
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1 px-1.5 rounded-lg text-[#8A847E]/90 hover:text-[#BC6C25] hover:bg-[#FEFAE0] transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h4
          className={`font-semibold text-[#4A443F] text-[15px] tracking-tight group-hover:text-[#606C38] transition ${
            task.status === "completed" ? "line-through text-[#8A847E]/60 group-hover:text-[#8A847E]/60" : ""
          }`}
        >
          {task.title}
        </h4>
        {task.description && (
          <p className="text-[#8A847E] text-xs leading-relaxed line-clamp-2 pr-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags line */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-[#FEFAE0] text-[#606C38] font-bold text-[9px] uppercase tracking-wide border border-[#E8E3D9]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom status and direct transiting flow bar */}
      <div className="pt-3 border-t border-[#E8E3D9] flex items-center justify-between text-xs font-semibold text-[#8A847E]">
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1 text-[11px]">
          {task.dueDate ? (
            <div
              className={`flex items-center gap-1.5 ${
                isOverdue() ? "text-[#BC6C25]" : "text-[#8A847E]"
              }`}
            >
              {isOverdue() ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> : <Calendar className="w-3.5 h-3.5 shrink-0" />}
              <span className="font-semibold">{formatDueDate(task.dueDate)}</span>
              {isOverdue() && <span className="font-bold text-[9px] uppercase tracking-wider block sm:inline">Overdue</span>}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#8A847E]/60">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="font-normal italic">No date set</span>
            </div>
          )}
        </div>

        {/* Work column shift controls */}
        <div className="relative inline-flex items-center">
          <select
            id={`task-status-select-${task.id}`}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="appearance-none bg-[#F5F2ED] hover:bg-[#E8E3D9] border border-[#E8E3D9] text-[#4A443F] font-bold text-[11px] uppercase tracking-wider pl-3 pr-7 py-1.5 rounded-xl outline-none focus:ring-1 focus:ring-[#606C38]/40 transition cursor-pointer select-none"
          >
            <option value="backlog">📁 Backlog</option>
            <option value="todo">📋 To Do</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
          <div className="pointer-events-none absolute right-2 text-[#8A847E]">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
