import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Setting, EmailTemplate } from '../../types';
import { Input, Button, Tabs, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  FloppyDisk, 
  ArrowLeft, 
  MapPin, 
  Plus, 
  X, 
  ArrowClockwise,
  Eye,
  Warning
} from '@phosphor-icons/react';

export const AdminSettingsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('fees');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fee & Program Settings
  const [fee, setFee] = useState('200');
  const [deadline, setDeadline] = useState('7');
  const [programName, setProgramName] = useState('VTS Volunteer Corps');
  const [merchantName, setMerchantName] = useState('VTS Program - Ethio Telecom');
  const [shortcode, setShortcode] = useState('884120');

  // Areas & Skills
  const [areas, setAreas] = useState<string[]>([]);
  const [newAreaInput, setNewAreaInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Certificate Text
  const [signatory, setSignatory] = useState('Ruth Mengistu, Program Director');
  const [certTemplateText, setCertTemplateText] = useState(
    'This verifies that the named volunteer has successfully satisfied all verified service hours, merit milestones, and field leadership standards established by the VTS Volunteer Corps.'
  );

  // Email Templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const [list, tpls] = await Promise.all([
        api.getSettings(),
        api.getEmailTemplates(),
      ]);

      list.forEach((s) => {
        if (s.key === 'registration_fee') setFee(s.value.toString());
        if (s.key === 'payment_deadline_days') setDeadline(s.value.toString());
        if (s.key === 'program_name') setProgramName(s.value.toString());
        if (s.key === 'telebirr_merchant_name') setMerchantName(s.value.toString());
        if (s.key === 'telebirr_shortcode') setShortcode(s.value.toString());
        if (s.key === 'certificate_signatory') setSignatory(s.value.toString());
        if (s.key === 'certificate_template_text') setCertTemplateText(s.value.toString());
        if (s.key === 'operating_areas') {
          setAreas(s.value.toString().split(',').map((a) => a.trim()).filter(Boolean));
        }
        if (s.key === 'volunteer_skills') {
          setSkills(s.value.toString().split(',').map((k) => k.trim()).filter(Boolean));
        }
      });

      setTemplates(tpls);
      if (tpls.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(tpls[0].id);
        setEditedSubject(tpls[0].subject);
        setEditedBody(tpls[0].body);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    if (tpl) {
      setEditedSubject(tpl.subject);
      setEditedBody(tpl.body);
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await Promise.all([
        api.updateSetting('registration_fee', parseFloat(fee) || 200, user.id, profile?.fullName || user.username),
        api.updateSetting('payment_deadline_days', parseInt(deadline) || 7, user.id, profile?.fullName || user.username),
        api.updateSetting('program_name', programName, user.id, profile?.fullName || user.username),
        api.updateSetting('telebirr_merchant_name', merchantName, user.id, profile?.fullName || user.username),
        api.updateSetting('telebirr_shortcode', shortcode, user.id, profile?.fullName || user.username),
      ]);
      toast.success('Program configuration and fee parameters updated.');
    } catch (err: any) {
      toast.error(err.message || 'Could not save parameters.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAreasAndSkills = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await Promise.all([
        api.updateSetting('operating_areas', areas.join(', '), user.id, profile?.fullName || user.username),
        api.updateSetting('volunteer_skills', skills.join(', '), user.id, profile?.fullName || user.username),
      ]);
      toast.success('Operational areas and skills catalog updated.');
    } catch (err: any) {
      toast.error(err.message || 'Could not save areas and skills.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    if (areas.includes(newAreaInput.trim())) return;
    setAreas([...areas, newAreaInput.trim()]);
    setNewAreaInput('');
  };

  const handleRemoveArea = (item: string) => {
    setAreas(areas.filter((a) => a !== item));
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (skills.includes(newSkillInput.trim())) return;
    setSkills([...skills, newSkillInput.trim()]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (item: string) => {
    setSkills(skills.filter((s) => s !== item));
  };

  const handleSaveCertTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await Promise.all([
        api.updateSetting('certificate_signatory', signatory, user.id, profile?.fullName || user.username),
        api.updateSetting('certificate_template_text', certTemplateText, user.id, profile?.fullName || user.username),
      ]);
      toast.success('Certificate text template updated.');
    } catch (err: any) {
      toast.error(err.message || 'Could not save certificate text.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTemplateId) return;
    setIsSaving(true);
    try {
      await api.updateEmailTemplate(
        selectedTemplateId,
        { subject: editedSubject.trim(), body: editedBody.trim() },
        user.id,
        profile?.fullName || user.username
      );
      toast.success('Email template updated with live preview confirmed.');
      await loadSettings();
    } catch (err: any) {
      toast.error(err.message || 'Could not save template.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo data back to initial seed state? This restores all applicants, seed hours, and payments.')) {
      api.store.resetAll();
      toast.info('All demo data has been reset to initial seed baseline.');
      window.location.reload();
    }
  };

  // Render sample email preview
  const activeTemplate = templates.find((t) => t.id === selectedTemplateId);
  const renderPreviewSubject = () => {
    let s = editedSubject;
    s = s.replace(/{{volunteer_name}}/g, 'Dawit Bekele');
    s = s.replace(/{{new_rank}}/g, 'Team Lead');
    s = s.replace(/{{amount}}/g, fee);
    s = s.replace(/{{activity_title}}/g, 'Entoto Forest Ridge Trail Cleanup');
    return s;
  };

  const renderPreviewBody = () => {
    let b = editedBody;
    b = b.replace(/{{volunteer_name}}/g, 'Dawit Bekele');
    b = b.replace(/{{new_rank}}/g, 'Team Lead');
    b = b.replace(/{{amount}}/g, `${fee}.00`);
    b = b.replace(/{{payment_deadline_days}}/g, deadline);
    b = b.replace(/{{payment_url}}/g, 'https://vts-platform.et/applicant/payment');
    b = b.replace(/{{telebirr_reference}}/g, 'TB-2026-0814-8841');
    b = b.replace(/{{receipt_number}}/g, 'REC-2026-00084');
    b = b.replace(/{{volunteer_number}}/g, 'VTS-AA-2026-084');
    b = b.replace(/{{certificate_code}}/g, 'VTS-CERT-8842-ET');
    b = b.replace(/{{decided_by}}/g, 'Marta Girma (Program Manager)');
    b = b.replace(/{{verification_link}}/g, 'https://vts-platform.et/verify-email?token=demo');
    b = b.replace(/{{verification_code}}/g, '749201');
    b = b.replace(/{{activity_title}}/g, 'Entoto Forest Ridge Trail Cleanup');
    b = b.replace(/{{activity_date}}/g, 'Tomorrow at 8:00 AM');
    b = b.replace(/{{activity_place}}/g, 'Entoto Nature Park Gate 2');
    b = b.replace(/{{lead_name}}/g, 'Yonas Kebede');
    b = b.replace(/{{check_in_code}}/g, '7294');
    return b;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <button
        onClick={() => navigate('/admin/overview')}
        className="inline-flex items-center gap-1.5 text-[13px] font-mono font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to administration overview</span>
      </button>

      {/* Header Card */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-4">
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink-primary leading-tight">
              Program settings and templates
            </h1>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Configure registration fee rules, operational areas, volunteer skills catalog, and transactional email templates with live preview.
            </p>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'fees', label: 'Fees and platform' },
          { id: 'areas', label: 'Areas and skills' },
          { id: 'certificates', label: 'Certificate template' },
          { id: 'templates', label: 'Email templates and preview' },
          { id: 'demo', label: 'Demo tools' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: Fees & Platform Settings */}
      {activeTab === 'fees' && (
        <form onSubmit={handleSaveGeneral} className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#D5DAE1] pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Registration fee and merchant account
            </h3>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              Parameters governing Telebirr fee collections and intake deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Registration fee amount (ETB)"
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              hint="One-time applicant fee required to activate Member rank."
              required
            />

            <Input
              label="Payment deadline window (Days)"
              type="number"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              hint="Days granted to accepted applicants before invitation expires."
              required
            />

            <Input
              label="Telebirr merchant name"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              required
            />

            <Input
              label="Telebirr shortcode"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              hint="Displayed in phone prompt instructions."
              required
            />
          </div>

          <Input
            label="Program public display name"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            required
          />

          <div className="pt-3 border-t border-[#D5DAE1] flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<FloppyDisk className="w-4 h-4" weight="bold" />}
            >
              Save configuration
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: Operating Areas & Skills Catalog */}
      {activeTab === 'areas' && (
        <div className="space-y-6">
          {/* Areas Editor */}
          <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="border-b border-[#D5DAE1] pb-3">
              <h3 className="font-display text-xl font-bold text-ink-primary">
                Operational areas
              </h3>
              <p className="text-[13px] text-ink-secondary mt-0.5">
                Corridors where volunteer activities and community teams are deployed.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {areas.map((a) => (
                <span
                  key={a}
                  className="font-mono text-[13px] font-medium px-3 py-1.5 bg-canvas-subdued rounded-[6px] border border-[#D5DAE1] text-ink-primary flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-role-manager" weight="bold" />
                  <span>{a}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(a)}
                    className="text-ink-tertiary hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" weight="bold" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Input
                placeholder="e.g. Dire Dawa"
                value={newAreaInput}
                onChange={(e) => setNewAreaInput(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddArea}
                leftIcon={<Plus className="w-4 h-4" weight="bold" />}
              >
                Add area
              </Button>
            </div>
          </div>

          {/* Skills Catalog */}
          <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="border-b border-[#D5DAE1] pb-3">
              <h3 className="font-display text-xl font-bold text-ink-primary">
                Volunteer skills catalog
              </h3>
              <p className="text-[13px] text-ink-secondary mt-0.5">
                Recognized proficiencies available during volunteer onboarding and roster matching.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[13px] font-medium px-3 py-1.5 bg-canvas-subdued rounded-[6px] border border-[#D5DAE1] text-ink-primary flex items-center gap-2"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-ink-tertiary hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" weight="bold" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Input
                placeholder="e.g. Wildfire Management"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddSkill}
                leftIcon={<Plus className="w-4 h-4" weight="bold" />}
              >
                Add skill
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveAreasAndSkills}
              isLoading={isSaving}
              leftIcon={<FloppyDisk className="w-4 h-4" weight="bold" />}
            >
              Save areas and skills
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: Certificate Text Template */}
      {activeTab === 'certificates' && (
        <form onSubmit={handleSaveCertTemplate} className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#D5DAE1] pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Certificate template and signatory
            </h3>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              Customize the formal endorsement text and authorized signatory printed on volunteer certificates.
            </p>
          </div>

          <Input
            label="Authorized signatory name and title"
            value={signatory}
            onChange={(e) => setSignatory(e.target.value)}
            hint="Printed on all verified certificates of membership and rank advancement."
            required
          />

          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-ink-primary">
              Endorsement statement
            </label>
            <textarea
              rows={4}
              value={certTemplateText}
              onChange={(e) => setCertTemplateText(e.target.value)}
              className="w-full bg-white text-ink-primary font-sans text-sm border border-[#475569] rounded-[8px] p-3 outline-none focus:ring-1 focus:ring-ink-primary"
              required
            />
          </div>

          <div className="pt-3 border-t border-[#D5DAE1] flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<FloppyDisk className="w-4 h-4" weight="bold" />}
            >
              Save certificate text
            </Button>
          </div>
        </form>
      )}

      {/* TAB 4: Email Template Editor with Live Preview */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Form */}
          <form onSubmit={handleSaveTemplate} className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
            <div className="border-b border-[#D5DAE1] pb-3">
              <h3 className="font-display text-xl font-bold text-ink-primary">
                Email template editor
              </h3>
              <p className="text-[13px] text-ink-secondary mt-0.5">
                Select an automated notification template to edit its subject and copy.
              </p>
            </div>

            {/* Template Selector */}
            <div className="space-y-1">
              <label className="block text-[13px] font-semibold text-ink-primary">
                Select template
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="w-full bg-white text-ink-primary font-sans text-sm border border-[#475569] rounded-[8px] p-2.5 outline-none font-medium focus:ring-1 focus:ring-ink-primary"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Subject line"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label className="block text-[13px] font-semibold text-ink-primary">
                Email body text
              </label>
              <textarea
                rows={10}
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                className="w-full bg-white text-ink-primary font-mono text-[13px] border border-[#475569] rounded-[8px] p-3 outline-none leading-relaxed focus:ring-1 focus:ring-ink-primary"
                required
              />
            </div>

            {activeTemplate?.variables && (
              <div className="p-3 bg-canvas-subdued/40 border border-[#D5DAE1] rounded-[8px] space-y-1 text-[13px]">
                <span className="font-mono text-[13px] font-semibold text-ink-tertiary block">
                  Available template variables:
                </span>
                <div className="flex flex-wrap gap-1 font-mono text-[13px]">
                  {activeTemplate.variables.map((v) => (
                    <span key={v} className="bg-white px-1.5 py-0.5 border border-[#D5DAE1] rounded-[4px] text-ink-primary">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#D5DAE1] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                leftIcon={<FloppyDisk className="w-4 h-4" weight="bold" />}
              >
                Save template
              </Button>
            </div>
          </form>

          {/* Live Interactive Preview Card */}
          <div className="space-y-3">
            <div className="border-b border-[#D5DAE1] pb-2 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-ink-primary flex items-center gap-2">
                <Eye className="w-5 h-5 text-role-teamlead" weight="bold" />
                Live inbox preview
              </h3>
              <span className="font-mono text-[13px] font-medium text-role-teamlead bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-[4px]">
                Interactive sample
              </span>
            </div>

            <div className="border border-[#D5DAE1] rounded-[10px] bg-white shadow-sm overflow-hidden">
              {/* Mail client mock top rail */}
              <div className="bg-canvas-subdued/40 border-b border-[#D5DAE1] p-3 space-y-1 font-mono text-[13px]">
                <div className="flex justify-between text-[13px] text-ink-tertiary">
                  <span>From: VTS System Notifications &lt;no-reply@vts.et&gt;</span>
                  <span>Just now</span>
                </div>
                <div className="text-[13px] text-ink-tertiary">
                  To: Dawit Bekele &lt;dawit.bekele@example.et&gt;
                </div>
                <div className="font-sans font-bold text-ink-primary text-sm pt-1 border-t border-[#D5DAE1] mt-1">
                  Subject: {renderPreviewSubject()}
                </div>
              </div>

              {/* Rendered Email Body */}
              <div className="p-6 font-sans text-sm text-ink-primary space-y-4 whitespace-pre-wrap leading-relaxed bg-white min-h-[300px]">
                {renderPreviewBody()}
              </div>

              <div className="p-3 bg-canvas-subdued/40 border-t border-[#D5DAE1] text-[13px] text-ink-tertiary font-mono text-center">
                This preview updates in real-time as you type in the editor.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Demo Tools */}
      {activeTab === 'demo' && (
        <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#D5DAE1] pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Demo environment and reset tools
            </h3>
            <p className="text-[13px] text-ink-secondary mt-0.5">
              Tools to reset persistent mock storage back to initial seed data for demo presentations.
            </p>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-[8px] space-y-2 text-sm">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Warning className="w-5 h-5 text-amber-800" weight="fill" />
              <span>Full demo state reset</span>
            </div>
            <p className="text-amber-800 leading-relaxed text-[13px]">
              Clicking reset will clear any newly created test accounts, approved hours, or promotion decisions and restore the canonical 7 demo accounts, seed payments (including the review exceptions and duplicate transfers), and baseline activities.
            </p>
          </div>

          <div className="pt-2 flex justify-start">
            <Button
              type="button"
              variant="danger"
              size="lg"
              onClick={handleResetDemoData}
              leftIcon={<ArrowClockwise className="w-5 h-5" weight="bold" />}
            >
              Reset all demo data to baseline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
