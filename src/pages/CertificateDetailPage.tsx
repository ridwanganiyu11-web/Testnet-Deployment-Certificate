import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  Info, 
  Share2, 
  FileCode, 
  Calendar, 
  Layers,
  Cpu,
  Lock
} from 'lucide-react';
import { Certificate } from '../types/certificate';
import { CertificateCard } from '../components/CertificateCard';
import { VerificationBadge } from '../components/VerificationBadge';
import { BOTCHAIN_CONFIG } from '../config/botchain';

interface CertificateDetailPageProps {
  certificateId: string;
  certificates: Certificate[];
  onBack: () => void;
}

export const CertificateDetailPage: React.FC<CertificateDetailPageProps> = ({
  certificateId,
  certificates,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);

  // Find target certificate
  const cert = certificates.find(
    (c) => c.formattedId.toLowerCase() === certificateId.toLowerCase() || c.id.toString() === certificateId
  );

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!cert) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Certificate Not Found</h2>
        <p className="text-sm text-slate-400">
          No deployment certificate was found matching ID: <span className="font-mono text-emerald-400">{certificateId}</span>.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
        >
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Certificates</span>
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Verification URL'}</span>
          </button>
        </div>
      </div>

      {/* Public Attestation Disclaimer Banner (Requested in prompt) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-white">Public Attestation Record</p>
          <p className="text-slate-400 leading-relaxed">
            Registering a deployment certificate proves that a wallet submitted this deployment record to the Botchain blockchain. It does not independently prove that the contract is safe, audited, or currently active.
          </p>
        </div>
      </div>

      {/* The Digital Deployment Certificate Card */}
      <CertificateCard certificate={cert} isDownloadable={true} />

      {/* Detailed Technical Attestation Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Cryptographic Record Verification</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-sans uppercase tracking-wider text-[10px] block">
              Network & Chain ID
            </span>
            <span className="text-slate-200 font-semibold">Botchain Testnet (Chain ID 968)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-sans uppercase tracking-wider text-[10px] block">
              Bytecode Verification Status
            </span>
            <span className={cert.isBytecodeVerified ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {cert.isBytecodeVerified ? 'Verified Bytecode on BohrScan' : 'Self-Reported Deployment Record'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-sans uppercase tracking-wider text-[10px] block">
              Compiler / Framework
            </span>
            <span className="text-slate-200">{cert.compiler || 'Solidity 0.8.20'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-sans uppercase tracking-wider text-[10px] block">
              Source License
            </span>
            <span className="text-slate-200">{cert.license || 'MIT'}</span>
          </div>

          {cert.repositoryUrl && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 md:col-span-2">
              <span className="text-slate-500 font-sans uppercase tracking-wider text-[10px] block">
                Repository
              </span>
              <a 
                href={cert.repositoryUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1.5 break-all"
              >
                <span>{cert.repositoryUrl}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

