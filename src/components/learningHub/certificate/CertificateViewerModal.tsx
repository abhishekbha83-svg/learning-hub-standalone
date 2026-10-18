import React, { useState } from 'react';
import { CourseCertificate } from '../../../types/certificate';
import { certificateService } from '../../../services/certificateService';
import { CertificateDocument } from './CertificateDocument';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Share2,
  Sparkles
} from 'lucide-react';

interface CertificateViewerModalProps {
  certificate: CourseCertificate | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenVerify: (certId: string) => void;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onOpenVerify
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    certificateService.downloadAsImage(certificate);
  };

  const handleCopy = async () => {
    try {
      const url = certificate.verificationUrl || `${window.location.origin}/#/verify-certificate?id=${certificate.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Top Modal Navigation Bar (Hidden during print) */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-3 mb-4 sm:mb-6 print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
              {certificate.title}
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              ID: {certificate.id} • {certificate.studentName}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download 300 DPI High-Resolution PNG"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Download PNG</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Copy Verification Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onOpenVerify(certificate.id)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-400 hover:text-emerald-300 border border-white/10 transition-colors cursor-pointer"
            title="Verify Authenticity"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            title="Close Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Certificate Document Preview Container */}
      <div className="w-full max-w-5xl my-auto">
        <CertificateDocument certificate={certificate} />
      </div>

      {/* Bottom Verification & Metadata Banner (Hidden during print) */}
      <div className="w-full max-w-5xl mt-4 sm:mt-6 p-4 rounded-2xl bg-[#141418] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 print:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Digital Authenticity Hash:{' '}
            <span className="font-mono text-slate-200 font-bold">{certificate.verificationCode}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>Format: Standard A4 Landscape</span>
          <span>Verified by ABHYVEXA Credential Registry</span>
          <button
            onClick={() => onOpenVerify(certificate.id)}
            className="text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>Public Verification Portal</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
