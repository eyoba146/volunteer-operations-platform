import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Certificate } from '../../types';
import { Button, EmptyState, Skeleton, TopoBackdrop } from '../../components/ui';
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
      <div className="pb-5">
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
              className="relative overflow-hidden bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-[16px] space-y-5 flex flex-col justify-between"
            >
              <TopoBackdrop color="#16A34A" opacity={0.06} />

              <div className="relative z-10 space-y-5 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3">
                    <span className="font-sans text-[13px] font-bold px-2 py-0.5 bg-[#F7F8FA] rounded-[4px] text-ink-primary">
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
                  <div className="p-3 bg-[#F7F8FA] rounded-[10px] flex items-center justify-between gap-2">
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
                      className="p-1.5 text-ink-secondary hover:text-ink-primary rounded-[6px] bg-white shadow-xs hover:bg-[#F7F8FA] transition-colors cursor-pointer"
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
                <div className="pt-4 flex items-center justify-between text-sm">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
