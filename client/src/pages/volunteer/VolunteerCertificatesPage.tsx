import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Certificate } from '../../types';
import { Button, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Certificate as CertIcon, 
  DownloadSimple, 
  QrCode, 
  ArrowSquareOut, 
  Copy, 
  Check,
  Printer
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export const VolunteerCertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const list = await api.getCertificatesForUser(user.id);
        setCertificates(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.info(`Verification code copied: ${code}`);
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
      <div className="border-b-2 border-border pb-5">
        <span className="font-sans text-xs font-bold text-role-volunteer tracking-tight block">
          Earned Credentials
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-ink-primary leading-none mt-1">
          Certificates and credentials
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
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
              className="border-2 border-ink-primary bg-white p-6 shadow-ticket space-y-5 flex flex-col justify-between relative overflow-hidden"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-border pb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-canvas border border-ink-primary text-ink-primary">
                    {cert.kind} certificate
                  </span>
                  <span className="font-mono text-xs text-ink-secondary">
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-black text-ink-primary leading-tight">
                  {cert.title}
                </h3>

                <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                  Conferred upon <strong className="text-ink-primary">{cert.userName}</strong> ({cert.volunteerNumber}) by the Volunteer Tracking System Program Board.
                </p>

                {/* Verification Code Box */}
                <div className="p-3 bg-canvas border-2 border-ink-primary flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-sans text-[13px] font-bold text-ink-tertiary block">
                      Verification Reference
                    </span>
                    <span className="font-mono text-xs font-bold text-ink-primary">
                      {cert.verificationCode}
                    </span>
                  </div>
                  <button
                    onClick={() => copyCode(cert.verificationCode)}
                    className="p-1.5 text-ink-secondary hover:text-ink-primary border border-border bg-white hover:bg-canvas transition-colors cursor-pointer"
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
              <div className="pt-4 border-t-2 border-dashed border-border flex items-center justify-between text-xs">
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
                  Print Certificate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
