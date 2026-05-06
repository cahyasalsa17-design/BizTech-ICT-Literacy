import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Award, Download, Printer, Share2, ArrowLeft, ShieldCheck, GraduationCap } from 'lucide-react';
import { UserProfile } from '../types';

interface CertificateProps {
  userProfile: UserProfile | null;
  onBack: () => void;
}

export default function Certificate({ userProfile, onBack }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!userProfile) return null;

  const completionDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Profil
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer size={18} />
            Cetak
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={certificateRef}
        className="certificate-container relative bg-white border-[16px] border-double border-violet-950 p-8 sm:p-16 md:p-24 shadow-2xl overflow-hidden print:shadow-none print:border-violet-950 rounded-sm"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-20" />
        <div className="absolute inset-0 border-2 border-slate-100 m-4 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Logo/Header */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-violet-950 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <GraduationCap size={32} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-violet-950 leading-none tracking-tighter">BizTech</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ICT ACADEMY</p>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-violet-950 mb-6 tracking-tight uppercase">
            Sertifikat Kelulusan
          </h2>
          
          <div className="w-48 h-1.5 bg-gradient-to-r from-violet-600 to-cyan-500 mb-10" />

          <p className="text-xl md:text-2xl text-slate-500 font-medium italic mb-12">
            Penghargaan ini diberikan kepada:
          </p>

          <h3 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
            {userProfile.displayName}
          </h3>

          <p className="max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed mb-20 font-medium">
            Atas keberhasilannya menyelesaikan program 
            <span className="text-violet-600 font-black"> LITERASI ICT BizTech</span>. 
            Telah mendemonstrasikan kompetensi yang sangat baik dalam penguasaan perangkat lunak bisnis, 
            keamanan digital, dan komunikasi profesional di era transformasi digital.
          </p>

          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 mt-12">
            {/* Seal */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 bg-violet-950 rounded-full flex items-center justify-center relative shadow-2xl">
                <ShieldCheck size={56} className="text-white" />
                <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-full animate-spin-slow" />
              </div>
              <p className="text-[10px] font-black text-violet-950 mt-6 tracking-[0.3em] uppercase">Authenticated by BizTech</p>
            </div>

            {/* Date & ID */}
            <div className="flex flex-col items-center md:items-start text-slate-500 gap-2">
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Terbit</p>
                <p className="font-mono font-bold text-slate-800">{completionDate}</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Sertifikat</p>
                <p className="font-mono text-sm text-violet-600 font-bold tracking-wider">BT-REF-{userProfile.uid.slice(0, 12).toUpperCase()}</p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="flex flex-col items-center min-w-[220px]">
              <div className="h-20 w-40 border-b-2 border-slate-900 mb-3 flex items-end justify-center pb-2">
                <span className="font-serif italic text-2xl text-slate-800">BizTech Team</span>
              </div>
              <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Instruktur Utama</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Learning Div.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-container, .certificate-container * {
            visibility: visible;
          }
          .certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 8px solid #312e81 !important;
          }
          .no-print {
            display: none !important;
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
