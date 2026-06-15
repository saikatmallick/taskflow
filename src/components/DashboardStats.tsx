import React from "react";
import { CheckCircle2, Clock, ListTodo, AlertCircle } from "lucide-react";
import { Task } from "../types";

interface DashboardStatsProps {
  tasks: Task[];
}

export default function DashboardStats({ tasks }: DashboardStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "completed").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" id="dashboard-stats">
      {/* Total Tasks Card */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E3D9] shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-[#8A847E] font-bold uppercase tracking-wider">Total Workload</span>
          <h4 className="text-3xl font-serif italic font-bold text-[#4A443F]">{total}</h4>
          <p className="text-xs text-[#8A847E] font-medium">{todo} ready, {inProgress} ongoing</p>
        </div>
        <div className="bg-[#F5F2ED] text-[#4A443F] p-3 rounded-2xl">
          <ListTodo className="w-6 h-6" />
        </div>
      </div>

      {/* In Progress Card */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E3D9] shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-[#8A847E] font-bold uppercase tracking-wider">In Progress</span>
          <h4 className="text-3xl font-serif italic font-bold text-[#BC6C25]">{inProgress}</h4>
          <p className="text-xs text-[#8A847E] font-medium">Active engagement</p>
        </div>
        <div className="bg-[#FEFAE0] text-[#BC6C25] p-3 rounded-2xl">
          <Clock className="w-6 h-6 animate-spin-slow" />
        </div>
      </div>

      {/* Completion Rate Card */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E3D9] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between w-full mb-3">
          <div className="space-y-0.5">
            <span className="text-xs text-[#8A847E] font-bold uppercase tracking-wider">Completion Rate</span>
            <h4 className="text-3xl font-serif italic font-bold text-[#606C38]">{completionRate}%</h4>
          </div>
          <div className="bg-[#F5F2ED] text-[#606C38] p-2.5 rounded-2xl">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-[#F5F2ED] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#606C38] h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* High Priority Active Card */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E3D9] shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-[#8A847E] font-bold uppercase tracking-wider">Urgent Action</span>
          <h4 className="text-3xl font-serif italic font-bold text-[#BC6C25]">{highPriority}</h4>
          <p className="text-xs text-[#8A847E] font-medium">High priority active tasks</p>
        </div>
        <div className="bg-[#FEFAE0] text-[#BC6C25] p-3 rounded-2xl">
          <AlertCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
