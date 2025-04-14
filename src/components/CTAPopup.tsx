interface CTAPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CTAPopup({ isOpen, onClose }: CTAPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-workbrand-blue/70 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="max-w-md w-full glass rounded-xl overflow-hidden shadow-xl p-8 mx-4 border border-white/20 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-4">
          All Features Unlocked
        </h2>
        <p className="text-white/80 mb-6">
          You already have access to all premium features. As a Workbrand Premium user, you have full access to all analysis and comparison tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-[#2F3295] to-[#FE619E] text-white py-3 px-4 rounded-lg text-center font-medium hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 