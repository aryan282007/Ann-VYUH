import React from 'react';
import { useLanguage, SUPPORTED_LANGS } from '../context/LanguageContext.jsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex min-h-screen w-full font-sans">
      
      {/* Left Side - Brand & Presentation (Hidden on small mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative overflow-hidden bg-[#EAF2E8]">
        {/* Decorative sloped background shape */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-[#C2DAC0]/40 transform -skew-y-3 origin-bottom-right scale-110"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Sprout Logo */}
          <div className="bg-white rounded-3xl shadow-xl w-32 h-32 flex items-center justify-center mb-8">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary">
              <path d="M12 21V11M12 11C12 11 9 11 6 8C3 5 3 2 3 2C3 2 6 2 9 5C12 8 12 11 12 11ZM12 11C12 11 15 13 17.5 13C20 13 22 11 22 11C22 11 22 14 19 17C16 20 12 21 12 21Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 21H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          
          <h1 className="text-4xl font-black mb-4">
            <span className="text-primary-dark">अन्न</span> <span className="text-accent">VYUH</span>
          </h1>
          
          <p className="text-lg font-medium text-ink/80 max-w-md mb-10 leading-relaxed">
            अन्न VYUH — जहाँ हर फसल का समय आता है, और हर किसान को उसका मूल्य मिलता है।
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="bg-white/80 backdrop-blur px-5 py-2 rounded-full text-sm font-bold text-primary-dark shadow-sm border border-white">स्मार्ट शेड्यूलिंग</span>
            <span className="bg-white/80 backdrop-blur px-5 py-2 rounded-full text-sm font-bold text-primary-dark shadow-sm border border-white">पारदर्शी खरीद</span>
            <span className="bg-white/80 backdrop-blur px-5 py-2 rounded-full text-sm font-bold text-primary-dark shadow-sm border border-white">त्वरित भुगतान</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-white">
        


        {/* Back Link for mobile */}
        <div className="absolute top-6 left-6 z-20 lg:hidden">
          <Link to="/" className="text-primary font-bold hover:underline">&larr; {t('common.back')}</Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 xl:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
          >
            {children}
          </motion.div>
        </div>

        {/* Footer Text */}
        <div className="py-6 text-center text-xs text-muted font-medium">
          <p>Smart India Hackathon 2026 Prototype</p>
          <p>Problem Statement: SIH26032</p>
        </div>
      </div>

    </div>
  );
}

