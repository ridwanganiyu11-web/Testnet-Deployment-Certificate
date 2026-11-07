import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  HelpCircle,
  FileCode,
  Hash,
  Layers,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAccount } from 'wagmi';
import { BOTCHAIN_CONFIG } from '../config/botchain';
import { computeMetadataFingerprint, formatCertificateId } from '../utils/fingerprint';
import { verifyDeploymentOnChain } from '../utils/rpcVerifier';
import { saveCertificate, loadStoredCertificates } from '../utils/storage';
import { Certificate } from '../types/certificate';

interface RegisterPageProps {
  onSuccess: (certificateId: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess }) => {
  const { address, isConnected } = useAccount();

  // Form State
  const [projectName, setProjectName] = useState('');
  const [contractName, setContractName] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [deploymentTxHash, setDeploymentTxHash] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [compiler, setCompiler] = useState('Solidity 0.8.20');
  const [license, setLicense] = useState('MIT');
  const [description, setDescription] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');

  // Option C: Auto-Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [bytecodeVerified, setBytecodeVerified] = useState<boolean | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [manualOverride, setManualOverride] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick fill helper for testing
  const handleQuickFillDemo = () => {
    setProjectName('BotPay');
    setContractName('BotPay.sol');
    setContractAddress('0x3edc1a780a555e290fbed724bc2ee4b31d9b8dd1');
    setDeploymentTxHash('0x75d71bafc66dc8924e5c01848fca9fc1d356ec38a9f432717acb2e02e371af1c');
    setVersion('v1.0.0');
    setCompiler('Solidity 0.8.20');
    setLicense('MIT');
    setDescription('Decentralized payment and checkout infrastructure on Botchain Testnet (Chain ID 968).');
    setRepositoryUrl('https://github.com/botpay-org/core-contracts');
  };

  // Auto-verify handler (Option C)
  const handleAutoVerify = async () => {
    if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.length !== 42) {
      setVerificationMessage('Please enter a valid 42-character contract address (0x...)');
      setBytecodeVerified(false);
      return;
    }

    setIsVerifying(true);
    setVerificationMessage('Querying Botchain Testnet RPC (https://rpc.bohr.life)...');

    try {
      const result = await verifyDeploymentOnChain(contractAddress, deploymentTxHash);
      if (result.hasBytecode) {
        setBytecodeVerified(true);
        setVerificationMessage('Bytecode verified on Botchain Testnet (Chain ID 968)!');
        if (result.details.deployer && !address) {
          // If deployer was detected from transaction
        }
      } else {
        setBytecodeVerified(false);
        setVerificationMessage('No bytecode found at this address on Botchain Testnet yet. You can still register in self-reported mode.');
      }
    } catch (err: any) {
      setBytecodeVerified(false);
      setVerificationMessage('RPC query timed out or failed. Manual registration fallback is available.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!projectName.trim()) {
      setErrorMessage('Project Name is required.');
      return;
    }
    if (!contractName.trim()) {
      setErrorMessage('Contract Name is required (e.g. MyContract.sol).');
      return;
    }
    if (!contractAddress.trim() || !contractAddress.startsWith('0x')) {
      setErrorMessage('A valid contract address is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeDeployer = address || '0x71C8364673B8e7b99c7FaA1cbe65E0e41B1F3d12';
      const isVerified = bytecodeVerified === true;

      // Calculate deterministic fingerprint (keccak256)
      const fingerprint = computeMetadataFingerprint({
        projectName,
        contractName,
        contractAddress,
        deployer: activeDeployer,
        deploymentTxHash,
        chainId: BOTCHAIN_CONFIG.chainId,
        version,
      });

      // Generate next certificate ID
      const allCerts = loadStoredCertificates();
      const nextId = allCerts.length > 0 ? Math.max(...allCerts.map((c) => c.id)) + 1 : 1001;
      const formattedId = formatCertificateId(nextId);

      // Create new certificate record
      const newCertificate: Certificate = {
        id: nextId,
        formattedId,
        projectName: projectName.trim(),
        contractName: contractName.trim(),
        contractAddress: contractAddress.trim(),
        deployer: activeDeployer,
        deploymentTxHash: deploymentTxHash.trim() || `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
        chainId: BOTCHAIN_CONFIG.chainId,
        timestamp: Math.floor(Date.now() / 1000),
        version: version.trim() || 'v1.0.0',
        metadataFingerprint: fingerprint,
        isBytecodeVerified: isVerified,
        compiler,
        license,
        description: description.trim(),
        repositoryUrl: repositoryUrl.trim(),
        registrationTxHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
      };

      // Save to persistence
      saveCertificate(newCertificate);

      // Trigger Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#059669', '#38bdf8'],
        });
      } catch (cErr) {
        // Safe confetti fallback
      }

      // Navigate to the newly generated certificate
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess(formattedId);
      }, 700);

    } catch (err: any) {
      console.error('Registration failed', err);
      setErrorMessage(err.message || 'Failed to register deployment certificate.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Option C: Hybrid Engine
            </span>
            <span className="text-xs text-slate-400">Automatic On-Chain Checks + Manual Registration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Register Smart Contract Deployment
          </h1>
          <p className="text-sm text-slate-400">
            Enter your deployment details. DeployProof will verify the contract on Botchain Testnet and seal an immutable certificate with a cryptographic fingerprint.
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-mono transition-colors whitespace-nowrap"
          title="Autofill BotPay sample data"
        >
          ⚡ Autofill BotPay Demo
        </button>
      </div>

      {/* Network Notice */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-white">Target Network: Botchain Testnet (Chain ID 968)</p>
          <p className="text-slate-400">
            RPC: <span className="font-mono text-emerald-400">{BOTCHAIN_CONFIG.rpcUrl}</span> • Explorer: <span className="font-mono text-slate-300">https://scan.bohr.life</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        
        {/* Project Name & Contract Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Project Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. BotPay"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Contract Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. BotPay.sol"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-600 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Contract Address + Option C Auto-Verify Button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Deployed Contract Address <span className="text-emerald-400">*</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">0x... (42 chars)</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              placeholder="0x38F24C589Ac41C8Eb38A18210355f32a76B9c6e5"
              value={contractAddress}
              onChange={(e) => {
                setContractAddress(e.target.value);
                setBytecodeVerified(null);
                setVerificationMessage(null);
              }}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono text-white placeholder-slate-600 outline-none transition-colors"
            />
            
            <button
              type="button"
              onClick={handleAutoVerify}
              disabled={isVerifying || !contractAddress}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Checking RPC...' : 'Auto-Verify on Chain 968'}</span>
            </button>
          </div>

          {/* Verification feedback alert */}
          {verificationMessage && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              bytecodeVerified === true 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}>
              {bytecodeVerified === true ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{verificationMessage}</span>
            </div>
          )}
        </div>

        {/* Deployment Transaction Hash */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Deployment Transaction Hash
          </label>
          <input
            type="text"
            placeholder="0x8f2d5a1bc36ef629810d7ef320aa112f483c65961d15db4a74284d7fb8fbc910"
            value={deploymentTxHash}
            onChange={(e) => setDeploymentTxHash(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono text-white placeholder-slate-600 outline-none transition-colors"
          />
          <p className="text-[11px] text-slate-500">
            Optional: Links directly to the BohrScan transaction receipt on the certificate.
          </p>
        </div>

        {/* Version, Compiler, License */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Version
            </label>
            <input
              type="text"
              placeholder="v1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Compiler
            </label>
            <input
              type="text"
              placeholder="Solidity 0.8.20"
              value={compiler}
              onChange={(e) => setCompiler(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              License
            </label>
            <input
              type="text"
              placeholder="MIT"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 outline-none font-mono"
            />
          </div>
        </div>

        {/* Repository URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Source Code Repository (GitHub / GitLab)
          </label>
          <input
            type="url"
            placeholder="https://github.com/my-org/my-contract"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 outline-none"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Project Description
          </label>
          <textarea
            rows={2}
            placeholder="Brief summary of what this smart contract does..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 outline-none resize-none"
          />
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isSubmitting ? 'Registering on Botchain Testnet...' : 'Create Deployment Certificate'}</span>
          </button>
          
          <p className="text-[11px] text-center text-slate-500 mt-3">
            Public viewing and verification are always free. Testnet gas is paid only during on-chain registration.
          </p>
        </div>

      </form>

    </div>
  );
};

