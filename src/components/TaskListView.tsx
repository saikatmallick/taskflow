import React from "react";
import { ListTodo, Edit3, Trash2, Calendar, AlertCircle } from "lucide-react";
import { Task, TaskStatus, TaskPriority } from "../types";

interface TaskListViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export default function TaskListView({ tasks, onEdit, onDelete, onStatusChange }: TaskListViewProps) {
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "bg-[#FEFAE0] text-[#BC6C25] border-[#E8E3D9]";
      case "medium":
        return "bg-[#F5F2ED] text-[#DDA15E] border-[#E8E3D9]";
      default:
        return "bg-[#F5F2ED] text-[#8A847E] border-[#E8E3D9]";
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "bg-[#F5F2ED] text-[#606C38] border-[#E8E3D9]";
      case "in_progress":
        return "bg-[#FEFAE0] text-[#606C38] border-[#E8E3D9] ring-2 ring-[#606C38]/20";
      case "todo":
        return "bg-white text-[#4A443F] border-[#E8E3D9]";
      default: // backlog
        return "bg-[#FDFBF7] text-[#8A847E] border-[#E8E3D9]";
    }
  };

  const isOverdue = (task: Task): boolean => {
    if (task.status === "completed" || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return dateStr;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#E8E3D9] p-16 text-center shadow-sm flex flex-col items-center justify-center">
        <ListTodo className="w-12 h-12 text-[#E8E3D9] stroke-[1.25] mb-4" />
        <h3 className="font-bold text-[#4A443F] font-serif italic text-lg mb-1">No Matching Tasks</h3>
        <p className="text-[#8A847E] text-sm max-w-sm mb-0.5">
          Try adjusting your search keywords, priority level, or tag filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E8E3D9] shadow-sm overflow-hidden" id="task-list-view">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#F5F2ED] border-b border-[#E8E3D9] text-[11px] font-bold uppercase tracking-wider text-[#8A847E]">
              <th className="py-4 px-6">Task Title & Details</th>
              <th className="py-4 px-6">Workflow Status</th>
              <th className="py-4 px-6">Task Priority</th>
              <th className="py-4 px-6">Target Due Date</th>
              <th className="py-4 px-6 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3D9] text-sm">
            {tasks.map((task) => (
              <tr
                key={task.id}
                id={`list-row-${task.id}`}
                className="group hover:bg-[#FDFBF7]/60 transition duration-200"
              >
                {/* Title & info */}
                <td className="py-4 px-6 max-w-md">
                  <div className="space-y-1">
                    <span
                      className={`font-semibold text-[#4A443F] tracking-tight block transition group-hover:text-[#606C38] ${
                        task.status === "completed" ? "line-through text-[#8A847E]/60 group-hover:text-[#8A847E]/60" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="text-[#8A847E] text-xs truncate max-w-sm">
                        {task.description}
                      </p>
                    )}
                    {/* Inline Tag List */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold text-[#606C38] uppercase px-2 py-0.5 bg-[#FEFAE0] border border-[#E8E3D9] rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status Column */}
                <td className="py-4 px-6">
                  <select
                    id={`list-status-select-${task.id}`}
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border outline-none cursor-pointer ${getStatusBadge(
                      task.status
                    )}`}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>

                {/* Priority Column */}
                <td className="py-4 px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>

                {/* Due Date Column */}
                <td className="py-4 px-6">
                  {task.dueDate ? (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold ${
                        isOverdue(task) ? "text-[#BC6C25] animate-pulse" : "text-[#8A847E]"
                      }`}
                    >
                      {isOverdue(task) ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5 text-[#8A847E]/70" />}
                      <span>{formatDueDate(task.dueDate)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#8A847E]/50 italic">None</span>
                  )}
                </td>

                {/* Actions Column */}
                <td className="py-4 px-6 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      id={`list-edit-btn-${task.id}`}
                      onClick={() => onEdit(task)}
                      title="Edit task details"
                      className="p-2 rounded-xl text-[#8A847E] hover:text-[#4A443F] hover:bg-[#F5F2ED] transition cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      id={`list-delete-btn-${task.id}`}
                      onClick={() => onDelete(task.id)}
                      title="Delete task irreversible"
                      className="p-2 rounded-xl text-[#8A847E] hover:text-[#BC6C25] hover:bg-[#FEFAE0] transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
