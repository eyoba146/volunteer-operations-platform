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
  Check 
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

  const handlePrint = (certId: string) => {
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
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
          OFFICIAL QUALIFICATIONS
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
          Civic Certificates & Credentials
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Official certificates awarded for membership activation, earned rank milestones, and completed leadership courses.
        </p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={<CertIcon className="w-6 h-6" />}
          title="No certificates issued yet"
          description="Upon activating your membership or qualifying for advanced ranks, official certificates will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="border-2 border-border-strong bg-canvas-raised p-6 shadow-subtle space-y-5 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-civic-green" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-canvas-subdued border border-border text-ink-secondary">
                    {cert.kind} qualification
                  </span>
                  <span className="font-mono text-[11px] text-ink-tertiary">
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-ink-primary leading-snug">
                  {cert.title}
                </h3>

                <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                  Conferred upon <strong className="text-ink-primary">{cert.userName}</strong> ({cert.volunteerNumber}) by authority of the Volunteer Tracking System Program Board.
                </p>

                {/* Verification Code Box */}
                <div className="p-3 bg-canvas-subdued border border-border flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink-tertiary block">
                      Verification Code
                    </span>
                    <span className="font-mono text-xs font-bold text-ink-primary">
                      {cert.verificationCode}
                    </span>
                  </div>
                  <button
                    onClick={() => copyCode(cert.verificationCode)}
                    className="p-1.5 text-ink-secondary hover:text-ink-primary border border-border hover:bg-canvas-raised transition-colors cursor-pointer"
                    title="Copy verification code"
                  >
                    {copiedCode === cert.verificationCode ? (
                      <Check className="w-4 h-4 text-civic-green" weight="bold" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <Link
                  to={`/check-certificate?code=${cert.verificationCode}`}
                  className="font-sans font-semibold text-ink-primary hover:underline flex items-center gap-1.5"
                >
                  <ArrowSquareOut className="w-3.5 h-3.5 text-civic-green" />
                  <span>Public Registry Link</span>
                </Link>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<DownloadSimple className="w-3.5 h-3.5" />}
                  onClick={() => handlePrint(cert.id)}
                >
                  Print / Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

