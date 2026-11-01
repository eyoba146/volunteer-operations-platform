import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Certificate } from '../../types';
import { Button, EmptyState, Skeleton } from '../../components/ui';
import { Certificate as CertIcon, Printer, ArrowSquareOut, Check, Copy } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/ToastContext';

export const VolunteerCertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const loadCerts = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const list = await api.getCertificatesForUser(user.id);
        setCertificates(list);
      } finally {
        setIsLoading(false);
      }
    };
    loadCerts();
  }, [user]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Verification code copied to clipboard.');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rect" className="h-64" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#D5DAE1] pb-5">
        <span className="font-sans text-[13px] font-bold text-role-volunteer tracking-tight block">
          Earned credentials
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
          Certificates and credentials
        </h1>
        <p className="font-sans text-sm text-ink-secondary mt-1">
          Verified certificates awarded for membership activation, earned rank milestones, and completed training courses.
        </p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={<CertIcon className="w-8 h-8 text-ink-secondary" weight="bold" />}
          title="No certificates issued yet"
          description="Upon activating your membership or qualifying for advanced ranks, verified certificates will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-[16px] space-y-5 flex flex-col justify-between relative overflow-hidden border-none"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#EDEFF2] pb-3">
                  <span className="font-sans text-[13px] font-bold px-2 py-0.5 bg-canvas-subdued rounded-[4px] text-ink-primary">
                    {cert.kind} certificate
                  </span>
                  <span className="font-sans text-[13px] text-ink-secondary">
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-ink-primary leading-tight">
                  {cert.title}
                </h3>

                <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                  Conferred upon <strong className="text-ink-primary">{cert.userName}</strong> ({cert.volunteerNumber}) by the Volunteer Tracking System.
                </p>

                {/* Verification Code Box */}
                <div className="p-3 bg-canvas-subdued border border-[#D5DAE1] rounded-[8px] flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-sans text-[13px] font-bold text-ink-secondary block">
                      Verification reference
                    </span>
                    <span className="font-sans text-sm font-bold text-ink-primary">
                      {cert.verificationCode}
                    </span>
                  </div>
                  <button
                    onClick={() => copyCode(cert.verificationCode)}
                    className="p-1.5 text-ink-secondary hover:text-ink-primary border border-[#D5DAE1] rounded-[6px] bg-white hover:bg-canvas-subdued transition-colors cursor-pointer"
                    title="Copy verification code"
                  >
                    {copiedCode === cert.verificationCode ? (
                      <Check className="w-4 h-4 text-role-volunteer" weight="bold" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t-2 border-dashed border-[#D5DAE1] flex items-center justify-between text-sm">
                <Link
                  to={`/check-certificate?code=${cert.verificationCode}`}
                  className="font-sans font-bold text-ink-primary hover:text-role-volunteer flex items-center gap-1.5"
                >
                  <ArrowSquareOut className="w-4 h-4 text-role-volunteer" weight="bold" />
                  <span>Public verification page</span>
                </Link>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={handlePrint}
                >
                  Print pass
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
