import React, { useState, useEffect } from 'react';
import { Envelope, X, ArrowSquareOut } from '@phosphor-icons/react';
import { DemoEmail } from '../../types';
import * as api from '../../api';
import { Button } from '../ui';
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
        className="relative w-full max-w-4xl h-[640px] max-h-[90vh] bg-white border border-[#D5DAE1] rounded-[10px] shadow-2xl flex flex-col z-10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#D5DAE1] bg-canvas-subdued shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] border border-[#D5DAE1] bg-white flex items-center justify-center text-ink-primary">
              <Envelope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-ink-primary">
                  Demo email preview inbox
                </h3>
                <span className="font-sans text-[13px] px-2 py-0.5 rounded-[4px] border border-[#D5DAE1] bg-white text-ink-secondary">
                  Delivery simulator
                </span>
              </div>
              <p className="font-sans text-[13px] text-ink-secondary">
                Shows all transactional emails sent by the system (verification codes, receipts, promotion updates)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-canvas-inset border border-transparent hover:border-[#D5DAE1] rounded-[6px] transition-colors cursor-pointer"
            aria-label="Close email simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-Pane Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Email List Column */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#D5DAE1] overflow-y-auto bg-canvas-subdued/30 divide-y divide-[#D5DAE1] shrink-0">
            {isLoading ? (
              <div className="p-4 text-[13px] font-sans text-ink-secondary">Loading messages...</div>
            ) : emails.length === 0 ? (
              <div className="p-6 text-center text-sm font-sans text-ink-secondary">
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
                        ? 'bg-white border-l-2 border-l-ink-primary font-medium'
                        : 'hover:bg-canvas-subdued/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[13px] mb-1">
                      <span className="font-sans text-ink-secondary truncate max-w-[140px]">
                        {em.to}
                      </span>
                      <span className="font-sans text-[13px] text-ink-secondary">
                        {new Date(em.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4
                      className={`text-sm text-ink-primary leading-tight line-clamp-2 ${
                        !em.read ? 'font-bold' : 'font-normal'
                      }`}
                    >
                      {em.subject}
                    </h4>
                    {em.code && (
                      <div className="mt-1.5">
                        <span className="font-sans text-[13px] font-bold px-1.5 py-0.5 bg-role-applicantLight text-ink-primary border border-role-applicant rounded-[4px]">
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
          <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col justify-between">
            {selectedEmail ? (
              <div className="space-y-6">
                {/* Meta header */}
                <div className="space-y-3 pb-4 border-b border-[#D5DAE1]">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-xl font-bold text-ink-primary leading-tight">
                      {selectedEmail.subject}
                    </h2>
                    <span className="font-sans text-[13px] px-2 py-0.5 border border-[#D5DAE1] rounded-[4px] bg-canvas-subdued text-ink-secondary shrink-0">
                      {selectedEmail.category}
                    </span>
                  </div>

                  <div className="text-sm space-y-1 font-sans text-ink-secondary">
                    <div>
                      <span className="text-ink-secondary">To: </span>
                      <strong className="text-ink-primary font-sans">{selectedEmail.toName}</strong>{' '}
                      &lt;{selectedEmail.to}&gt;
                    </div>
                    <div>
                      <span className="text-ink-secondary">From: </span>
                      Volunteer Tracking System &lt;notifications@vts.et&gt;
                    </div>
                    <div>
                      <span className="text-ink-secondary">Sent: </span>
                      {new Date(selectedEmail.sentAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="bg-canvas-subdued/40 border border-[#D5DAE1] rounded-[8px] p-5 space-y-4 font-sans text-sm text-ink-primary leading-relaxed whitespace-pre-line">
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
                      {selectedEmail.actionLabel || 'Open link in app'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-ink-secondary font-sans">
                Select an email from the list to preview.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
