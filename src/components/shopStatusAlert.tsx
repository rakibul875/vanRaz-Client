import React, { useState } from 'react';

import { 
  AlertCircle, 
  Send, 
  CheckCircle, 
  RefreshCw, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShopStatus } from '../../types';
import { STATUS_META } from '@/data/mockdata';
import { ShopStatusBadge } from './shopStatusBadge';

interface ShopStatusAlertProps {
  currentStatus: ShopStatus;
  statusReason?: string;
  onStatusChange: (newStatus: ShopStatus) => void;
  onEditShop?: () => void;
}

const ALL_STATUSES: ShopStatus[] = ['Draft', 'Pending', 'Approved', 'Active', 'Rejected', 'Suspended'];

export const ShopStatusAlert: React.FC<ShopStatusAlertProps> = ({
  currentStatus,
  statusReason,
  onStatusChange,
  onEditShop,
}) => {
  const [showSimulator, setShowSimulator] = useState(false);
  const meta = STATUS_META[currentStatus] || STATUS_META.Draft;

  return (
    <div
      id="shop-status-alert-container"
      className={`rounded-2xl border ${meta.borderClass} ${meta.bgClass} p-5 shadow-xs transition-all duration-300`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5">
            <ShopStatusBadge status={currentStatus} size="lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-semibold ${meta.textClass}`}>
                {currentStatus === 'Active' ? 'Shop is Live and Public' : `Shop Status: ${meta.label}`}
              </h3>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {meta.description}
            </p>
            {statusReason && (
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 italic">
                <Info size={13} />
                <span>Note: {statusReason}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action buttons depending on status */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {currentStatus === 'Draft' && (
            <button
              id="submit-for-review-btn"
              onClick={() => onStatusChange('Pending')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
            >
              <Send size={15} />
              Submit for Review
            </button>
          )}

          {currentStatus === 'Pending' && (
            <div className="flex items-center gap-2">
              <button
                id="simulate-approve-btn"
                onClick={() => onStatusChange('Approved')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <CheckCircle size={14} />
                Simulate Admin Approve
              </button>
              <button
                id="simulate-reject-btn"
                onClick={() => onStatusChange('Rejected')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                Simulate Reject
              </button>
            </div>
          )}

          {currentStatus === 'Approved' && (
            <button
              id="activate-shop-btn"
              onClick={() => onStatusChange('Active')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
            >
              <Sparkles size={15} />
              Launch & Make Active
            </button>
          )}

          {currentStatus === 'Rejected' && (
            <button
              id="fix-and-resubmit-btn"
              onClick={() => {
                if (onEditShop) onEditShop();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
            >
              <RefreshCw size={14} />
              Edit & Resubmit Application
            </button>
          )}

          {currentStatus === 'Suspended' && (
            <button
              id="appeal-suspension-btn"
              onClick={() => onStatusChange('Pending')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
            >
              <Send size={14} />
              Submit Appeal
            </button>
          )}

          {currentStatus === 'Active' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-teal-700 bg-teal-100/60 px-3 py-1.5 rounded-lg font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Storefront Online
            </span>
          )}

          {/* Quick status testing menu toggle */}
          <button
            id="toggle-status-simulator-btn"
            onClick={() => setShowSimulator(!showSimulator)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-2xs transition-colors"
            title="Toggle status tester to preview all 6 states"
          >
            <span>Status Tester</span>
            <ChevronDown size={14} className={`transform transition-transform ${showSimulator ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Simulator dropdown drawer */}
      <AnimatePresence>
        {showSimulator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-200/80">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Testing Mode — Preview All 6 Shop Statuses:
                </span>
                <span className="text-xs text-slate-500">
                  Click any status below to immediately test the UI & dashboard in that state
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {ALL_STATUSES.map((status) => {
                  const isCurrent = currentStatus === status;
                  return (
                    <button
                      key={status}
                      id={`test-status-${status.toLowerCase()}`}
                      onClick={() => onStatusChange(status)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <ShopStatusBadge status={status} size="sm" />
                      <span className="text-[11px] text-slate-400 mt-1">
                        {isCurrent ? '● Active View' : 'Switch'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
