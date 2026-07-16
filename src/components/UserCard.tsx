import { useState } from "react";
import type { User } from "../types";
import { deleteUser } from "../api/userServices";
import ConfirmDialog from "./ConfirmDialog";
import AccountsModal from "./AccountModal";

interface Props {
  user: User;
  onDeleted: (id: string) => void;
}

export default function UserCard({ user, onDeleted }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleDelete = async () => {
    await deleteUser(user.id);
    onDeleted(user.id);
    setConfirming(false);
  };

  return (
    <>
      <div
        onClick={() => setShowAccounts(true)}
        className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <button
          onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs font-bold transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-lg flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          message="Do you want to delete this user?"
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}

      {showAccounts && (
        <AccountsModal
          user={user}
          onClose={() => setShowAccounts(false)}
        />
      )}
    </>
  );
}