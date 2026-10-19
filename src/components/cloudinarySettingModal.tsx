
import React, { useState, useEffect } from 'react';
import { getCloudinaryConfig, saveCloudinaryConfig } from '../services/cloudinary';

import { 
  Cloud, 
  X, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  KeyRound, 
  ShieldCheck,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CloudinaryConfig } from '../../types';

interface CloudinarySettingsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfigUpdated?: (config: CloudinaryConfig) => void;
}

export const CloudinarySettingsModal: React.FC<CloudinarySettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [config, setConfig] = useState<CloudinaryConfig>({
    cloudName: '',
    uploadPreset: '',
    apiKey: '',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const current = getCloudinaryConfig();
        setConfig(current);
        setSavedSuccess(false);
        setTestStatus('idle');
        setTestMessage('');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudinaryConfig(config);
    setSavedSuccess(true);
    if (onConfigUpdated) onConfigUpdated(config);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const handleApplyQuickDemoPreset = () => {
    // Fill in standard demo placeholder preset for testing
    const demo = {
      cloudName: 'demo',
      uploadPreset: 'sample_preset',
      apiKey: '',
    };
    setConfig(demo);
    saveCloudinaryConfig(demo);
    if (onConfigUpdated) onConfigUpdated(demo);
    setSavedSuccess(true);
  };

  return (
    <div
      id="cloudinary-settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="cloudinary-settings-modal-card"
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <Cloud size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cloudinary Configuration</h3>
              <p className="text-xs text-slate-500">Unsigned direct upload for Shop Logo & Banner</p>
            </div>
          </div>
          <button
            id="close-cloudinary-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div className="rounded-xl bg-sky-50/70 border border-sky-200/60 p-3.5 text-xs text-sky-900 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-sky-950">
              <ShieldCheck size={16} className="text-sky-600" />
              <span>Direct Unsigned Upload Setup</span>
            </div>
            <p className="text-sky-800">
              To upload images directly to your Cloudinary media library, provide your <strong>Cloud Name</strong> and an <strong>Unsigned Upload Preset</strong> from your Cloudinary Console (Settings &gt; Upload &gt; Upload presets &gt; Mode: Unsigned).
            </p>
            <p className="text-slate-500 text-[11px] pt-1">
              <em>Note: If left empty, local high-resolution preview fallback and preset galleries work immediately without errors!</em>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cloudinary Cloud Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="cloudinary-cloud-name-input"
              type="text"
              placeholder="e.g., dxyzn8q2a"
              value={config.cloudName}
              onChange={(e) => setConfig({ ...config, cloudName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Preset Name (Unsigned) <span className="text-rose-500">*</span>
            </label>
            <input
              id="cloudinary-preset-input"
              type="text"
              placeholder="e.g., shop_uploads or ml_default"
              value={config.uploadPreset}
              onChange={(e) => setConfig({ ...config, uploadPreset: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono text-slate-800"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Must be configured as an <strong>Unsigned</strong> preset in your Cloudinary console.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              API Key <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="cloudinary-api-key-input"
              type="text"
              placeholder="Optional numeric API key"
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono text-slate-800"
            />
          </div>

          {savedSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Cloudinary configuration saved successfully!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              id="quick-demo-preset-btn"
              onClick={handleApplyQuickDemoPreset}
              className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-800 font-medium px-2 py-1"
            >
              <Sparkles size={14} />
              Use Sample Config
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="cancel-cloudinary-settings-btn"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                id="save-cloudinary-settings-btn"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
              >
                <Check size={14} />
                Save Settings
              </button>
            </div>
          </div>
        </form>

        {/* Footer helpful link */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Need help setting up unsigned presets?</span>
          <a
            href="https://cloudinary.com/documentation/upload_images#unsigned_upload"
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 font-medium"
          >
            <span>Cloudinary Docs</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
