import React from 'react';
import { Languages, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full border border-[#dadce0] bg-[#f8f9fa] shadow-2xs transition-colors ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
            language === 'en'
              ? 'bg-[#1a73e8] text-white shadow-xs'
              : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed]/50'
          }`}
          title="Switch to English"
        >
          <Languages className="w-3 h-3" />
          <span>EN</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
            language === 'hi'
              ? 'bg-[#1a73e8] text-white shadow-xs font-bold'
              : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed]/50'
          }`}
          title="हिन्दी में बदलें (Switch to Hindi)"
        >
          <span>हिन्दी</span>
        </button>
      </div>
    </div>
  );
};
