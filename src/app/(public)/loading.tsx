import React from "react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center z-10">
        {/* Animated Brand Symbol/Spinner */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />

          {/* Inner Counter-Rotating Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-violet-500/20 border-b-violet-500 animate-[spin_1.5s_linear_infinite_reverse]" />

          {/* Center Pulsing Brand Icon */}
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            vR
          </span>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-extrabold tracking-wider text-white uppercase mb-2">
          ven<span className="text-indigo-500">Raz</span>
        </h1>

        {/* Dynamic Loading Text & Dots */}
        <div className="flex items-center space-x-1 text-slate-400 text-sm font-medium tracking-widest uppercase">
          <span>Loading</span>
          <span className="inline-flex space-x-0.5">
            <span className="animate-[bounce_1s_infinite_100ms]">.</span>
            <span className="animate-[bounce_1s_infinite_200ms]">.</span>
            <span className="animate-[bounce_1s_infinite_300ms]">.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
