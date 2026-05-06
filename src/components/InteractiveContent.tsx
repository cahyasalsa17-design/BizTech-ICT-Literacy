import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { CheckCircle2, AlertCircle, RefreshCw, Move } from 'lucide-react';

// --- Simulation 1: ICT Impact Slider ---
export function ICTImpactSimulation() {
  const [efficiency, setEfficiency] = useState(20);
  const throughput = Math.round(100 * (1 + (efficiency / 100)));
  const costReduction = Math.round(efficiency * 0.8);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 my-8">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900 dark:text-white">Simulasi Keuntungan BizTech</h4>
        <div className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-xs font-black uppercase tracking-widest">Interaktif</div>
      </div>
      
      <p className="text-sm text-slate-500 font-medium italic">Geser slider untuk melihat bagaimana otomatisasi teknologi (ICT) meningkatkan kapasitas produksi dan menghemat biaya operasional tokomu.</p>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm font-black mb-3">
            <span className="text-slate-600 dark:text-slate-400 uppercase tracking-widest">Tingkat Digitalisasi</span>
            <span className="text-violet-600 font-black">{efficiency}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={efficiency} 
            onChange={(e) => setEfficiency(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Produksi</p>
            <p className="text-3xl font-black text-emerald-500">{throughput} <span className="text-sm font-medium text-slate-400">Unit</span></p>
            <p className="text-[10px] text-emerald-600 font-black mt-1">+{efficiency}% EFISIENSI</p>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hemat Biaya</p>
            <p className="text-3xl font-black text-violet-600">{costReduction}%</p>
            <p className="text-[10px] text-violet-500 font-black mt-1">BIAYA OPERASIONAL</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Interaction 2: Drag and Drop Matching ---
interface MatchItem {
  id: string;
  term: string;
  definitionId: string;
}

interface DefinitionItem {
  id: string;
  text: string;
}

export function MatchICTComponents() {
  const [items] = useState<MatchItem[]>([
    { id: '1', term: 'SaaS', definitionId: 'd1' },
    { id: '2', term: 'Marketplace', definitionId: 'd2' },
    { id: '3', term: 'On-Demand', definitionId: 'd3' },
    { id: '4', term: 'Fintech', definitionId: 'd4' },
  ]);

  const [definitions, setDefinitions] = useState<DefinitionItem[]>([
    { id: 'd2', text: 'Platform tempat berkumpulnya banyak penjual' },
    { id: 'd4', text: 'Teknologi pendukung layanan keuangan' },
    { id: 'd1', text: 'Aplikasi berbasis langganan di cloud' },
    { id: 'd3', text: 'Layanan yang dipesan saat dibutuhkan saja' },
  ]);

  const [result, setResult] = useState<'idle' | 'success' | 'fail'>('idle');

  const checkMatches = () => {
    const isCorrect = items.every((item, index) => item.definitionId === definitions[index].id);
    setResult(isCorrect ? 'success' : 'fail');
  };

  const shuffle = () => {
    setDefinitions([...definitions].sort(() => Math.random() - 0.5));
    setResult('idle');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">Cocokkan Komponen ICT</h4>
          <p className="text-xs text-slate-500">Urutkan definisi di sebelah kanan agar sesuai dengan istilah di kiri.</p>
        </div>
        <button 
          onClick={shuffle}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex gap-4">
        {/* Static Terms */}
        <div className="flex-1 space-y-3">
          {items.map(item => (
            <div key={item.id} className="h-14 flex items-center px-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-300">
              {item.term}
            </div>
          ))}
        </div>

        {/* Draggable Definitions */}
        <Reorder.Group 
          axis="y" 
          values={definitions} 
          onReorder={setDefinitions}
          className="flex-[2] space-y-3"
        >
          {definitions.map(def => (
            <Reorder.Item 
              key={def.id} 
              value={def}
              className="h-14 flex items-center justify-between px-4 bg-indigo-600 text-white rounded-xl cursor-grab active:cursor-grabbing shadow-lg shadow-indigo-100 dark:shadow-none font-medium text-sm"
            >
              <span className="line-clamp-1">{def.text}</span>
              <Move size={14} className="opacity-50" />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {result === 'success' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle2 size={18} /> Kerja Bagus! Semua Tepat.
            </motion.div>
          )}
          {result === 'fail' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <AlertCircle size={18} /> Belum Tepat, Coba Urutkan Lagi.
            </motion.div>
          )}
        </div>
        <button 
          onClick={checkMatches}
          className="px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform"
        >
          Periksa Jawaban
        </button>
      </div>
    </div>
  );
}
