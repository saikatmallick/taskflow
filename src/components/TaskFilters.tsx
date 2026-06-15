import React from "react";
import { Search, Filter, Kanban, List, Plus, Tag } from "lucide-react";
import { TaskStatus, TaskPriority, Task } from "../types";

interface TaskFiltersProps {
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  viewMode: "kanban" | "list";
  setViewMode: (mode: "kanban" | "list") => void;
  onAddTask: () => void;
}

export default function TaskFilters({
  tasks,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  selectedTag,
  setSelectedTag,
  viewMode,
  setViewMode,
  onAddTask,
 }: TaskFiltersProps) {
  // Extract all unique tags present in any of the user's tasks
  const availableTags = Array.from(
    new Set(tasks.flatMap((task) => task.tags || []).filter(Boolean))
  );

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8E3D9] shadow-sm space-y-4 mb-6" id="task-filters">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A847E]" />
          <input
            id="search-input"
            type="text"
            placeholder="Search tasks by title or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E8E3D9] focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/10 rounded-full text-sm transition outline-none placeholder-[#8A847E]/60 text-[#4A443F] font-medium"
          />
        </div>

        {/* Action Toggle buttons / CTA */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="bg-[#F5F2ED] p-1 rounded-full flex items-center gap-1">
            <button
              id="kanban-view-btn"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-[#606C38] shadow-sm"
                  : "text-[#8A847E] hover:text-[#4A443F]"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              id="list-view-btn"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[#606C38] shadow-sm"
                  : "text-[#8A847E] hover:text-[#4A443F]"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          {/* Add Task CTA */}
          <button
            id="add-task-btn"
            onClick={onAddTask}
            className="flex items-center gap-1.5 bg-[#606C38] hover:bg-[#4f582f] active:scale-[0.98] text-[#FEFAE0] font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Advanced Filters fold */}
      <div className="pt-2 border-t border-[#E8E3D9] flex flex-wrap items-center gap-4 text-xs text-[#8A847E] font-medium">
        <span className="flex items-center gap-1 text-[#8A847E]/80 py-1 font-bold uppercase tracking-wider text-[10px]">
          <Filter className="w-3 h-3" />
          Filter by:
        </span>

        {/* Status Dropdown/Selector if in list mode */}
        {viewMode === "list" && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#8A847E]/80">Status</span>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#E8E3D9] px-2.5 py-1.5 rounded-xl text-[#4A443F] focus:outline-[#606C38] font-semibold cursor-pointer"
            >
              <option value="all">All States</option>
              <option value="backlog">Backlog</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#8A847E]/80">Priority</span>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-[#E8E3D9] px-2.5 py-1.5 rounded-xl text-[#4A443F] focus:outline-[#606C38] font-semibold cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Dynamic Tag Filter */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#8A847E]/80 flex items-center gap-0.5">
              <Tag className="w-3 h-3" />
              Tag
            </span>
            <select
              id="tag-filter"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-white border border-[#E8E3D9] px-2.5 py-1.5 rounded-xl text-[#4A443F] focus:outline-[#606C38] font-semibold cursor-pointer"
            >
              <option value="all">All Tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
