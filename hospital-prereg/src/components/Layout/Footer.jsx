// src/components/Layout/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="mt-8 pb-10 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
      <div className="flex items-center gap-6">
        <a className="hover:text-primary transition-colors" href="#">
          Privacy Policy
        </a>
        <a className="hover:text-primary transition-colors" href="#">
          Terms of Service
        </a>
        <a className="hover:text-primary transition-colors" href="#">
          Contact Hospital
        </a>
      </div>
      <p>© {new Date().getFullYear()} HealthCare Portal. Secure HIPAA Compliant System.</p>
    </footer>
  );
}

export default Footer;