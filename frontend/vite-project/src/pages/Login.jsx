import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { addNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      addNotification("Welcome back!", "success");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Invalid credentials. Please verify your email and password.";

      if (err.response?.status === 401) {
        errorMessage = "Identity verification failed. Please check your credentials.";
      } else if (err.request) {
        errorMessage = "Network error. The command center is currently unreachable.";
      }

      addNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        <div className="glass rounded-[2rem] shadow-2xl p-10 border border-white/20 dark:border-white/5">
          {/*Header */}
          <div className="text-center mb-10">

            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
              Project<span className="text-indigo-600">Manager</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Login in to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-indigo-500 transition-all outline-none text-sm dark:text-white"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-indigo-500 transition-all outline-none text-sm dark:text-white"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Decrypting...</span>
                </div>
              ) : (
                <>
                  Login
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
