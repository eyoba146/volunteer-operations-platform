import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../../api';
import { Certificate } from '../../types';
import { Input, Button } from '../../components/ui';
import { ShieldCheck, MagnifyingGlass, CheckCircle, Warning, QrCode } from '@phosphor-icons/react';

const SAMPLE_CODES = [
  { code: 'VTS-CERT-8842-ET', label: "Dawit's Membership Certificate" },
  { code: 'VTS-CERT-7731-ET', label: "Selam's Senior Member Certificate" },
  { code: 'VTS-CERT-9140-ET', label: "Dawit's Training Qualification" },
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-2 border-b-2 border-ink-primary pb-6 text-center">
        <h1 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-ink-primary leading-none">
          Verify Volunteer Pass
        </h1>
        <p className="font-sans text-sm sm:text-base text-ink-secondary max-w-xl mx-auto">
          Enter a certificate code to check the authenticity and completed hours of any credential issued by VTS.
        </p>
      </div>

      {/* Search Input Box (Ticket Style) */}
      <div
        className="bg-white border-2 border-ink-primary p-6 sm:p-8 shadow-ticket space-y-5"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full space-y-1.5">
            <label className="block font-sans text-xs font-bold uppercase tracking-tight text-ink-primary">
              Verification Code
            </label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. VTS-CERT-8842-ET"
              leftIcon={<QrCode className="w-4 h-4 text-ink-secondary" />}
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            leftIcon={<MagnifyingGlass className="w-4 h-4" weight="bold" />}
            className="w-full sm:w-auto font-bold"
          >
            Verify Pass
          </Button>
        </form>

        {/* Quick Demo Test Codes */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2 text-xs font-sans text-ink-secondary">
          <span className="font-bold text-ink-primary">Quick Test Passes:</span>
          {SAMPLE_CODES.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => {
                setCode(s.code);
                doVerify(s.code);
              }}
              className="px-2.5 py-1 font-mono text-xs font-bold bg-canvas-subdued border border-ink-primary hover:bg-black hover:text-white transition-colors cursor-pointer"
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
            <div
              className="bg-white border-4 border-ink-primary shadow-float overflow-hidden"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)',
              }}
            >
              {/* Green Header Banner */}
              <div className="bg-role-volunteer text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink-primary">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-white" weight="fill" />
                  <span className="font-display text-2xl font-black uppercase tracking-tight">
                    AUTHENTICATED VOLUNTEER PASS
                  </span>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 bg-black text-white font-bold">
                  {result.certificate.verificationCode}
                </span>
              </div>

              {/* Certificate Pass Body */}
              <div className="p-8 md:p-12 space-y-8">
                <div className="space-y-3 text-center">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-ink-tertiary">
                    This credential certifies that
                  </span>
                  <h2 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-ink-primary leading-none">
                    {result.certificate.userName}
                  </h2>
                  <p className="font-sans text-lg font-bold text-role-volunteer">
                    {result.certificate.title}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-canvas-subdued border-2 border-border text-left">
                  <div>
                    <span className="text-xs font-sans text-ink-tertiary block">
                      Volunteer Pass ID
                    </span>
                    <span className="font-mono text-sm font-bold text-ink-primary">
                      {result.certificate.volunteerNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-sans text-ink-tertiary block">
                      Date Issued
                    </span>
                    <span className="font-mono text-sm font-bold text-ink-primary">
                      {new Date(result.certificate.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-sans text-ink-tertiary block">
                      Issued By
                    </span>
                    <span className="font-sans text-sm font-bold text-ink-primary">
                      {result.certificate.issuerName}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-sans text-ink-tertiary block">
                      Status
                    </span>
                    <span className="font-sans text-xs font-bold text-role-volunteer uppercase">
                      Active & Good Standing
                    </span>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative border-t-2 border-dashed border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-sans text-xs text-ink-secondary">
                    Verification signature: <strong className="font-mono text-ink-primary">{result.certificate.id}</strong>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-6 bg-ink-primary" />
                    <span className="w-1 h-6 bg-ink-primary" />
                    <span className="w-3 h-6 bg-ink-primary" />
                    <span className="w-1 h-6 bg-ink-primary" />
                    <span className="w-2 h-6 bg-ink-primary" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-role-teamlead p-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-red-50 text-role-teamlead border-2 border-role-teamlead flex items-center justify-center">
                <Warning className="w-6 h-6" weight="bold" />
              </div>
              <h3 className="font-display text-3xl font-black uppercase text-ink-primary">
                Record Not Found
              </h3>
              <p className="font-sans text-sm text-ink-secondary max-w-md mx-auto">
                {result.message || 'No record was found matching that verification code. Please check the digits stamped on your pass.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
