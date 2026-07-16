import { useEffect, useState } from "react";
import type { Account, User } from "../types";
import { getAccountsByUserId } from "../api/accountServices";
import AccountCard from "./AccountCard";

interface Props {
  user: User;
  onClose: () => void;
}

export default function AccountsModal({ user, onClose }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccountsByUserId(user.id)
      .then(setAccounts)
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleAccountDeleted = (deletedId: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== deletedId));
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading accounts...</p>}

        {!loading && accounts.length === 0 && (
          <p className="text-gray-400 text-sm">No accounts found for this user.</p>
        )}

        {!loading && accounts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onDeleted={handleAccountDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}