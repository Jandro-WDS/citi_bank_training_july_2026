import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Smartphone, TrendingUp, ArrowRight, Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 size={17} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Horizon Bank</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#security" className="hover:text-slate-900 transition">Security</a>
            <a href="#about" className="hover:text-slate-900 transition">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 transition"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
            >
              Open an account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.25),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-6">
              Trusted by over 2 million members
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Banking that moves as fast as you do.
            </h1>
            <p className="text-lg text-slate-300 mt-6 max-w-xl">
              Open accounts, move money, and track every transaction in real time — all
              in one secure, beautifully simple platform built for modern life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
              >
                Get started free
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 border border-slate-700 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/5 transition"
              >
                Sign in to your account
              </Link>
            </div>
          </div>

          {/* Mock account card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-7 shadow-2xl shadow-indigo-950/50 max-w-sm ml-auto">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Total balance</p>
              <p className="text-white text-4xl font-bold mt-2">$48,204.19</p>
              <div className="flex items-center gap-2 mt-3">
                <TrendingUp size={14} className="text-emerald-300" />
                <span className="text-emerald-300 text-xs font-semibold">+2.4% this month</span>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                  <span className="text-white text-sm font-medium">Checking</span>
                  <span className="text-white text-sm font-semibold">$12,940.00</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                  <span className="text-white text-sm font-medium">Savings</span>
                  <span className="text-white text-sm font-semibold">$35,264.19</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Everything you need, nothing you don't
            </h2>
            <p className="text-slate-500 mt-4 text-lg">
              A modern account built around simplicity, speed, and total transparency.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Bank-grade security",
                desc: "Your funds and data are protected with encryption and continuous monitoring.",
              },
              {
                icon: Zap,
                title: "Instant transfers",
                desc: "Move money between your accounts instantly, any time of day.",
              },
              {
                icon: Smartphone,
                title: "Manage anywhere",
                desc: "A fully responsive experience that works beautifully on any device.",
              },
              {
                icon: TrendingUp,
                title: "Grow your savings",
                desc: "Competitive interest rates that help your balance grow automatically.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / stats band */}
      <section id="security" className="bg-slate-950 py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["2M+", "Members"],
            ["$4.8B", "Managed assets"],
            ["99.99%", "Platform uptime"],
            ["24/7", "Fraud monitoring"],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="text-3xl sm:text-4xl font-bold text-white">{stat}</p>
              <p className="text-slate-400 text-sm mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">
            Modern banking, built on trust.
          </h2>
          <p className="text-lg text-slate-500 mb-10">
            Horizon Bank combines rigorous security with an effortless digital
            experience — so you can focus on your money, not your banking app.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Open your account today
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} Horizon Bank. All rights reserved.</span>
          <span>Member FDIC · Equal Housing Lender</span>
        </div>
      </footer>
    </div>
  );
}