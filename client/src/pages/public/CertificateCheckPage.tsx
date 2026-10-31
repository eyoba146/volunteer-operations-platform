import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../../api';
import { Certificate } from '../../types';
import { Input, Button } from '../../components/ui';
import { MagnifyingGlass, CheckCircle, Warning, QrCode } from '@phosphor-icons/react';

const SAMPLE_CODES = [
  { code: 'VTS-CERT-8842-ET', label: "Dawit's membership certificate" },
  { code: 'VTS-CERT-7731-ET', label: "Selam's senior member certificate" },
  { code: 'VTS-CERT-9140-ET', label: "Dawit's service certificate" },
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-[#D5DAE1] pb-6 text-center">
        <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ink-primary leading-tight">
          Verify volunteer certificate
        </h1>
        <p className="font-sans text-base text-ink-secondary max-w-xl mx-auto">
          Enter a certificate code to check the authenticity and completed hours of any credential issued by VTS.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-[#D5DAE1] rounded-[10px] p-6 sm:p-8 space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full space-y-1.5">
            <Input
              label="Verification code"
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
            Verify certificate
          </Button>
        </form>

        {/* Quick Demo Test Codes */}
        <div className="pt-3 border-t border-[#D5DAE1] flex flex-wrap items-center gap-2 text-[13px] font-sans text-ink-secondary">
          <span className="font-bold text-ink-primary">Quick test codes:</span>
          {SAMPLE_CODES.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => {
                setCode(s.code);
                doVerify(s.code);
              }}
              className="px-2.5 py-1 text-[13px] font-semibold bg-canvas-subdued border border-[#D5DAE1] rounded-[6px] hover:border-ink-primary text-ink-primary transition-colors cursor-pointer"
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
              className="bg-white border-2 border-ink-primary shadow-[6px_6px_0_#111111] overflow-hidden"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)',
              }}
            >
              {/* Green Header Banner */}
              <div className="bg-role-volunteer text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink-primary">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-white" weight="fill" />
                  <span className="font-display text-2xl font-bold tracking-tight">
                    Authenticated volunteer certificate
                  </span>
                </div>
                <span className="font-sans text-[13px] px-2.5 py-1 bg-ink-primary text-white font-bold rounded-[4px]">
                  {result.certificate.verificationCode}
                </span>
              </div>

              {/* Certificate Pass Body */}
              <div className="p-8 md:p-12 space-y-8">
                <div className="space-y-3 text-center">
                  <span className="font-sans text-[13px] font-semibold text-ink-secondary block">
                    This credential certifies that
                  </span>
                  <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-ink-primary leading-none">
                    {result.certificate.userName}
                  </h2>
                  <p className="font-sans text-lg font-bold text-role-volunteer">
                    {result.certificate.title}
                  </p>
                </div>

                {/* Ledger-Style Metadata Rows */}
                <div className="bg-canvas-subdued border border-[#D5DAE1] rounded-[8px] p-4 divide-y divide-[#D5DAE1]">
                  <div className="py-2.5 flex items-center justify-between text-sm">
                    <span className="text-ink-secondary font-medium">Volunteer pass ID</span>
                    <span className="font-bold text-ink-primary">{result.certificate.volunteerNumber}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between text-sm">
                    <span className="text-ink-secondary font-medium">Date issued</span>
                    <span className="font-bold text-ink-primary">
                      {new Date(result.certificate.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between text-sm">
                    <span className="text-ink-secondary font-medium">Issued by</span>
                    <span className="font-bold text-ink-primary">{result.certificate.issuerName}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between text-sm">
                    <span className="text-ink-secondary font-medium">Status</span>
                    <span className="font-bold text-role-volunteer">Active in good standing</span>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative border-t-2 border-dashed border-[#D5DAE1] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-sans text-[13px] text-ink-secondary">
                    Verification signature: <strong className="font-sans text-ink-primary font-bold">{result.certificate.id}</strong>
                  </div>
                  <div className="flex gap-1.5 items-center">
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
            <div className="bg-white border border-role-teamlead rounded-[10px] p-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-red-50 text-role-teamlead border border-role-teamlead rounded-[8px] flex items-center justify-center">
                <Warning className="w-6 h-6" weight="bold" />
              </div>
              <h3 className="font-display text-2xl font-bold text-ink-primary">
                Record not found
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
