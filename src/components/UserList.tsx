import { useEffect, useState } from "react";
import { getUsers } from "../api/userServices.ts";
import type { User } from "../types";

function UserCard({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-lg flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{user.name}</p>
          <p className="text-sm text-gray-400 truncate">{user.email}</p>
        </div>
      </div>
      <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-mono truncate">{user.id}</span>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setError("Could not load users. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-400 mt-1">{!loading && !error ? `${users.length} registered` : ""}</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-500 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg">No users yet.</p>
            <p className="text-sm mt-1">Create one via POST /users to see it here.</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}