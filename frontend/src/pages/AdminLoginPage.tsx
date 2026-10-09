import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const AdminLoginPage: React.FC = () => {
  const { loginAsAdmin, adminToken } = useStore();
  const navigate = useNavigate();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasToken = Boolean(adminToken || (typeof window !== 'undefined' && sessionStorage.getItem('tws_admin_token')));

  useEffect(() => {
    if (hasToken) {
      navigate('/admin', { replace: true });
    }
  }, [hasToken, navigate]);

  if (hasToken) {
    return null;
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const success = await loginAsAdmin(adminEmail.trim(), adminPassword);
      if (success) {
        navigate('/admin', { replace: true });
      } else {
        setErrorMessage('Invalid administrative credentials or server authentication failure.');
      }
    } catch (err: any) {
      console.error('[Admin Login Error]', err);
      setErrorMessage(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#1A1617] text-white">
      <SEOHead
        title="Administrative Console Login"
        description="Restricted store administrative portal."
        noIndex={true}
      />

      <div className="max-w-md w-full bg-[#241C1D] p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#721B29] text-[#E6C280] rounded-xl flex items-center justify-center mx-auto shadow-lg border border-[#E6C280]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            Staff Administrative Portal
          </h1>
          <p className="text-xs text-[#A89F91]">
            Authorized boutique management access only
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-200 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#A89F91] mb-1.5">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C8276] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="staff@thewesternstore.in"
                className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-[#736B63] focus:outline-none focus:border-[#E6C280] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#A89F91] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C8276] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-[#736B63] focus:outline-none focus:border-[#E6C280] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#721B29] hover:bg-[#852031] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer border border-white/10 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E6C280]" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Authorize & Enter Console</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
