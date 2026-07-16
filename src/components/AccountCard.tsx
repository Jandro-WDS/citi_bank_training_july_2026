import { useState } from "react";
import type { Account } from "../types";
import { deleteAccount } from "../api/accountServices";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  account: Account;
  onDeleted: (id: string) => void;
}

export default function AccountCard({ account, onDeleted }: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    await deleteAccount(account.id);
    onDeleted(account.id);
    setConfirming(false);
  };

  return (
    <>
      <div className="relative bg-gray-50 rounded-xl border border-gray-100 p-4">
        <button
          onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 text-xs font-bold transition"
        >
          ✕
        </button>
        <p className="font-semibold text-gray-800">{account.accountType}</p>
        <p className="text-2xl font-bold text-indigo-600 mt-1">
          ${account.balance.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Interest rate: {(account.interestRate * 100).toFixed(2)}%
        </p>
      </div>

      {confirming && (
        <ConfirmDialog
          message="Do you want to delete this account?"
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}