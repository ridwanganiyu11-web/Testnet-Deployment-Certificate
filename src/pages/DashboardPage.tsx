import React from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  ExternalLink, 
  Layers, 
  Award, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileCode
} from 'lucide-react';
import { Certificate } from '../types/certificate';
import { BOTCHAIN_CONFIG } from '../config/botchain';
import { VerificationBadge } from '../components/VerificationBadge';

interface DashboardPageProps {
  certificates: Certificate[];
  onNavigate: (tab: string, certId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ certificates, onNavigate }) => {
  // Aggregate stats
  const totalDeployments = certificates.length;
  const uniqueProjects = new Set(certificates.map((c) => c.projectName.toLowerCase())).size;
  const verifiedCount = certificates.filter((c) => c.isBytecodeVerified).length;

  return (
    <div className="space-y-8 py-6">
      
      {/* Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Overview
            </span>
            <span className="text-xs text-slate-400">Botchain Testnet (968)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            DeployProof Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time tracking of registered smart contract deployments and public attestation certificates.
          </p>
        </div>

        <button
          onClick={() => onNavigate('register')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Deployment</span>
        </button>
      </div>

      {/* Metrics Row (Matching prompt specification) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Deployments</span>
            <FileCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {totalDeployments}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> All recorded on-chain
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {uniqueProjects}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Active developer suites
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Networks</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            1
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Botchain Testnet (968)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Certificates</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {totalDeployments}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">
            {verifiedCount} Verified Bytecode
          </p>
        </div>
      </div>

      {/* Recent Deployments Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Deployments</h2>
            <p className="text-xs text-slate-400">
              Illustrative dashboard with registered records on Botchain Testnet.
            </p>
          </div>
          <button
            onClick={() => onNavigate('certificates')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {certificates.slice(0, 5).map((cert) => (
            <div
              key={cert.id}
              onClick={() => onNavigate('certificate', cert.formattedId)}
              className="p-5 hover:bg-slate-850/60 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {cert.projectName}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Registered
                  </span>
                  <VerificationBadge isBytecodeVerified={cert.isBytecodeVerified} size="sm" />
                </div>
                
                <p className="text-xs text-slate-400 font-mono">
                  {cert.contractName} · Botchain Testnet (968)
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                  <span>Contract: <strong className="text-slate-300">{cert.contractAddress.slice(0, 10)}...{cert.contractAddress.slice(-6)}</strong></span>
                  <span>Version: <strong className="text-slate-300">{cert.version}</strong></span>
                  <span>ID: <strong className="text-emerald-400">{cert.formattedId}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  View Certificate <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

