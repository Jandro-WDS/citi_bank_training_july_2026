import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUsers, deleteUser, creatUSer } from "../../api/userServices";
import { getAccountsByUserId, createAccount, deleteAccount, getTransactions } from "../../api/accountServices";
import type { User, Account, Transaction } from "../../types";
import TopBar from "../../components/TopBar";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  X,
  Users as UsersIcon,
  CreditCard,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

function getErrorMessage(err: unknown, fallback: string) {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response
  ) {
    const data = (err.response as { data?: { error?: string; message?: string } }).data;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
  }
  return fallback;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userAccounts, setUserAccounts] = useState<Record<string, Account[]>>({});
  const [accountsLoading, setAccountsLoading] = useState<string | null>(null);

  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [accountTx, setAccountTx] = useState<Record<string, Transaction[]>>({});
  const [txLoading, setTxLoading] = useState<string | null>(null);

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "" });
  const [userFormError, setUserFormError] = useState<string | null>(null);
  const [userFormLoading, setUserFormLoading] = useState(false);

  const [creatingAccountFor, setCreatingAccountFor] = useState<string | null>(null);
  const [newAccountType, setNewAccountType] = useState<"SAVINGS" | "CHECKING">("SAVINGS");
  const [accountFormLoading, setAccountFormLoading] = useState(false);

  const [deleteUserTarget, setDeleteUserTarget] = useState<string | null>(null);
  const [deleteAccountTarget, setDeleteAccountTarget] = useState<{ id: string; userId: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUser = async (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }
    setExpandedUser(userId);
    setExpandedAccount(null);
    if (!userAccounts[userId]) {
      setAccountsLoading(userId);
      try {
        const accounts = await getAccountsByUserId(userId);
        setUserAccounts((prev) => ({ ...prev, [userId]: accounts }));
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to load accounts."));
      } finally {
        setAccountsLoading(null);
      }
    }
  };

  const toggleAccount = async (accountId: string) => {
    if (expandedAccount === accountId) {
      setExpandedAccount(null);
      return;
    }
    setExpandedAccount(accountId);
    if (!accountTx[accountId]) {
      setTxLoading(accountId);
      try {
        const txs = await getTransactions(accountId);
        const sorted = [...txs].sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setAccountTx((prev) => ({ ...prev, [accountId]: sorted }));
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to load transactions."));
      } finally {
        setTxLoading(null);
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password.trim()) {
      setUserFormError("All fields are required.");
      return;
    }
    if (userForm.password.length < 6) {
      setUserFormError("Password must be at least 6 characters.");
      return;
    }
    setUserFormError(null);
    setUserFormLoading(true);
    try {
      await creatUSer(userForm);
      toast.success("User created.");
      setShowCreateUser(false);
      setUserForm({ name: "", email: "", password: "" });
      await fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create user. Email may already exist."));
    } finally {
      setUserFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserTarget) return;
    try {
      await deleteUser(deleteUserTarget);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserTarget));
      toast.success("User deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete user."));
    } finally {
      setDeleteUserTarget(null);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    setAccountFormLoading(true);
    try {
      await createAccount({ userId, accountType: newAccountType });
      toast.success("Account created.");
      setCreatingAccountFor(null);
      const accounts = await getAccountsByUserId(userId);
      setUserAccounts((prev) => ({ ...prev, [userId]: accounts }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create account."));
    } finally {
      setAccountFormLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountTarget) return;
    const { id, userId } = deleteAccountTarget;
    try {
      await deleteAccount(id);
      setUserAccounts((prev) => ({
        ...prev,
        [userId]: (prev[userId] ?? []).filter((a) => a.id !== id),
      }));
      toast.success("Account deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete account."));
    } finally {
      setDeleteAccountTarget(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalAccounts = Object.values(userAccounts).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Horizon Bank" subtitle="Admin console" />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage all users, accounts, and transactions from one place.
            </p>
          </div>
          <button
            onClick={() => setShowCreateUser((v) => !v)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
          >
            <Plus size={16} />
            New user
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
              <UsersIcon size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total users</p>
              <p className="text-xl font-bold text-slate-900">{users.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Accounts loaded</p>
              <p className="text-xl font-bold text-slate-900">{totalAccounts}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Balance (Cumulative)</p>
              <p className="text-xl font-bold text-slate-900">
                $
                {Object.values(userAccounts)
                  .flat()
                  .reduce((sum, a) => sum + a.balance, 0)
                  .toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Create user form */}
        {showCreateUser && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Create user</h2>
              <button onClick={() => setShowCreateUser(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4" noValidate>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="Jay Doe"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="jay@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="••••••••"
                />
              </div>
              {userFormError && <p className="col-span-full text-sm text-red-500">{userFormError}</p>}
              <div className="col-span-full flex justify-end">
                <button
                  type="submit"
                  disabled={userFormLoading}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {userFormLoading ? "Creating..." : "Create user"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>

        {/* User table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-14">No users found.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <div key={user.id}>
                  <div
                    onClick={() => toggleUser(user.id)}
                    className="w-full flex items-center px-6 py-4 hover:bg-slate-50 transition text-left cursor-pointer"
                  >
                    <span className="text-slate-400 mr-3">
                      {expandedUser === user.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm">{user.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteUserTarget(user.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition ml-3"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Accounts for user */}
                  {expandedUser === user.id && (
                    <div className="bg-slate-50 px-6 py-5 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accounts</p>
                        <button
                          onClick={() => {
                            setCreatingAccountFor(creatingAccountFor === user.id ? null : user.id);
                            setNewAccountType("SAVINGS");
                          }}
                          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <Plus size={13} />
                          New account
                        </button>
                      </div>

                      {creatingAccountFor === user.id && (
                        <form
                          onSubmit={(e) => handleCreateAccount(e, user.id)}
                          className="flex items-end gap-3 bg-white rounded-xl border border-slate-100 p-4 mb-4"
                        >
                          <div>
                            <label className="text-xs font-medium text-slate-600 mb-1 block">Account type</label>
                            <select
                              value={newAccountType}
                              onChange={(e) => setNewAccountType(e.target.value as "SAVINGS" | "CHECKING")}
                              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                            >
                              <option value="SAVINGS">Savings</option>
                              <option value="CHECKING">Checking</option>
                            </select>
                          </div>
                          <button
                            type="submit"
                            disabled={accountFormLoading}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                          >
                            {accountFormLoading ? "Creating..." : "Create"}
                          </button>
                        </form>
                      )}

                      {accountsLoading === user.id && !userAccounts[user.id] ? (
                        <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
                      ) : !userAccounts[user.id] || userAccounts[user.id].length === 0 ? (
                        <p className="text-slate-400 text-sm">No accounts for this user.</p>
                      ) : (
                        <div className="space-y-2">
                          {userAccounts[user.id].map((acc) => (
                            <div key={acc.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                              <div
                                onClick={() => toggleAccount(acc.id)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition text-left cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-slate-400">
                                    {expandedAccount === acc.id ? (
                                      <ChevronDown size={14} />
                                    ) : (
                                      <ChevronRight size={14} />
                                    )}
                                  </span>
                                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    {acc.accountType}
                                  </span>
                                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">{acc.id}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-semibold text-slate-800 text-sm">
                                    ${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteAccountTarget({ id: acc.id, userId: user.id });
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Transactions for account */}
                              {expandedAccount === acc.id && (
                                <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Transaction history
                                  </p>
                                  {txLoading === acc.id && !accountTx[acc.id] ? (
                                    <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
                                  ) : !accountTx[acc.id] || accountTx[acc.id].length === 0 ? (
                                    <p className="text-slate-400 text-xs py-2">No transactions yet.</p>
                                  ) : (
                                    <div className="divide-y divide-slate-100">
                                      {accountTx[acc.id].map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between py-2">
                                          <div className="flex items-center gap-2">
                                            {tx.type === "DEPOSIT" ? (
                                              <ArrowDownCircle size={14} className="text-emerald-500" />
                                            ) : (
                                              <ArrowUpCircle size={14} className="text-red-500" />
                                            )}
                                            <span className="text-xs text-slate-600 capitalize">
                                              {tx.type.toLowerCase()}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                              {new Date(tx.timestamp).toLocaleString()}
                                            </span>
                                          </div>
                                          <span
                                            className={`text-xs font-semibold ${
                                              tx.type === "DEPOSIT" ? "text-emerald-600" : "text-red-500"
                                            }`}
                                          >
                                            {tx.type === "DEPOSIT" ? "+" : "-"}$
                                            {tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {deleteUserTarget && (
        <ConfirmDialog
          message="Are you sure you want to delete this user? This cannot be undone."
          onConfirm={handleDeleteUser}
          onCancel={() => setDeleteUserTarget(null)}
        />
      )}

      {deleteAccountTarget && (
        <ConfirmDialog
          message="Are you sure you want to delete this account? This cannot be undone."
          onConfirm={handleDeleteAccount}
          onCancel={() => setDeleteAccountTarget(null)}
        />
      )}
    </div>
  );
}
