import React, { useState, useEffect } from 'react';
import { Envelope, X, ArrowSquareOut, DeviceMobile, ChatText, CheckCircle } from '@phosphor-icons/react';
import { DemoEmail, DemoSmsMessage } from '../../types';
import * as api from '../../api';
import { Button } from '../ui';
import { useNavigate } from 'react-router-dom';

interface DemoEmailInboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoEmailInbox: React.FC<DemoEmailInboxProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');
  const [emails, setEmails] = useState<DemoEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<DemoEmail | null>(null);
  const [smsList, setSmsList] = useState<DemoSmsMessage[]>([]);
  const [selectedSms, setSelectedSms] = useState<DemoSmsMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const [emailList, smsMsgs] = await Promise.all([
        api.getAllDemoEmails(),
        api.getSmsMessages(),
      ]);
      setEmails(emailList);
      if (emailList.length > 0 && !selectedEmail) {
        setSelectedEmail(emailList[0]);
      }
      setSmsList(smsMsgs);
      if (smsMsgs.length > 0 && !selectedSms) {
        setSelectedSms(smsMsgs[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMessages();
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

  const handleSelectSms = (sms: DemoSmsMessage) => {
    setSelectedSms(sms);
    if (!sms.read) {
      api.markSmsRead(sms.id);
      setSmsList((prev) =>
        prev.map((item) => (item.id === sms.id ? { ...item, read: true } : item))
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
        className="relative w-full max-w-4xl h-[640px] max-h-[90vh] bg-white border-none rounded-[16px] shadow-[0_1px_3px_rgba(16,24,40,0.08),0_16px_36px_-4px_rgba(16,24,40,0.14)] flex flex-col z-10 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Channel Switcher Tabs */}
        <div className="flex items-center justify-between p-4 bg-[#F7F8FA] shrink-0 border-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-white flex items-center justify-center text-ink-primary border-none shadow-xs">
              {activeTab === 'email' ? (
                <Envelope className="w-4 h-4" />
              ) : (
                <DeviceMobile className="w-4 h-4 text-role-volunteer" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-ink-primary">
                  Communications delivery preview
                </h3>
                {/* Channel Selector Pills */}
                <div className="flex items-center gap-1 bg-[#E8EBEF] p-0.5 rounded-[8px]">
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`px-3 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'email'
                        ? 'bg-white text-ink-primary shadow-xs'
                        : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    Emails ({emails.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('sms')}
                    className={`px-3 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'sms'
                        ? 'bg-white text-ink-primary shadow-xs'
                        : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    Text messages (SMS) ({smsList.length})
                  </button>
                </div>
              </div>
              <p className="font-sans text-[13px] text-ink-secondary mt-0.5">
                Simulates real-time outbound delivery of verification codes, Telebirr receipts, and field reminders.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-[#E8EBEF] rounded-[6px] transition-colors cursor-pointer border-none"
            aria-label="Close message simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB 1: EMAILS */}
        {activeTab === 'email' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Email List Column */}
            <div className="w-full md:w-80 overflow-y-auto bg-[#F7F8FA]/60 shrink-0 border-none space-y-1 p-2">
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
                      className={`w-full text-left p-3.5 rounded-[8px] transition-colors cursor-pointer block border-none ${
                        isSelected
                          ? 'bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] font-bold'
                          : 'hover:bg-[#E8EBEF]'
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
                          <span className="font-sans text-[13px] font-bold px-1.5 py-0.5 bg-role-applicantLight text-ink-primary rounded-[4px] border-none">
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
                  <div className="space-y-3 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="font-display text-xl font-bold text-ink-primary leading-tight">
                        {selectedEmail.subject}
                      </h2>
                      <span className="font-sans text-[13px] px-2 py-0.5 rounded-[4px] bg-[#F7F8FA] text-ink-secondary shrink-0 border-none capitalize">
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
                  <div className="bg-[#F7F8FA] rounded-[12px] p-5 space-y-4 font-sans text-sm text-ink-primary leading-relaxed whitespace-pre-line border-none">
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
        )}

        {/* TAB 2: TEXT MESSAGES (SMS SIMULATOR) */}
        {activeTab === 'sms' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* SMS List Column */}
            <div className="w-full md:w-80 overflow-y-auto bg-[#F7F8FA]/60 shrink-0 border-none space-y-1 p-2">
              {isLoading ? (
                <div className="p-4 text-[13px] font-sans text-ink-secondary">Loading SMS messages...</div>
              ) : smsList.length === 0 ? (
                <div className="p-6 text-center text-sm font-sans text-ink-secondary">
                  No SMS text messages sent yet.
                </div>
              ) : (
                smsList.map((sms) => {
                  const isSelected = selectedSms?.id === sms.id;
                  return (
                    <button
                      key={sms.id}
                      onClick={() => handleSelectSms(sms)}
                      className={`w-full text-left p-3.5 rounded-[8px] transition-colors cursor-pointer block border-none ${
                        isSelected
                          ? 'bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] font-bold'
                          : 'hover:bg-[#E8EBEF]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-ink-primary truncate max-w-[140px]">
                          {sms.toName}
                        </span>
                        <span className="font-mono text-ink-tertiary">
                          {new Date(sms.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-ink-secondary mb-1">
                        {sms.toPhone}
                      </div>
                      <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                        {sms.body}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#E8EBEF] text-ink-primary uppercase tracking-wider">
                          {sms.category}
                        </span>
                        {!sms.read && (
                          <span className="w-2 h-2 rounded-full bg-role-teamlead shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Phone-Frame SMS Preview Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-white flex items-center justify-center">
              {selectedSms ? (
                <div className="w-[320px] rounded-[32px] bg-[#111315] p-3 shadow-2xl">
                  {/* Phone Screen Container */}
                  <div className="bg-[#F7F8FA] rounded-[24px] overflow-hidden flex flex-col h-[460px]">
                    {/* Phone Top Status Bar */}
                    <div className="bg-white px-4 py-2 flex items-center justify-between text-[11px] font-semibold text-ink-secondary">
                      <span>Ethio Telecom</span>
                      <div className="w-12 h-2 rounded-full bg-[#111315]/10 mx-auto" />
                      <span>100%</span>
                    </div>

                    {/* Chat Header */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-role-volunteer/15 text-role-volunteer flex items-center justify-center text-xs font-bold">
                          VTS
                        </div>
                        <div>
                          <div className="text-xs font-bold text-ink-primary flex items-center gap-1">
                            <span>VTS Corps</span>
                            <CheckCircle className="w-3.5 h-3.5 text-role-volunteer" weight="fill" />
                          </div>
                          <span className="text-[10px] text-ink-tertiary">Shortcode 8080 &bull; Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat Message Bubble Canvas */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col justify-end">
                      <div className="text-center">
                        <span className="text-[10px] font-medium text-ink-tertiary bg-white px-2 py-0.5 rounded-full shadow-xs">
                          {new Date(selectedSms.sentAt).toLocaleDateString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          {new Date(selectedSms.sentAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Inbound Message Bubble */}
                      <div className="bg-white rounded-[16px] rounded-tl-[4px] p-3 shadow-xs max-w-[92%] space-y-2">
                        <p className="text-xs text-ink-primary leading-relaxed whitespace-pre-line">
                          {selectedSms.body}
                        </p>
                        <div className="text-[10px] text-ink-tertiary text-right font-mono">
                          {new Date(selectedSms.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Phone Footer */}
                    <div className="bg-white px-3 py-2 text-center text-[10px] text-ink-tertiary">
                      Delivered via Ethio Telecom Shortcode 8080
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-ink-secondary">
                  Select a text message to preview in simulated phone frame.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
