import { API_URL } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Is the backend running?");
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-border/60 bg-white p-8 text-center shadow-lg">
          <h1 className="font-display text-3xl font-bold text-navy">Admin Portal</h1>
          <p className="mt-2 text-sm text-navy/70">Sign in to manage products.</p>
          
          {error && <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border p-3 text-sm focus:border-pink focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border p-3 text-sm focus:border-pink focus:outline-none"
            />
            <button type="submit" className="btn-pink w-full rounded-lg py-3 font-semibold">
              Secure Login
            </button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
