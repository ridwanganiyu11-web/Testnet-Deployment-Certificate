import React, { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter } from './config/appkit';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { CertificateDetailPage } from './pages/CertificateDetailPage';
import { VerifyPage } from './pages/VerifyPage';
import { loadStoredCertificates, Certificate } from './utils/storage';

const queryClient = new QueryClient();

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeCertId, setActiveCertId] = useState<string>('DP-001001');
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Load stored certificates on mount
  useEffect(() => {
    const certs = loadStoredCertificates();
    setCertificates(certs);

    // Deep link query check
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const idParam = params.get('id');

    if (tabParam) {
      setCurrentTab(tabParam);
    }
    if (idParam) {
      setActiveCertId(idParam);
      setCurrentTab('certificate');
    }
  }, []);

  const handleNavigate = (tab: string, certId?: string) => {
    if (certId) {
      setActiveCertId(certId);
      setCurrentTab('certificate');
      window.history.pushState({}, '', `?tab=certificate&id=${certId}`);
    } else {
      setCurrentTab(tab);
      window.history.pushState({}, '', `?tab=${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (newCertId: string) => {
    // Refresh list from storage
    const updated = loadStoredCertificates();
    setCertificates(updated);
    handleNavigate('certificate', newCertId);
  };

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
          <Navbar currentTab={currentTab} setCurrentTab={handleNavigate} />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {currentTab === 'home' && (
              <HomePage 
                recentCertificates={certificates} 
                onNavigate={handleNavigate} 
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardPage 
                certificates={certificates} 
                onNavigate={handleNavigate} 
              />
            )}

            {currentTab === 'register' && (
              <RegisterPage 
                onSuccess={handleRegistrationSuccess} 
              />
            )}

            {currentTab === 'certificates' && (
              <CertificatesPage 
                certificates={certificates} 
                onNavigate={handleNavigate} 
              />
            )}

            {currentTab === 'certificate' && (
              <CertificateDetailPage 
                certificateId={activeCertId} 
                certificates={certificates} 
                onBack={() => handleNavigate('certificates')} 
              />
            )}

            {currentTab === 'verify' && (
              <VerifyPage 
                certificates={certificates} 
                onNavigate={handleNavigate} 
              />
            )}
          </main>

          <Footer />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

