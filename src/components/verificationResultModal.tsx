"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  X,
  AlertTriangle,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { VerificationResult } from "@/services/shopVerification";

interface VerificationResultModalProps {
  result: VerificationResult | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onEdit: () => void;
}

const STATUS_CONFIG = {
  approved: {
    icon: ShieldCheck,
    label: "Approved",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-500/20",
  },
  needs_review: {
    icon: ShieldAlert,
    label: "Needs Review",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-500/20",
  },
  rejected: {
    icon: ShieldX,
    label: "Rejected",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    ring: "ring-rose-500/20",
  },
} as const;

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "#059669"
      : score >= 50
        ? "#d97706"
        : "#dc2626";

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-900">{score}</span>
      </div>
    </div>
  );
}

export default function VerificationResultModal({
  result,
  isOpen,
  onClose,
  onAccept,
  onEdit,
}: VerificationResultModalProps) {
  if (!isOpen || !result) return null;

  const config = STATUS_CONFIG[result.status];
  const StatusIcon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 ${config.bg} border-b ${config.border}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${config.bg} ring-1 ${config.ring}`}>
                  <StatusIcon size={22} className={config.color} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Verification Result
                  </h3>
                  <p className={`text-xs font-semibold ${config.color}`}>
                    {config.label}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Trust Score */}
              <div className="flex items-center gap-5">
                <ScoreRing score={result.trustScore} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Trust Score
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {result.feedback.reason}
                  </p>
                </div>
              </div>

              {/* Issues */}
              {result.feedback.issuesFound.length > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={13} />
                    Issues Found
                  </p>
                  <ul className="space-y-1.5">
                    {result.feedback.issuesFound.map((issue, i) => (
                      <li
                        key={i}
                        className="text-xs text-rose-600 flex items-start gap-2"
                      >
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Enhanced Data Preview */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Enhanced Data
                </p>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 mb-0.5">
                    Shop Name
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {result.enhancedData.shopName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 mb-0.5">
                    Optimized Description
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {result.enhancedData.description}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 mb-1">
                    SEO Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.enhancedData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-semibold border border-indigo-100"
                      >
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              {result.status === "rejected" ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onEdit}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
                  >
                    Edit & Resubmit
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onEdit}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={onAccept}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                  >
                    <CheckCircle2 size={14} />
                    {result.status === "approved"
                      ? "Accept & Submit"
                      : "Submit for Review"}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
