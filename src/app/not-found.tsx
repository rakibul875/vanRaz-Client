"use client";

import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden font-sans px-4">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Brand Header */}
        <div className="mb-6">
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">
            ven<span className="text-indigo-500">Raz</span>
          </span>
        </div>

        {/* Big 404 Text with Gradient */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-600 drop-shadow-sm select-none">
          404
        </h1>

        {/* Message */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-4 text-slate-200">
          Page not found
        </h2>
        <p className="text-sm text-slate-400 mt-2 mb-8 leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved to
          another URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/25 active:scale-[0.98] text-center"
          >
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex-1 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition-all duration-200 active:scale-[0.98] text-center"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Subtle Background Decorative Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
    </div>
  );
};

export default NotFoundPage;
