"use client"

import { useState } from "react"
import { Lock, Unlock, Search, Trash2 } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  blocked: boolean
}

interface AdminUsersProps {
  users: User[]
  setUsers: (users: User[]) => void
}

export default function AdminUsers({ users, setUsers }: AdminUsersProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleBlockUser = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u)))
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold">User Management</h2>
        <p className="text-muted-foreground mt-1">Manage customer accounts and access</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">User ID</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-primary">{user.id}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBlockUser(user.id)}
                        className="p-2 hover:bg-secondary rounded transition-colors"
                        title={user.blocked ? "Unblock" : "Block"}
                      >
                        {user.blocked ? (
                          <Unlock className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-yellow-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-secondary rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-secondary rounded-lg p-4 text-sm">
        <p className="font-medium">
          Total Users: <span className="text-primary">{users.length}</span>
        </p>
        <p className="text-muted-foreground">
          Active: <span className="text-green-600">{users.filter((u) => !u.blocked).length}</span> | Blocked:{" "}
          <span className="text-red-600">{users.filter((u) => u.blocked).length}</span>
        </p>
      </div>
    </div>
  )
}
