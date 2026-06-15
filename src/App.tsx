import React, { useState, useEffect } from "react";
import { LogOut, User as UserIcon, CheckSquare, Loader2 } from "lucide-react";
import {
  getLocalSessionUser,
  clearLocalSession,
  getLocalTasks,
  saveLocalTask,
  deleteLocalTask,
} from "./localStore";
import { Task, TaskStatus, UserProfile } from "./types";
import LandingPage from "./components/LandingPage";
import DashboardStats from "./components/DashboardStats";
import TaskFilters from "./components/TaskFilters";
import TaskListView from "./components/TaskListView";
import TaskColumn from "./components/TaskColumn";
import TaskModal from "./components/TaskModal";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  // Active view constraints
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  // Editorial modal controller
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // 1. Authenticate state listener (read local session)
  useEffect(() => {
    const sessionUser = getLocalSessionUser();
    if (sessionUser) {
      setUser(sessionUser);
      setIsTasksLoading(true);
      const loadedTasks = getLocalTasks(sessionUser.uid);
      setTasks(loadedTasks);
      setIsTasksLoading(false);
    }
    setIsAuthLoading(false);
  }, []);

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsTasksLoading(true);
    const loadedTasks = getLocalTasks(authenticatedUser.uid);
    setTasks(loadedTasks);
    setIsTasksLoading(false);
  };

  const handleLogout = () => {
    clearLocalSession();
    setUser(null);
    setTasks([]);
  };

  // 2. Save Task handler (Handles Create and Update)
  const handleSaveTask = async (
    taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt"> & { id?: string }
  ) => {
    if (!user) return;

    if (taskData.id) {
      // Operation UPDATE
      const original = tasks.find((t) => t.id === taskData.id);
      const updatedTask: Task = {
        ...taskData,
        id: taskData.id,
        userId: user.uid,
        createdAt: original ? original.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: taskData.tags || [],
      };
      
      const updatedTasks = saveLocalTask(user.uid, updatedTask);
      
      // Sort descending by modified date
      updatedTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setTasks(updatedTasks);
    } else {
      // Operation CREATE
      const newTask: Task = {
        ...taskData,
        id: "task_" + Math.random().toString(36).substring(2, 11),
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: taskData.tags || [],
      };
      
      const updatedTasks = saveLocalTask(user.uid, newTask);
      
      updatedTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setTasks(updatedTasks);
    }
    setIsModalOpen(false);
  };

  // 3. Quick state transition (Forward/Back arrow changes inside TaskCard)
  const handleQuickStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (!user) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTasks = saveLocalTask(user.uid, updatedTask);
    updatedTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setTasks(updatedTasks);
  };

  // 4. Delete Task action
  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this task?");
    if (!confirmDelete) return;

    const updatedTasks = deleteLocalTask(user.uid, taskId);
    updatedTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setTasks(updatedTasks);
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Perform client filter query processing (zero DB overhead, blazing speed)
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      viewMode === "kanban" ? true : statusFilter === "all" ? true : task.status === statusFilter;

    const matchesPriority = priorityFilter === "all" ? true : task.priority === priorityFilter;

    const matchesTag = selectedTag === "all" ? true : task.tags?.includes(selectedTag);

    return matchesSearch && matchesStatus && matchesPriority && matchesTag;
  });

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((t) => t.status === status);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="bg-[#606C38] text-[#FEFAE0] p-4 rounded-3xl shadow-lg border border-[#E8E3D9]">
            <CheckSquare className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-sm text-[#8A847E] font-semibold tracking-wide uppercase flex items-center gap-1.5">
            <Loader2 className="w-4 h-4 animate-spin text-[#606C38]" />
            Initializing workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between font-sans" id="app-workspace">
      {/* Editorial top layout Navigation */}
      <header className="border-b border-[#E8E3D9] bg-[#FDFBF7]/85 backdrop-blur-md sticky top-0 z-40 py-4 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#606C38] text-[#FEFAE0] p-2.5 rounded-2xl shadow-sm border border-[#606C38]/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="font-serif italic font-bold text-[#606C38] text-xl tracking-tight">TaskFlow</span>
        </div>

        {/* Profile Card & Log Out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-[#4A443F]">{user.displayName || "User workspace"}</span>
            <span className="text-[10px] font-medium text-[#8A847E] max-w-[150px] truncate">{user.email}</span>
          </div>

          <div className="w-9 h-9 rounded-xl border border-[#E8E3D9] bg-white flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#FEFAE0] flex items-center justify-center text-[#606C38] font-bold text-sm">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4 text-[#8A847E]" />}
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={handleLogout}
            title="Sign out of profile"
            className="p-2 border border-[#E8E3D9] hover:bg-[#F5F2ED] rounded-xl transition duration-200 text-[#8A847E] hover:text-[#4A443F] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Upper Bento Statistics */}
        <DashboardStats tasks={tasks} />

        {/* Searching, Toggles, Actions filter hub */}
        <TaskFilters
          tasks={tasks}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddTask={handleOpenCreateModal}
        />

        {/* Workspace Display Area */}
        {isTasksLoading ? (
          <div className="py-24 text-center rounded-3xl bg-white border border-[#E8E3D9] shadow-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#606C38] animate-spin mb-3.5" />
            <p className="text-sm font-semibold text-[#8A847E]">Loading your task archive...</p>
          </div>
        ) : viewMode === "kanban" ? (
          // Kanban Grid Board Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 align-top items-start">
            <TaskColumn
              id="backlog"
              title="Backlog"
              tasks={getTasksByStatus("backlog")}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onStatusChange={handleQuickStatusChange}
            />
            <TaskColumn
              id="todo"
              title="To Do"
              tasks={getTasksByStatus("todo")}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onStatusChange={handleQuickStatusChange}
            />
            <TaskColumn
              id="in_progress"
              title="In Progress"
              tasks={getTasksByStatus("in_progress")}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onStatusChange={handleQuickStatusChange}
            />
            <TaskColumn
              id="completed"
              title="Completed"
              tasks={getTasksByStatus("completed")}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onStatusChange={handleQuickStatusChange}
            />
          </div>
        ) : (
          // List View Layout
          <TaskListView
            tasks={filteredTasks}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteTask}
            onStatusChange={handleQuickStatusChange}
          />
        )}
      </main>

      {/* Task Creation / Modification Dialog */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />


    </div>
  );
}
