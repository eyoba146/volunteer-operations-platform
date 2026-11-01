const fs = require('fs');
const path = 'client/src/pages/applicant/ApplicantPaymentPage.tsx';
let code = fs.readFileSync(path, 'utf8');

// Replace celebration banner
const oldBannerRegex = /\{\/\* Celebration Banner \*\/\}[\s\S]*?\{\/\* Two-Column Grid: Volunteer Pass Card & Receipt \*\/\}/;
const newBanner = `{/* Celebration Banner */}
        <MomentOverlay
          show={showMoment}
          onDismiss={() => setShowMoment(false)}
          type="payment"
          title="Welcome to the trail!"
          subtitle="Your registration fee is confirmed. You are now an active Member."
          primaryActionLabel="Explore activities →"
          onPrimaryAction={() => {
            setShowMoment(false);
            navigate('/volunteer/activities');
          }}
        />

        <div className="relative overflow-hidden rounded-[16px] bg-[#F7F8FA] p-8 text-center space-y-3 border-none">
          <TopoBackdrop color="#16A34A" opacity={0.08} />
          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 mx-auto bg-role-volunteer text-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10" weight="fill" />
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary tracking-tight">
              Welcome to the trail!
            </h1>
            <p className="font-sans text-base text-ink-secondary max-w-lg mx-auto leading-relaxed">
              Your registration fee of <strong className="font-bold text-ink-primary">ETB 200.00</strong> has been confirmed. You are now an active <strong className="text-role-volunteer">Member</strong> of the Volunteer Tracking System.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/volunteer/home')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Open my volunteer space
              </Button>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Volunteer Pass Card & Receipt */}`;

if (oldBannerRegex.test(code)) {
  code = code.replace(oldBannerRegex, newBanner);
}

// Replace receipt card
code = code.replace(
  'bg-white p-6 md:p-8 space-y-5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-[16px] text-left',
  'relative overflow-hidden bg-white p-6 md:p-8 space-y-5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-[16px] text-left border-none'
);

// Replace borders in payment page
code = code.replace(/border border-\[#D5DAE1\] bg-white rounded-\[10px\] p-6 space-y-5/g, 'rounded-[16px] bg-[#F7F8FA] p-6 space-y-5 border-none');
code = code.replace(/border border-\[#D5DAE1\] bg-white rounded-\[10px\] p-6 md:p-8 space-y-6/g, 'rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 md:p-8 space-y-6 border-none');
code = code.replace(/border-b border-\[#D5DAE1\]/g, 'border-b border-[#EDEFF2]');
code = code.replace(/border-t border-\[#D5DAE1\]/g, 'border-t border-[#EDEFF2]');

fs.writeFileSync(path, code, 'utf8');
console.log('ApplicantPaymentPage.tsx successfully updated!');

