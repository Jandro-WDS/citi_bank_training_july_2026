import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAccountsByUserId,
  createAccount,
  deleteAccount,
  deposit,
  withdraw,
  transfer,
  getTransactions,
} from "../../api/accountServices";
import { getUser } from "../../api/userServices";
import { useAuth } from "../../context/AuthContext";
import type { Account, Transaction, User } from "../../types";
import TopBar from "../../components/TopBar";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  Plus,
  X,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  DollarSign,
  CreditCard,
  ChevronLeft,
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

type Tab = "deposit" | "withdraw" | "transfer";

export default function UserDashboard() {
  const { userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAccountType, setNewAccountType] = useState<"SAVINGS" | "CHECKING">("SAVINGS");
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Selected account detail panel
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("deposit");
  const [amount, setAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAccounts = async () => {
    if (!userId) return;
    try {
      const data = await getAccountsByUserId(userId);
      setAccounts(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load accounts."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    getUser(userId)
      .then(setUser)
      .catch(() => {});
    fetchAccounts();
  }, [userId]);

  const fetchTransactions = async (accountId: string) => {
    setTxLoading(true);
    try {
      const data = await getTransactions(accountId);
      const sorted = [...data].sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setTransactions(sorted);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load transactions."));
    } finally {
      setTxLoading(false);
    }
  };

  const openAccount = (accountId: string) => {
    setSelectedId(accountId);
    setActiveTab("deposit");
    setAmount("");
    setTransferTo("");
    setFormError(null);
    fetchTransactions(accountId);
  };

  const closeAccount = () => {
    setSelectedId(null);
    setTransactions([]);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setCreateLoading(true);
    try {
      await createAccount({ userId, accountType: newAccountType });
      toast.success("Account opened successfully.");
      setShowCreateForm(false);
      await fetchAccounts();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to open account."));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAccount(deleteTarget);
      setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget));
      if (selectedId === deleteTarget) closeAccount();
      toast.success("Account closed.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to close account."));
    } finally {
      setDeleteTarget(null);
    }
  };

  const refreshSelected = async () => {
    await fetchAccounts();
    if (selectedId) await fetchTransactions(selectedId);
  };

  const selectedAccount = accounts.find((a) => a.id === selectedId) ?? null;

  const validate = (): number | false => {
    const val = parseFloat(amount);
    if (!amount.trim() || isNaN(val) || val <= 0) {
      setFormError("Enter a valid positive amount.");
      return false;
    }
    if (activeTab === "transfer") {
      if (!transferTo) {
        setFormError("Select a destination account.");
        return false;
      }
      if (transferTo === selectedId) {
        setFormError("Cannot transfer to the same account.");
        return false;
      }
    }
    if ((activeTab === "withdraw" || activeTab === "transfer") && selectedAccount && val > selectedAccount.balance) {
      setFormError("Amount exceeds available balance.");
      return false;
    }
    setFormError(null);
    return val;
  };

  const handleSubmitTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    const val = validate();
    if (val === false) return;

    setSubmitting(true);
    try {
      if (activeTab === "deposit") {
        await deposit(selectedId, val);
        toast.success(`Deposited $${val.toFixed(2)}.`);
      } else if (activeTab === "withdraw") {
        await withdraw(selectedId, val);
        toast.success(`Withdrew $${val.toFixed(2)}.`);
      } else {
        await transfer(selectedId, transferTo, val);
        toast.success(`Transferred $${val.toFixed(2)}.`);
      }
      setAmount("");
      setTransferTo("");
      await refreshSelected();
    } catch (err) {
      toast.error(getErrorMessage(err, "Transaction failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar title="Horizon Bank" subtitle={user ? user.name : "My accounts"} />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {!selectedId ? (
          <>
            {/* Overview */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""} 👋
              </h1>
              <p className="text-slate-500 text-sm mt-1">Here's your financial overview</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <DollarSign size={22} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total balance</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <CreditCard size={22} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Accounts</p>
                  <p className="text-2xl font-bold text-slate-900">{accounts.length}</p>
                </div>
              </div>
            </div>

            {/* Accounts header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 text-lg">My accounts</h2>
              <button
                onClick={() => setShowCreateForm((v) => !v)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
              >
                <Plus size={16} />
                New account
              </button>
            </div>

            {showCreateForm && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Open a new account</h3>
                  <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleCreateAccount} className="flex items-end gap-4">
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
                    disabled={createLoading}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {createLoading ? "Opening..." : "Open account"}
                  </button>
                </form>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-36 bg-white rounded-2xl animate-pulse border border-slate-100" />
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <p className="text-slate-400 text-sm">You don't have any accounts yet.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4 text-sm text-indigo-600 hover:underline font-medium"
                >
                  Open your first account →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => openAccount(acc.id)}
                    className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white cursor-pointer hover:opacity-95 hover:-translate-y-0.5 transition-all duration-300 relative group"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(acc.id);
                      }}
                      className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-red-500/80 rounded-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">
                      {acc.accountType}
                    </span>
                    <p className="text-3xl font-bold mt-5">
                      ${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      Interest rate: {(acc.interestRate * 100).toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Account detail single-page panel */
          <div>
            <button
              onClick={closeAccount}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition"
            >
              <ChevronLeft size={16} />
              Back to accounts
            </button>

            {selectedAccount && (
              <>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white mb-6 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">
                      {selectedAccount.accountType}
                    </span>
                    <p className="text-4xl font-bold mt-4">
                      ${selectedAccount.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      Interest rate: {(selectedAccount.interestRate * 100).toFixed(2)}%
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(selectedAccount.id)}
                    className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-red-500/80 px-3 py-1.5 rounded-xl transition"
                  >
                    <Trash2 size={13} />
                    Close account
                  </button>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
                  <div className="flex gap-2 mb-5 border-b border-slate-100">
                    {([
                      ["deposit", "Deposit", ArrowDownCircle],
                      ["withdraw", "Withdraw", ArrowUpCircle],
                      ["transfer", "Transfer", ArrowRightLeft],
                    ] as [Tab, string, typeof ArrowDownCircle][]).map(([tab, label, Icon]) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setFormError(null);
                          setAmount("");
                          setTransferTo("");
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                          activeTab === tab
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmitTx} className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-1 w-full">
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Amount ($)</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setFormError(null);
                        }}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        placeholder="0.00"
                      />
                    </div>

                    {activeTab === "transfer" && (
                      <div className="flex-1 w-full">
                        <label className="text-xs font-medium text-slate-600 mb-1 block">To account</label>
                        <select
                          value={transferTo}
                          onChange={(e) => {
                            setTransferTo(e.target.value);
                            setFormError(null);
                          }}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                        >
                          <option value="">Select account</option>
                          {accounts
                            .filter((a) => a.id !== selectedId)
                            .map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.accountType} — ${a.balance.toFixed(2)}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50 self-end ${
                        activeTab === "deposit"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : activeTab === "withdraw"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {submitting
                        ? "Processing..."
                        : activeTab === "deposit"
                        ? "Deposit"
                        : activeTab === "withdraw"
                        ? "Withdraw"
                        : "Transfer"}
                    </button>
                  </form>
                  {formError && <p className="text-red-500 text-xs mt-2">{formError}</p>}
                </div>

                {/* Transaction history */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="font-semibold text-slate-800 mb-4">Transaction history</h2>
                  {txLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : transactions.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">No transactions yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between py-3.5">
                          <div className="flex items-center gap-3">
                            {tx.type === "DEPOSIT" ? (
                              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <ArrowDownCircle size={18} className="text-emerald-500" />
                              </div>
                            ) : (
                              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                                <ArrowUpCircle size={18} className="text-red-500" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-slate-800 capitalize">
                                {tx.type.toLowerCase()}
                              </p>
                              <p className="text-xs text-slate-400">
                                {new Date(tx.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`font-semibold text-sm ${
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
              </>
            )}
          </div>
        )}
      </main>

      {deleteTarget && (
        <ConfirmDialog
          message="Are you sure you want to close this account? This cannot be undone."
          onConfirm={handleDeleteAccount}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
