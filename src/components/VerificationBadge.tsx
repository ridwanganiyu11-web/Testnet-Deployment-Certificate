import React from 'react';
import { CheckCircle2, AlertTriangle, Shield, Check } from 'lucide-react';

interface VerificationBadgeProps {
  isBytecodeVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  isBytecodeVerified,
  size = 'md' 
}) => {
  if (isBytecodeVerified) {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide border shadow-sm ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' :
        size === 'lg' ? 'px-3.5 py-1.5 text-sm' :
        'px-2.5 py-1 text-xs'
      } bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-950/50`}>
        <CheckCircle2 className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-emerald-400`} />
        <span>Verified On-Chain Bytecode</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide border shadow-sm ${
      size === 'sm' ? 'px-2 py-0.5 text-[11px]' :
      size === 'lg' ? 'px-3.5 py-1.5 text-sm' :
      'px-2.5 py-1 text-xs'
    } bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-950/50`}>
      <AlertTriangle className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-amber-400`} />
      <span>Self-Reported Record</span>
    </div>
  );
};

