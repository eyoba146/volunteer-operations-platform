import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../../api';
import { Certificate } from '../../types';
import { Input, Button } from '../../components/ui';
import { ShieldCheck, MagnifyingGlass, CheckCircle, Warning, QrCode } from '@phosphor-icons/react';

const SAMPLE_CODES = [
  { code: 'VTS-CERT-8842-ET', label: "Dawit's Membership Pass" },
  { code: 'VTS-CERT-7731-ET', label: "Selam's Senior Member Pass" },
  { code: 'VTS-CERT-9140-ET', label: "Dawit's Safety Pass" },
];

export const CertificateCheckPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    certificate?: Certificate;
    message?: string;
  } | null>(null);

  const doVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setIsLoading(true);
    setSearched(true);
    try {
      const res = await api.verifyCertificate(codeToVerify);
      setResult(res);
      setSearchParams({ code: codeToVerify.trim() });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initCode = searchParams.get('code');
    if (initCode) {
      doVerify(initCode);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doVerify(code);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center pb-2">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-slate-900 leading-none">
          Verify Volunteer Pass
        </h1>
        <p className="font-sans text-sm text-slate-500 max-w-lg mx-auto">
          Enter a certificate code to check the authenticity and completed hours of any credential issued by VTS.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-6 sm:p-8 space-y-5">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full space-y-1.5">
            <label className="block font-sans text-xs font-semibold text-slate-700">
              Verification Code
            </label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. VTS-CERT-8842-ET"
              leftIcon={<QrCode className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            leftIcon={<MagnifyingGlass className="w-4 h-4" weight="bold" />}
            className="w-full sm:w-auto"
          >
            Verify Pass
          </Button>
        </form>

        {/* Quick Demo Test Codes */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-sans text-slate-500">
          <span className="font-semibold text-slate-700">Quick Test Passes:</span>
          {SAMPLE_CODES.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => {
                setCode(s.code);
                doVerify(s.code);
              }}
              className="px-3 py-1 font-mono text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {searched && !isLoading && result && (
        <div className="animate-in fade-in duration-200">
          {result.valid && result.certificate ? (
            <div className="bg-white rounded-[28px] shadow-soft border border-slate-100 overflow-hidden">
              {/* Header Banner */}
              <div className="bg-emerald-50 text-emerald-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" weight="fill" />
                  <span className="font-display text-lg font-bold tracking-tight">
                    AUTHENTICATED VOLUNTEER PASS
                  </span>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {result.certificate.verificationCode}
                </span>
              </div>

              {/* Pass Body */}
              <div className="p-8 sm:p-10 space-y-8">
                <div className="space-y-2 text-center">
                  <span className="font-sans text-xs font-semibold text-slate-400">
                    This credential certifies that
                  </span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
                    {result.certificate.userName}
                  </h2>
                  <p className="font-sans text-base font-semibold text-brand">
                    {result.certificate.title}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-[18px] border border-slate-100 text-left">
                  <div>
                    <span className="text-xs font-sans text-slate-400 block">Volunteer Pass ID</span>
                    <span className="font-mono text-sm font-semibold text-slate-800">
                      {result.certificate.volunteerNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-sans text-slate-400 block">Date Issued</span>
                    <span className="font-mono text-sm font-semibold text-slate-800">
                      {new Date(result.certificate.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-sans text-slate-400 block">Issued By</span>
                    <span className="font-sans text-sm font-semibold text-slate-800">
                      {result.certificate.issuerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-sans text-slate-400 block">Authority</span>
                    <span className="font-sans text-sm font-semibold text-slate-800">
                      {result.certificate.issuerRole}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-sans">
                  <span>Record verified and active in VTS central database.</span>
                  <div className="p-2 bg-slate-50 rounded-[12px] border border-slate-100">
                    <QrCode className="w-6 h-6 text-slate-700" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-[24px] text-center space-y-3">
              <Warning className="w-8 h-8 text-rose-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-rose-900">Pass Not Found</h3>
                <p className="font-sans text-xs text-rose-700 max-w-sm mx-auto">
                  {result.message || 'We could not find an authenticated volunteer pass matching that verification code.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
