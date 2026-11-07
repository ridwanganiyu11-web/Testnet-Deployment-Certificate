# DeployProof 🛡️
> **Deploy It. Register It. Prove It.**

**DeployProof** is a Web3 developer tool that allows developers to register their smart contract deployments on the **Botchain** blockchain and generate publicly verifiable deployment certificates.

It serves as a public, tamper-proof deployment portfolio for Web3 developers.

---

## 🌐 Botchain Testnet Specifications

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | [https://scan.bohr.life/](https://scan.bohr.life/) |
| **Native Gas Token** | `BOT` |
| **Total Supply** | `150 Million BOT` |

---

## ⚡ Key Features

1. **Option C: Hybrid Registration Engine**
   - **Automatic On-Chain Checks**: In real time, queries `https://rpc.bohr.life` to inspect contract bytecode (`eth_getCode`) and fetch the transaction receipt (`eth_getTransactionReceipt`).
   - **Manual Fallback**: If network indexing is delayed or an atypical proxy factory was used, developers can manually enter records.
   - **Verification Badges**: Certificates proudly display `Verified On-Chain Bytecode` (confirmed by RPC) or `Self-Reported Record`.

2. **Digital Deployment Certificates**
   - Generates high-res visual certificates with holographic seals.
   - Includes: Project name, Contract file, Contract address, Deployer wallet, Deployment Tx hash, Chain ID (968), Version, Timestamp, and `keccak256` metadata fingerprint.
   - **Tamper-Proof QR Code**: Scan with any smartphone camera to open the public verification URL.
   - **1-Click Export**: Download as high-resolution **PNG** or printable **PDF**.

3. **Public Verification Page (Zero Wallet Requirement)**
   - Public links like `deployproof.app/?tab=certificate&id=DP-001001` can be viewed and verified by clients, employers, and audit teams without connecting a wallet or paying gas.
   - Free search portal by Certificate ID, Contract Address, or Metadata Fingerprint.

4. **Single Lightweight Smart Contract**
   - `DeploymentCertificateRegistry.sol`:
     - Low gas footprint on Botchain Testnet.
     - Emits `DeploymentRegistered` events.
     - Stores on-chain `bytes32 metadataFingerprint` to guarantee off-chain metadata integrity.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- MetaMask or any Web3 wallet configured with Botchain Testnet

### 2. Add Botchain Testnet to MetaMask
- **Network Name**: Botchain Testnet
- **New RPC URL**: `https://rpc.bohr.life`
- **Chain ID**: `968`
- **Currency Symbol**: `BOT`
- **Block Explorer URL**: `https://scan.bohr.life`

### 3. Running the Frontend
```bash
# Start Vite development server
npm run dev

# Or build for production
npm run build
npm run preview
```
Visit `http://localhost:3000` in your browser.

---

## 📜 Smart Contract Development & Deployment

### Compile Contracts
```bash
npx hardhat --config hardhat.config.cjs compile
```

### Run Tests
```bash
npx hardhat --config hardhat.config.cjs test
```

### Deploy to Botchain Testnet (Chain ID 968)
Set your deployer private key in `.env`:
```env
PRIVATE_KEY=your_private_key_here
```

Then run:
```bash
npx hardhat --config hardhat.config.cjs run scripts/deploy.js --network botchain
```

---

## 📁 Project Structure

```
├── contracts/
│   └── DeploymentCertificateRegistry.sol  # Core registry smart contract
├── scripts/
│   └── deploy.js                         # Botchain Testnet deploy script
├── test/
│   └── DeploymentCertificateRegistry.test.cjs # Hardhat unit tests
├── src/
│   ├── components/
│   │   ├── CertificateCard.tsx            # Digital certificate card (PNG/PDF/QR)
│   │   ├── VerificationBadge.tsx          # Status badges (Verified Bytecode)
│   │   ├── Navbar.tsx                     # Top header + Reown AppKit connect
│   │   └── Footer.tsx                     # Network specs & footer
│   ├── config/
│   │   ├── botchain.ts                    # Botchain (Chain ID 968) definition
│   │   ├── appkit.ts                      # Reown AppKit + Wagmi setup
│   │   └── abi.ts                         # Registry contract ABI
│   ├── pages/
│   │   ├── HomePage.tsx                   # Hero + How it works + Recents
│   │   ├── DashboardPage.tsx              # Overview metrics & stats
│   │   ├── RegisterPage.tsx               # Option C Hybrid registration form
│   │   ├── CertificatesPage.tsx           # Searchable certificates portfolio
│   │   ├── CertificateDetailPage.tsx      # Public inspection & verification view
│   │   └── VerifyPage.tsx                 # Instant search & verify tool
│   ├── utils/
│   │   ├── rpcVerifier.ts                 # eth_getCode & tx verification on Chain 968
│   │   ├── fingerprint.ts                 # keccak256 metadata hasher
│   │   ├── pdfExport.ts                   # High-res PNG & PDF generator
│   │   └── storage.ts                     # Persistent certificate storage
│   ├── App.tsx
│   └── main.tsx
├── hardhat.config.cjs
├── vite.config.ts
└── package.json
```

---

## 📄 License
MIT License. Built for the Botchain Web3 developer community.

