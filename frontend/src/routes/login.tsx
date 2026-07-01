import { SiteLayout } from "@/components/SiteLayout";
import { Link } from "react-router-dom";

export function Login() {
  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8 text-center sm:p-12">
          <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-navy-light">
            Sign in to manage your orders and safety subscriptions.
          </p>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-lg border border-border px-3 py-3 text-navy placeholder-navy-light focus:border-pink focus:outline-none focus:ring-1 focus:ring-pink sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-lg border border-border px-3 py-3 text-navy placeholder-navy-light focus:border-pink focus:outline-none focus:ring-1 focus:ring-pink sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-pink focus:ring-pink"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-navy-light">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-pink hover:text-navy transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn-pink flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-sm text-navy-light">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-pink hover:text-navy transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
