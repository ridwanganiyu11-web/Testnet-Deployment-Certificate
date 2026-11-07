import React from 'react';
import { ShieldCheck, ExternalLink, Cpu, HardDrive, Layers } from 'lucide-react';
import { BOTCHAIN_CONFIG } from '../config/botchain';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white">DeployProof</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              <strong>Deploy It. Register It. Prove It.</strong><br />
              DeployProof is a Web3 developer tool to register smart contract deployments on Botchain Testnet and generate publicly verifiable digital certificates with zero barriers to entry.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Chain ID: <strong className="text-slate-300 font-mono">968</strong></span>
              <span>•</span>
              <span>Gas Token: <strong className="text-emerald-400 font-mono">BOT</strong></span>
              <span>•</span>
              <span>Total Supply: <strong className="text-slate-300 font-mono">150M BOT</strong></span>
            </div>
          </div>

          {/* Botchain Network Specs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Network Specs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>Network: <span className="text-slate-200">Botchain Testnet</span></li>
              <li>Chain ID: <span className="text-emerald-400">968</span></li>
              <li>Symbol: <span className="text-emerald-400">BOT</span></li>
              <li>
                RPC:{' '}
                <a 
                  href={BOTCHAIN_CONFIG.rpcUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-slate-300 hover:text-emerald-400 underline truncate block max-w-[200px]"
                >
                  {BOTCHAIN_CONFIG.rpcUrl}
                </a>
              </li>
              <li>
                Explorer:{' '}
                <a 
                  href={BOTCHAIN_CONFIG.explorerUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  BohrScan <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Verification
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Public verification without wallet</li>
              <li>• Bytecode presence check (Option C)</li>
              <li>• Keccak-256 fingerprint validation</li>
              <li>• Instant PNG & PDF certificate export</li>
              <li>• Tamper-proof QR Code verification</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DeployProof. Built for Web3 Developers on Botchain Testnet.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px] text-slate-600">
            Smart Contract: DeploymentCertificateRegistry.sol
          </p>
        </div>
      </div>
    </footer>
  );
};

