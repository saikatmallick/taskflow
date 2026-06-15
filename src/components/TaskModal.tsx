import React, { useState, useEffect } from "react";
import { X, Tag as TagIcon, Calendar, BookOpen, AlertTriangle } from "lucide-react";
import { Task, TaskStatus, TaskPriority } from "../types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt"> & { id?: string }) => Promise<void>;
  task?: Task | null; // If provided, we are editing
}

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with selected editing task or reset for new creation
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
      setPriority(task.priority || "medium");
      setDueDate(task.dueDate || "");
      setTags(task.tags || []);
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setDueDate("");
      setTags([]);
    }
    setErrorMsg("");
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase();
    if (!cleanTag) return;

    if (tags.includes(cleanTag)) {
      setErrorMsg("Tag already exists on this task.");
      return;
    }

    if (tags.length >= 10) {
      setErrorMsg("A task can have a maximum of 10 tags.");
      return;
    }

    if (cleanTag.length > 30) {
      setErrorMsg("Each tag must be 30 characters or less.");
      return;
    }

    setTags([...tags, cleanTag]);
    setTagInput("");
    setErrorMsg("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMsg("Title is required.");
      return;
    }

    if (cleanTitle.length > 100) {
      setErrorMsg("Title must be 100 characters or less.");
      return;
    }

    if (description.length > 2048) {
      setErrorMsg("Description must be 2048 characters or less.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: task?.id, // will be undefined for creations
        title: cleanTitle,
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate || null,
        tags,
      });
      onClose();
    } catch (saveError) {
      console.error(saveError);
      setErrorMsg(
        saveError instanceof Error
          ? saveError.message
          : "An error occurred while saving your task."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="task-modal-container">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#4A443F]/45 backdrop-blur-sm transition-all"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E8E3D9] p-6 sm:p-7 relative z-10 max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E3D9] mb-5">
          <h2 className="text-xl font-serif italic font-bold text-[#606C38] tracking-tight">
            {task ? "Edit Task Details" : "Create New Task"}
          </h2>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="text-[#8A847E] hover:text-[#4A443F] hover:bg-[#F5F2ED] p-2 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-[#FEFAE0] text-[#BC6C25] text-xs px-4 py-3 rounded-xl mb-5 flex items-start gap-2.5 border border-[#E8E3D9] font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8A847E]/90 uppercase tracking-wider block">
              Task Title <span className="text-[#BC6C25]">*</span>
            </label>
            <input
              id="modal-title-input"
              type="text"
              required
              placeholder="e.g. Redesign checkout landing workflow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E3D9] focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/10 rounded-xl text-sm transition outline-none font-semibold text-[#4A443F] placeholder-[#8A847E]/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8A847E]/90 uppercase tracking-wider block">
              Detailed Description
            </label>
            <textarea
              id="modal-desc-input"
              rows={3}
              placeholder="Provide a clear description of the deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E3D9] focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/10 rounded-xl text-sm transition outline-none font-semibold text-[#4A443F] placeholder-[#8A847E]/50 resize-none"
            />
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A847E]/90 uppercase tracking-wider block">
                Workflow Column
              </label>
              <select
                id="modal-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-white border border-[#E8E3D9] px-3.5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer outline-none text-[#4A443F] focus:border-[#606C38]"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A847E]/90 uppercase tracking-wider block">
                Task Priority
              </label>
              <select
                id="modal-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-white border border-[#E8E3D9] px-3.5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer outline-none text-[#4A443F] focus:border-[#606C38]"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8A847E]/90 uppercase tracking-wider block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Target Due Date
            </label>
            <input
              id="modal-due-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#E8E3D9] focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/10 rounded-xl text-sm transition outline-none font-semibold text-[#4A443F]"
            />
          </div>

          {/* Tag constructor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#8A847E]/90 uppercase tracking-wider block flex items-center gap-1">
              <TagIcon className="w-3.5 h-3.5" />
              Tags / Keywords ({tags.length}/10)
            </label>
            <div className="flex gap-2">
              <input
                id="modal-tag-input"
                type="text"
                placeholder="Type and press space, enter, or click Add..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
                className="flex-1 px-4 py-2 bg-white border border-[#E8E3D9] focus:border-[#606C38] focus:ring-2 focus:ring-[#606C38]/10 rounded-xl text-xs transition outline-none font-semibold text-[#4A443F] placeholder-[#8A847E]/50"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#F5F2ED] hover:bg-[#E8E3D9] text-[#4A443F] font-bold px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Display active tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FEFAE0] text-[#606C38] font-bold text-[10px] uppercase border border-[#E8E3D9] transition"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#BC6C25] hover:text-[#4A443F] transition ml-0.5 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E3D9] mt-5">
            <button
              id="cancel-modal-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#E8E3D9] hover:bg-[#F5F2ED] font-bold text-sm text-[#8A847E] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-modal-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-[#606C38] hover:bg-[#4f582f] text-[#FEFAE0] font-bold text-sm transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Saving changes..." : task ? "Update Details" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
