import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  FileCode, 
  Calendar, 
  Hash, 
  Cpu, 
  Sparkles,
  Printer
} from 'lucide-react';
import { Certificate } from '../types/certificate';
import { VerificationBadge } from './VerificationBadge';
import { BOTCHAIN_CONFIG } from '../config/botchain';
import { downloadCertificateAsPNG, downloadCertificateAsPDF } from '../utils/pdfExport';

interface CertificateCardProps {
  certificate: Certificate;
  isDownloadable?: boolean;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ 
  certificate, 
  isDownloadable = true 
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const cardElementId = `certificate-card-${certificate.formattedId}`;
  
  // Public verification URL
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?tab=certificate&id=${certificate.formattedId}`
    : `https://deployproof.app/certificate/${certificate.formattedId}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadPNG = async () => {
    try {
      setIsExporting(true);
      await downloadCertificateAsPNG(cardElementId, `${certificate.projectName}-${certificate.formattedId}.png`);
    } catch (e) {
      console.error('Download PNG failed', e);
      alert('Could not generate PNG image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      await downloadCertificateAsPDF(cardElementId, `${certificate.projectName}-${certificate.formattedId}.pdf`);
    } catch (e) {
      console.error('Download PDF failed', e);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${certificate.projectName} - Botchain Deployment Certificate`,
        text: `Check out my verified smart contract deployment for ${certificate.projectName} on Botchain Testnet! Certificate ID: ${certificate.formattedId}`,
        url: verificationUrl,
      }).catch(() => {});
    } else {
      copyToClipboard(verificationUrl, 'share-url');
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const formattedDate = new Date(certificate.timestamp * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="space-y-4">
      {/* Visual Digital Certificate Canvas */}
      <div 
        id={cardElementId}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/30 text-white"
        style={{ minWidth: '320px' }}
      >
        {/* Holographic Watermark / Ambient glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
                  Official Attestation
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-mono">DeployProof Registry</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Smart Contract Deployment Certificate
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-xs text-slate-400 font-mono">Certificate ID</span>
            <span className="text-lg font-mono font-bold text-emerald-400 tracking-wider">
              {certificate.formattedId}
            </span>
          </div>
        </div>

        {/* Certificate Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          
          {/* Left Details Column */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Project & Contract Title */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Project & Contract
                </span>
                <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {certificate.version || 'v1.0.0'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                {certificate.projectName}
                <span className="text-slate-500 font-normal text-lg">/</span>
                <span className="text-emerald-400 font-mono text-xl">{certificate.contractName}</span>
              </div>
              {certificate.description && (
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {certificate.description}
                </p>
              )}
            </div>

            {/* Crucial Addresses & Hashes */}
            <div className="space-y-3 font-mono text-xs">
              
              {/* Contract Address */}
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-400 font-sans text-xs flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" /> Contract Address:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-medium break-all">
                    {certificate.contractAddress}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(certificate.contractAddress, 'contractAddress')}
                    className="p-1 hover:text-emerald-400 text-slate-500 transition-colors"
                    title="Copy address"
                  >
                    {copiedField === 'contractAddress' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${certificate.contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:text-emerald-400 text-slate-500 transition-colors"
                    title="View on BohrScan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Deployer Wallet */}
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-400 font-sans text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Deployer Wallet:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 break-all">{certificate.deployer}</span>
                  <button 
                    onClick={() => copyToClipboard(certificate.deployer, 'deployer')}
                    className="p-1 hover:text-emerald-400 text-slate-500 transition-colors"
                    title="Copy deployer"
                  >
                    {copiedField === 'deployer' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${certificate.deployer}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:text-emerald-400 text-slate-500 transition-colors"
                    title="View on BohrScan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Deployment Transaction */}
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-400 font-sans text-xs flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" /> Deployment Tx:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 truncate max-w-[240px] sm:max-w-[340px]">
                    {certificate.deploymentTxHash || 'Pending confirmation'}
                  </span>
                  {certificate.deploymentTxHash && (
                    <>
                      <button 
                        onClick={() => copyToClipboard(certificate.deploymentTxHash, 'txHash')}
                        className="p-1 hover:text-emerald-400 text-slate-500 transition-colors"
                        title="Copy Tx Hash"
                      >
                        {copiedField === 'txHash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={`${BOTCHAIN_CONFIG.explorerUrl}/tx/${certificate.deploymentTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 hover:text-emerald-400 text-slate-500 transition-colors"
                        title="View on BohrScan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Metadata Fingerprint */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-emerald-300 font-sans text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Fingerprint (keccak256):
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-200 truncate max-w-[220px] sm:max-w-[320px]">
                    {certificate.metadataFingerprint}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(certificate.metadataFingerprint, 'fingerprint')}
                    className="p-1 hover:text-emerald-400 text-slate-500 transition-colors"
                    title="Copy Fingerprint"
                  >
                    {copiedField === 'fingerprint' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right Verification & QR Seal Column */}
          <div className="lg:col-span-4 flex flex-col justify-between items-center bg-slate-900/50 rounded-xl border border-slate-800 p-5 text-center">
            
            <div className="w-full flex flex-col items-center">
              <VerificationBadge isBytecodeVerified={certificate.isBytecodeVerified} size="md" />

              {/* QR Code */}
              <div className="mt-4 p-3 bg-white rounded-xl shadow-md inline-block">
                <QRCodeSVG
                  value={verificationUrl}
                  size={128}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                Scan for Public Verification
              </p>
            </div>

            {/* Network & Blockstamp details */}
            <div className="w-full mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono space-y-1.5 text-slate-400 text-left">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-slate-200">Botchain Testnet</span>
              </div>
              <div className="flex justify-between">
                <span>Chain ID:</span>
                <span className="text-emerald-400 font-bold">968</span>
              </div>
              <div className="flex justify-between">
                <span>Recorded:</span>
                <span className="text-slate-200">{formattedDate}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Certificate Footer Notes */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>
            Cryptographically sealed on Botchain Testnet (Chain ID 968). Public inspection requires no wallet.
          </p>
          <div className="flex items-center gap-1 font-mono text-emerald-400 mt-2 sm:mt-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DeployProof Certified</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      {isDownloadable && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPNG}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Generating...' : 'Download PNG'}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              Download PDF
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              {shareSuccess ? 'Link Copied!' : 'Share Proof'}
            </button>

            <a
              href={`${BOTCHAIN_CONFIG.explorerUrl}/address/${certificate.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 hover:text-emerald-400 transition-colors"
            >
              <span>BohrScan Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

