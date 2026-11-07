import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Certificate } from '../types/certificate';
import { VerificationBadge } from '../components/VerificationBadge';
import { BOTCHAIN_CONFIG } from '../config/botchain';

interface VerifyPageProps {
  certificates: Certificate[];
  onNavigate: (tab: string, certId?: string) => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ certificates, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedCert, setMatchedCert] = useState<Certificate | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return;

    setHasSearched(true);
    const found = certificates.find((c) => {
      return (
        c.formattedId.toLowerCase() === cleanQuery ||
        c.id.toString() === cleanQuery ||
        c.contractAddress.toLowerCase() === cleanQuery ||
        c.metadataFingerprint.toLowerCase() === cleanQuery ||
        c.deploymentTxHash.toLowerCase() === cleanQuery ||
        c.projectName.toLowerCase() === cleanQuery
      );
    });

    setMatchedCert(found || null);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Botchain Testnet Registry Public Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Any Deployment Record
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Public verification is 100% free and requires no wallet connection. Check whether a deployment record exists on Botchain Testnet (Chain ID 968).
        </p>
      </div>

      {/* Verification Search Bar */}
      <form onSubmit={handleVerify} className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Certificate ID, Contract Address, or Metadata Fingerprint
          </label>
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. DP-001001, 0x38F24C589Ac41C8Eb38A18210355f32a76B9c6e5..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm font-mono text-white placeholder-slate-600 outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verify Record</span>
        </button>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
          <span className="text-slate-500">Try sample:</span>
          <button
            type="button"
            onClick={() => setQuery('DP-001001')}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-[11px]"
          >
            DP-001001 (BotPay)
          </button>
          <button
            type="button"
            onClick={() => setQuery('DP-001002')}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-[11px]"
          >
            DP-001002 (BotCard)
          </button>
        </div>
      </form>

      {/* Verification Result */}
      {hasSearched && (
        <div className="space-y-4">
          {matchedCert ? (
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-white">Record Verified On-Chain</h3>
                    <p className="text-xs text-slate-400">
                      Matches authentic record on Botchain Testnet (Chain ID 968).
                    </p>
                  </div>
                </div>

                <VerificationBadge isBytecodeVerified={matchedCert.isBytecodeVerified} size="md" />
              </div>

              {/* Matched Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Certificate ID</span>
                  <span className="text-emerald-400 font-bold">{matchedCert.formattedId}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Project / Contract</span>
                  <span className="text-white font-bold">{matchedCert.projectName} ({matchedCert.contractName})</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 sm:col-span-2 truncate">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Contract Address</span>
                  <span className="text-slate-300">{matchedCert.contractAddress}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 sm:col-span-2 truncate">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Metadata Fingerprint (keccak256)</span>
                  <span className="text-emerald-300">{matchedCert.metadataFingerprint}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigate('certificate', matchedCert.formattedId)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <span>Open Full Digital Certificate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Matching Record Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No deployment record matching your query was found in the Botchain registry. Check the ID, address, or register this deployment now.
              </p>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
              >
                Register this Contract
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

