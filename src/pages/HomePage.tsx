import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileCode2, 
  ExternalLink, 
  Zap, 
  Award, 
  Layers, 
  Globe2, 
  Lock,
  Cpu
} from 'lucide-react';
import { Certificate } from '../types/certificate';
import { BOTCHAIN_CONFIG } from '../config/botchain';
import { VerificationBadge } from '../components/VerificationBadge';

interface HomePageProps {
  recentCertificates: Certificate[];
  onNavigate: (tab: string, certId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ recentCertificates, onNavigate }) => {
  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Web3 Developer Portfolio on Botchain Testnet (968)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Deploy It. Register It. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Prove It.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            DeployProof allows Web3 developers to register smart contract deployments on the <strong>Botchain blockchain</strong> and generate tamper-proof, publicly verifiable digital deployment certificates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
            >
              <span>Register Deployment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('verify')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verify Any Certificate</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 mt-10">
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-emerald-400">12+</div>
              <div className="text-xs text-slate-400">Deployments</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-teal-400">5</div>
              <div className="text-xs text-slate-400">Active Projects</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-cyan-400">968</div>
              <div className="text-xs text-slate-400">Botchain Chain ID</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Free Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How DeployProof Works
          </h2>
          <p className="text-sm text-slate-400">
            Turn your smart contract deployment into a verifiable credential in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="font-semibold text-white text-base mb-2">Deploy Contract</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compile and deploy your contract (e.g., BotPay.sol) to Botchain Testnet using Hardhat, Foundry, or Remix.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="font-semibold text-white text-base mb-2">Auto-Verify (Option C)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your contract address & tx hash. DeployProof queries Botchain RPC to confirm bytecode and prefill details.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="font-semibold text-white text-base mb-2">Record On-Chain</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit your deployment record through your wallet. A deterministic keccak256 fingerprint is permanently sealed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono flex items-center justify-center mb-4">
              04
            </div>
            <h3 className="font-semibold text-white text-base mb-2">Share & Prove</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download high-res PNG/PDF certificates, attach QR codes to your GitHub README, and share public verification links.
            </p>
          </div>

        </div>
      </section>

      {/* Recent Deployments Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recent Deployments on Botchain
            </h2>
            <p className="text-xs text-slate-400">
              Live deployment certificates registered across Botchain Testnet (Chain ID 968).
            </p>
          </div>
          <button
            onClick={() => onNavigate('certificates')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 self-start"
          >
            <span>View All Certificates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentCertificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => onNavigate('certificate', cert.formattedId)}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-emerald-400">
                    {cert.formattedId}
                  </span>
                  <VerificationBadge isBytecodeVerified={cert.isBytecodeVerified} size="sm" />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {cert.projectName}
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-4">
                  {cert.contractName} · {cert.version}
                </p>

                <div className="space-y-1.5 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                  <div className="truncate">
                    <span className="text-slate-500">Contract: </span>
                    <span className="text-slate-300">{cert.contractAddress.slice(0, 10)}...{cert.contractAddress.slice(-6)}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">Deployer: </span>
                    <span className="text-slate-300">{cert.deployer.slice(0, 10)}...{cert.deployer.slice(-6)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Botchain Testnet</span>
                <span className="text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Inspect <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Network Callout Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Botchain Testnet (Chain ID 968)</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            RPC: <code className="text-emerald-400">{BOTCHAIN_CONFIG.rpcUrl}</code> | Explorer: <a href={BOTCHAIN_CONFIG.explorerUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">scan.bohr.life</a> | Gas Token: BOT (150M Total Supply).
          </p>
        </div>
        <button
          onClick={() => onNavigate('register')}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-lg shadow-emerald-950 transition-colors"
        >
          Create Deployment Certificate
        </button>
      </section>

    </div>
  );
};

