"use client";

import { useState, useEffect } from "react";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import {
  userApi,
  type UserDto,
  type UserRequest,
} from "../../services/user-api";
import { useToast } from "../../contexts/ToastContext";

interface AdminUsersProps {
  users: UserDto[];
  setUsers: (users: UserDto[]) => void;
}

export default function AdminUsers({ users, setUsers }: AdminUsersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState<UserRequest>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const toast = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load users";
      setError(message);
      toast.error("Load failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: UserDto) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone ?? "",
        password: "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
      });
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Validation error", "Name and email are required");
      return;
    }

    if (!editingUser && !formData.password?.trim()) {
      toast.error("Validation error", "Password is required when creating a user");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingUser) {
        await userApi.updateUser(editingUser.userId, {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        });
        toast.success("Success", "User updated successfully");
      } else {
        await userApi.createUser({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        toast.success("Success", "User created successfully");
      }

      setIsModalOpen(false);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user: UserDto) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      return;
    }

    try {
      await userApi.deleteUser(user.userId);
      toast.success("Success", "User deleted successfully");
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not delete user";
      toast.error("Error", message);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold">User Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage customer accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {error && !loading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadUsers} className="underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Phone</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{user.fullName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="rounded p-2 transition-colors hover:bg-secondary"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="rounded p-2 transition-colors hover:bg-secondary"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-secondary rounded-lg p-4 text-sm">
        <p className="font-medium">
          Total Users: <span className="text-primary">{users.length}</span>
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">
              {editingUser ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    value={formData.phone ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none"
                    placeholder="Enter phone number"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none"
                      placeholder="Enter password"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
