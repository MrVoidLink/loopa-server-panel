import React from "react";

function LoginForm() {
  return (
    <form className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <input
        type="email"
        placeholder="Email"
        className="px-4 py-2 bg-[#111827]/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 
                   focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-200"
      />
      <input
        type="password"
        placeholder="Password"
        className="px-4 py-2 bg-[#111827]/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 
                   focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-200"
      />
      <button
        type="submit"
        className="mt-2 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg shadow-md 
                   shadow-emerald-500/30 hover:shadow-emerald-400/40 transition-all duration-200"
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
