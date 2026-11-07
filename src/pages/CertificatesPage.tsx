import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  FileCode,
  Calendar,
  Layers
} from 'lucide-react';
import { Certificate } from '../types/certificate';
import { VerificationBadge } from '../components/VerificationBadge';
import { BOTCHAIN_CONFIG } from '../config/botchain';

interface CertificatesPageProps {
  certificates: Certificate[];
  onNavigate: (tab: string, certId?: string) => void;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ certificates, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');

  const filtered = certificates.filter((cert) => {
    const matchesSearch = 
      cert.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.contractAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.formattedId.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterVerified === 'verified') return matchesSearch && cert.isBytecodeVerified;
    if (filterVerified === 'unverified') return matchesSearch && !cert.isBytecodeVerified;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 py-6">
      
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Developer Deployment Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publicly verifiable deployment records and credentials generated on Botchain Testnet (Chain ID 968).
          </p>
        </div>

        <button
          onClick={() => onNavigate('register')}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors self-start"
        >
          + New Certificate
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Project name, Contract, Address, or Certificate ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilterVerified('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterVerified === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({certificates.length})
          </button>
          <button
            onClick={() => setFilterVerified('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterVerified === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Verified Bytecode
          </button>
        </div>
      </div>

      {/* Certificates Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Award className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No certificates found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or register a new contract deployment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <div
              key={cert.id}
              onClick={() => onNavigate('certificate', cert.formattedId)}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {cert.formattedId}
                  </span>
                  <VerificationBadge isBytecodeVerified={cert.isBytecodeVerified} size="sm" />
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {cert.projectName}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  {cert.contractName} · {cert.version}
                </p>

                {cert.description && (
                  <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                    {cert.description}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs font-mono text-slate-400">
                  <div className="truncate">
                    <span className="text-slate-500">Contract: </span>
                    <span className="text-slate-300">{cert.contractAddress.slice(0, 10)}...{cert.contractAddress.slice(-6)}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">Deployer: </span>
                    <span className="text-slate-300">{cert.deployer.slice(0, 10)}...{cert.deployer.slice(-6)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Recorded: </span>
                    <span className="text-slate-300">
                      {new Date(cert.timestamp * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Chain ID 968</span>
                <span className="text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Certificate <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

