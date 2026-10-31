import React, { useState, useEffect } from 'react';
import { Envelope, X, ArrowSquareOut, CheckCircle, Clock } from '@phosphor-icons/react';
import { DemoEmail } from '../../types';
import * as api from '../../api';
import { Button, StatusMark } from '../ui';
import { useNavigate } from 'react-router-dom';

interface DemoEmailInboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoEmailInbox: React.FC<DemoEmailInboxProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState<DemoEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<DemoEmail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const list = await api.getAllDemoEmails();
      setEmails(list);
      if (list.length > 0 && !selectedEmail) {
        setSelectedEmail(list[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectEmail = (em: DemoEmail) => {
    setSelectedEmail(em);
    if (!em.read) {
      api.markDemoEmailRead(em.id);
      setEmails((prev) =>
        prev.map((item) => (item.id === em.id ? { ...item, read: true } : item))
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div
        className="relative w-full max-w-4xl h-[640px] max-h-[90vh] bg-canvas-raised border border-border-strong shadow-modal flex flex-col z-10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-canvas-subdued shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border border-border bg-canvas-raised flex items-center justify-center text-ink-primary">
              <Envelope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold text-ink-primary">
                  Demo Email Preview Inbox
                </h3>
                <span className="font-mono text-[11px] px-2 py-0.5 border border-border bg-canvas-inset text-ink-secondary">
                  Brevo Simulator
                </span>
              </div>
              <p className="font-sans text-xs text-ink-tertiary">
                Shows all transactional emails sent by the system (verification codes, receipts, promotion updates)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-canvas-inset border border-transparent hover:border-border transition-colors cursor-pointer"
            aria-label="Close email simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-Pane Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Email List Column */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border overflow-y-auto bg-canvas-subdued/30 divide-y divide-border shrink-0">
            {isLoading ? (
              <div className="p-4 text-xs font-sans text-ink-tertiary">Loading messages...</div>
            ) : emails.length === 0 ? (
              <div className="p-6 text-center text-xs font-sans text-ink-tertiary">
                No system emails sent yet.
              </div>
            ) : (
              emails.map((em) => {
                const isSelected = selectedEmail?.id === em.id;
                return (
                  <button
                    key={em.id}
                    onClick={() => handleSelectEmail(em)}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer block ${
                      isSelected
                        ? 'bg-canvas-raised border-l-2 border-l-ink-primary font-medium'
                        : 'hover:bg-canvas-subdued/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-ink-tertiary truncate max-w-[140px]">
                        {em.to}
                      </span>
                      <span className="font-mono text-[10px] text-ink-tertiary">
                        {new Date(em.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4
                      className={`text-xs text-ink-primary leading-tight line-clamp-2 ${
                        !em.read ? 'font-bold' : 'font-normal'
                      }`}
                    >
                      {em.subject}
                    </h4>
                    {em.code && (
                      <div className="mt-1.5">
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-civic-goldLight text-[#784E0B] border border-civic-gold/40">
                          Code: {em.code}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Email Detail Column */}
          <div className="flex-1 overflow-y-auto p-6 bg-canvas-raised flex flex-col justify-between">
            {selectedEmail ? (
              <div className="space-y-6">
                {/* Meta header */}
                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-serif text-xl font-bold text-ink-primary leading-tight">
                      {selectedEmail.subject}
                    </h2>
                    <span className="font-mono text-xs uppercase px-2 py-0.5 border border-border bg-canvas-subdued text-ink-secondary shrink-0">
                      {selectedEmail.category}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-mono text-ink-secondary">
                    <div>
                      <span className="text-ink-tertiary">To: </span>
                      <strong className="text-ink-primary font-sans">{selectedEmail.toName}</strong>{' '}
                      &lt;{selectedEmail.to}&gt;
                    </div>
                    <div>
                      <span className="text-ink-tertiary">From: </span>
                      VTS Civic Operations &lt;notifications@vts.et&gt;
                    </div>
                    <div>
                      <span className="text-ink-tertiary">Sent: </span>
                      {new Date(selectedEmail.sentAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="bg-canvas-subdued/40 border border-border p-5 space-y-4 font-sans text-sm text-ink-primary leading-relaxed whitespace-pre-line">
                  {selectedEmail.body}
                </div>

                {/* Action Link Button if provided */}
                {selectedEmail.actionUrl && (
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      rightIcon={<ArrowSquareOut className="w-4 h-4" />}
                      onClick={() => {
                        onClose();
                        navigate(selectedEmail.actionUrl!);
                      }}
                    >
                      {selectedEmail.actionLabel || 'Open Link in App'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-ink-tertiary font-sans">
                Select an email from the list to preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

