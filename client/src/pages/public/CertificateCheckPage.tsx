import React, { useState } from 'react';
import * as api from '../../api';
import { Certificate } from '../../types';
import { PageShell, Input, Button, Raised, Panel, TopoBackdrop } from '../../components/ui';
import { ShieldCheck, CheckCircle, Warning, MagnifyingGlass } from '@phosphor-icons/react';

const SAMPLE_CODES = [
  { code: 'VTS-CERT-2026-001', label: 'Biruk Tadesse (Senior Member)' },
  { code: 'VTS-CERT-2026-002', label: 'Selam Alemu (Community Service)' },
];

export const CertificateCheckPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    certificate?: Certificate;
    message?: string;
  } | null>(null);

  const doVerify = async (codeToVerify: string) => {
    const trimmed = codeToVerify.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setSearched(true);
    try {
      const res = await api.verifyCertificate(trimmed);
      setResult(res);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doVerify(code);
  };

  return (
    <PageShell page="public/check-certificate" signature="TopoBackdrop">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
        {/* Header */}
        <div className="space-y-2 pb-6 text-center">
          <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ink-primary leading-tight">
            Verify volunteer certificate
          </h1>
          <p className="font-sans text-base text-ink-secondary max-w-xl mx-auto">
            Confirm the authenticity, service hours, and rank recognition of any certificate issued by the platform.
          </p>
        </div>

        {/* Search Box */}
        <Raised className="relative overflow-hidden p-6 sm:p-8 space-y-4">
          <TopoBackdrop color="#16A34A" opacity={0.04} />
          <div className="relative z-10 space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VTS-CERT-2026-001"
                  leftIcon={<ShieldCheck className="w-5 h-5 text-ink-secondary" weight="bold" />}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="shrink-0"
                isLoading={isLoading}
                leftIcon={<MagnifyingGlass className="w-4 h-4" weight="bold" />}
              >
                Verify certificate
              </Button>
            </form>

            {/* Sample Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-sm text-ink-secondary">
              <span className="font-bold text-ink-primary">Sample verification codes:</span>
              {SAMPLE_CODES.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => {
                    setCode(s.code);
                    doVerify(s.code);
                  }}
                  className="px-3 py-1 text-[13px] font-semibold bg-[#F1F3F6] hover:bg-[#E8EBEF] rounded-[6px] text-ink-primary transition-colors cursor-pointer"
                >
                  {s.code}
                </button>
              ))}
            </div>
          </div>
        </Raised>

        {/* Result Section */}
        {searched && !isLoading && result && (
          <div className="animate-in fade-in duration-200">
            {result.valid && result.certificate ? (
              <Raised padding="none" className="overflow-hidden">
                {/* Green Header Banner */}
                <div className="bg-role-volunteer text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-ink-primary leading-none">
                      {result.certificate.userName}
                    </h2>
                    <p className="font-sans text-lg font-bold text-role-volunteer">
                      {result.certificate.title}
                    </p>
                  </div>

                  {/* Ledger-Style Metadata Rows */}
                  <Panel padding="md" className="space-y-2">
                    <div className="py-2.5 flex items-center justify-between text-sm first:pt-0">
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
                    <div className="py-2.5 flex items-center justify-between text-sm last:pb-0">
                      <span className="text-ink-secondary font-medium">Status</span>
                      <span className="font-bold text-role-volunteer">Active in good standing</span>
                    </div>
                  </Panel>

                  {/* Perforated Divider */}
                  <div data-allow="perforation" className="relative pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="font-sans text-[13px] text-ink-secondary">
                      Verification signature: <strong className="font-sans text-ink-primary font-bold">{result.certificate.id}</strong>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-6 bg-ink-primary rounded-[1px]" />
                      <span className="w-1 h-6 bg-ink-primary rounded-[1px]" />
                      <span className="w-3 h-6 bg-ink-primary rounded-[1px]" />
                      <span className="w-1 h-6 bg-ink-primary rounded-[1px]" />
                      <span className="w-2 h-6 bg-ink-primary rounded-[1px]" />
                    </div>
                  </div>
                </div>
              </Raised>
            ) : (
              <Raised className="p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                  <Warning className="w-7 h-7" weight="bold" />
                </div>
                <h3 className="font-display text-2xl font-bold text-ink-primary">
                  Record not found
                </h3>
                <p className="font-sans text-sm sm:text-base text-ink-secondary max-w-md mx-auto leading-relaxed">
                  {result.message || 'No record was found matching that verification code. Please check the digits stamped on your pass.'}
                </p>
              </Raised>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
};
