import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  ChevronRight, 
  BookOpen, 
  HelpCircle,
  PlusCircle,
  CloudLightning,
  RefreshCw
} from 'lucide-react';
import { ModuleContent } from '../types';
import { getModules, addModule, updateModule, deleteModule, seedInitialModules } from '../services/contentService';

export default function TeacherDashboard() {
  const [modules, setModules] = useState<ModuleContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingModule, setEditingModule] = useState<Partial<ModuleContent> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setIsLoading(true);
    const data = await getModules();
    setModules(data);
    setIsLoading(false);
  };

  const handleSeed = async () => {
    if (!window.confirm("Ini akan mengunggah materi default ke database cloud. Lanjutkan?")) return;
    setIsSeeding(true);
    try {
      await seedInitialModules();
      await fetchModules();
      alert("Database berhasil disinkronkan!");
    } catch (error) {
      console.error(error);
      alert("Gagal sinkronisasi. Pastikan Anda memiliki akses Guru.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSave = async () => {
    if (!editingModule) return;
    
    try {
      if (editingModule.id) {
        await updateModule(editingModule.id, editingModule);
      } else {
        await addModule(editingModule as any);
      }
      setEditingModule(null);
      setIsAdding(false);
      fetchModules();
    } catch (error) {
      alert("Gagal menyimpan perubahan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus modul ini?")) {
      await deleteModule(id);
      fetchModules();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Dashboard Guru</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Kelola materi pembelajaran dan kuis untuk siswa SMK.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex items-center gap-2 px-6 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSeeding ? <RefreshCw size={18} className="animate-spin text-violet-600" /> : <CloudLightning size={18} className="text-violet-600" />}
            Sinkronkan Cloud
          </button>
          <button 
            onClick={() => {
              setEditingModule({
                title: '',
                description: '',
                duration: '',
                content: '',
                subTopics: [{ title: '', text: '' }],
                quiz: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
              });
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-violet-700 transition-all shadow-xl shadow-violet-200/50 dark:shadow-none hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Tambah Modul
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {modules.map(module => (
          <div 
            key={module.id}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-xl hover:shadow-violet-200/20 transition-all gap-4"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200/50 dark:shadow-none">
                <BookOpen size={32} />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white mb-2">{module.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-white bg-violet-600 px-3 py-1 rounded-full uppercase tracking-widest">
                    {module.duration}
                  </span>
                  <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/40 px-3 py-1 rounded-full uppercase tracking-widest border border-violet-100 dark:border-violet-800">
                    {module.quiz.length} Soal Kuis
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button 
                onClick={() => setEditingModule(module)}
                className="p-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-100 dark:border-slate-800 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800 transition-all"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={() => handleDelete(module.id)}
                className="p-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-100 dark:border-slate-800 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingModule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingModule(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {isAdding ? 'Tambah Modul Baru' : 'Edit Modul'}
                </h2>
                <button 
                  onClick={() => setEditingModule(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* Basic Info */}
                <section className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={16} /> Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-1">Judul Modul</label>
                      <input 
                        type="text"
                        value={editingModule.title}
                        onChange={e => setEditingModule({...editingModule, title: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="Contoh: Dasar Keamanan Siber"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 ml-1">Durasi</label>
                      <input 
                        type="text"
                        value={editingModule.duration}
                        onChange={e => setEditingModule({...editingModule, duration: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="Contoh: 60 Menit"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">Deskripsi Singkat</label>
                    <textarea 
                      value={editingModule.description}
                      onChange={e => setEditingModule({...editingModule, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[100px]"
                      placeholder="Ringkasan apa yang akan dipelajari..."
                    />
                  </div>
                </section>

                {/* Sub Topics */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ChevronRight size={16} /> Sub-Topik Materi
                    </h3>
                    <button 
                      onClick={() => setEditingModule({
                        ...editingModule, 
                        subTopics: [...(editingModule.subTopics || []), { title: '', text: '' }]
                      })}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <PlusCircle size={14} /> Tambah Sub-Topik
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {editingModule.subTopics?.map((topic, i) => (
                      <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-4 relative group">
                        <button 
                          onClick={() => {
                            const newTopics = [...(editingModule.subTopics || [])];
                            newTopics.splice(i, 1);
                            setEditingModule({...editingModule, subTopics: newTopics});
                          }}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Judul Sub-Topik {i + 1}</label>
                          <input 
                            type="text"
                            value={topic.title}
                            onChange={e => {
                              const newTopics = [...(editingModule.subTopics || [])];
                              newTopics[i].title = e.target.value;
                              setEditingModule({...editingModule, subTopics: newTopics});
                            }}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-700 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Isi Materi</label>
                          <textarea 
                            value={topic.text}
                            onChange={e => {
                              const newTopics = [...(editingModule.subTopics || [])];
                              newTopics[i].text = e.target.value;
                              setEditingModule({...editingModule, subTopics: newTopics});
                            }}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-700 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm min-h-[80px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quiz Questions */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <HelpCircle size={16} /> Pertanyaan Kuis
                    </h3>
                    <button 
                      onClick={() => setEditingModule({
                        ...editingModule, 
                        quiz: [...(editingModule.quiz || []), { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
                      })}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <PlusCircle size={14} /> Tambah Pertanyaan
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingModule.quiz?.map((q, i) => (
                      <div key={i} className="p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black bg-slate-900 text-white px-2 py-1 rounded">SOAL {i + 1}</span>
                          <button 
                            onClick={() => {
                              const newQuiz = [...(editingModule.quiz || [])];
                              newQuiz.splice(i, 1);
                              setEditingModule({...editingModule, quiz: newQuiz});
                            }}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Pertanyaan</label>
                          <input 
                            type="text"
                            value={q.question}
                            onChange={e => {
                              const newQuiz = [...(editingModule.quiz || [])];
                              newQuiz[i].question = e.target.value;
                              setEditingModule({...editingModule, quiz: newQuiz});
                            }}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Opsi {optIdx + 1}</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="radio" 
                                  name={`correct-${i}`}
                                  checked={q.correctAnswer === optIdx}
                                  onChange={() => {
                                    const newQuiz = [...(editingModule.quiz || [])];
                                    newQuiz[i].correctAnswer = optIdx;
                                    setEditingModule({...editingModule, quiz: newQuiz});
                                  }}
                                  className="w-4 h-4 accent-emerald-500"
                                />
                                <input 
                                  type="text"
                                  value={opt}
                                  onChange={e => {
                                    const newQuiz = [...(editingModule.quiz || [])];
                                    newQuiz[i].options[optIdx] = e.target.value;
                                    setEditingModule({...editingModule, quiz: newQuiz});
                                  }}
                                  className={`w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg outline-none text-xs ${
                                    q.correctAnswer === optIdx ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-100 dark:border-slate-700'
                                  }`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-4">
                <button 
                  onClick={() => setEditingModule(null)}
                  className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-10 py-3 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
                >
                  <Save size={20} />
                  Simpan Perubahan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
