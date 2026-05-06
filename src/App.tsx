import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  Award, 
  Search, 
  Menu, 
  X, 
  Home as HomeIcon,
  HelpCircle,
  BookText,
  Info,
  ArrowLeft,
  GraduationCap,
  LogOut,
  Mail,
  User as UserIcon,
  Loader2,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { GLOSSARY } from './constants';
import { AppView, ModuleContent, UserProfile } from './types';
import Auth from './components/Auth';
import AIAssistant from './components/AIAssistant';
import MindMap from './components/MindMap';
import TeacherDashboard from './components/TeacherDashboard';
import Certificate from './components/Certificate';
import { getModules } from './services/contentService';
import { ICTImpactSimulation, MatchICTComponents } from './components/InteractiveContent';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [modules, setModules] = useState<ModuleContent[]>([]);
  const [selectedModule, setSelectedModule] = useState<ModuleContent | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [moduleProgress, setModuleProgress] = useState<Record<string, number[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  // Theme Logic
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth & Sync Logic
  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await getModules();
      setModules(data);
    };
    fetchInitialData();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch existing scores from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            setUserProfile(data);
            setQuizScores(data.scores || {});
            setModuleProgress(data.progress || {} as any);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        setQuizScores({});
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  const handleAuthSuccess = () => {
    setView('module-list');
  };

  // Handle back button behavior
  useEffect(() => {
    const handlePopState = () => {
      if (view !== 'home') {
        setView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view]);

  const navigateTo = (newView: AppView, module?: ModuleContent) => {
    // Protected views
    const protectedViews: AppView[] = ['module-list', 'module-detail', 'quiz', 'profile', 'teacher-dashboard', 'certificate'];
    
    if (protectedViews.includes(newView) && !user) {
      setView('auth');
      return;
    }

    setView(newView);
    if (module) setSelectedModule(module);
    window.scrollTo(0, 0);
    setIsSidebarOpen(false);
  };

  const getStats = () => {
    const completedModules = Object.keys(quizScores).length;
    const totalPoints = Object.values(quizScores).reduce((acc, score) => acc + (score * 10), 0);
    const avgScore = completedModules > 0 ? Math.round(Object.values(quizScores).reduce((acc, score) => acc + score, 0) / completedModules) : 0;
    
    const totalPossibleSteps = modules.reduce((acc, m) => acc + m.subTopics.length + 1, 0);
    const totalCompletedSteps = Object.values(moduleProgress).reduce((acc, steps) => acc + (steps?.length || 0), 0);
    const overallProgress = totalPossibleSteps > 0 ? Math.min(100, Math.round((totalCompletedSteps / totalPossibleSteps) * 100)) : 0;

    return { completedModules, totalPoints, avgScore, overallProgress };
  };

  const stats = getStats();

  const getScore = (moduleId: string) => quizScores[moduleId] || 0;

  const updateProgress = async (moduleId: string, stepIndex: number) => {
    if (!user) return;
    const current = moduleProgress[moduleId] || [];
    if (current.includes(stepIndex)) return;

    const nextProgress = [...current, stepIndex];
    setModuleProgress(prev => ({ ...prev, [moduleId]: nextProgress }));

    try {
      const path = `users/${user.uid}`;
      await updateDoc(doc(db, 'users', user.uid), {
        [`progress.${moduleId}`]: nextProgress
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${theme === 'dark' ? 'dark bg-[#020617]' : 'bg-slate-50'}`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/20 group-hover:scale-105 transition-transform">
              <GraduationCap size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-none text-slate-900 dark:text-white">BizTech</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ICT Literacy</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavButton active={view === 'home'} onClick={() => navigateTo('home')} icon={<HomeIcon size={18} />} label="Beranda" />
            <NavButton active={view === 'module-list' || view === 'module-detail'} onClick={() => navigateTo('module-list')} icon={<BookOpen size={18} />} label="Materi" />
            {userProfile?.role === 'teacher' && (
              <NavButton active={view === 'teacher-dashboard'} onClick={() => navigateTo('teacher-dashboard')} icon={<GraduationCap size={18} />} label="Dashboard Guru" />
            )}
            <NavButton active={view === 'glossary'} onClick={() => navigateTo('glossary')} icon={<BookText size={18} />} label="Glosarium" />
            <NavButton active={view === 'about'} onClick={() => navigateTo('about')} icon={<Info size={18} />} label="Tentang" />
            
            {user && (
              <div className="flex items-center gap-4 px-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Skor</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{stats.avgScore}%</p>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Poin</p>
                  <p className="text-xs font-black text-violet-600 leading-none">{stats.totalPoints}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              title={theme === 'light' ? "Mode Gelap" : "Mode Terang"}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => navigateTo('profile')}
                  className="hidden md:flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-800 cursor-pointer group"
                >
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none group-hover:text-violet-600 transition-colors uppercase tracking-tight">{user.displayName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate max-w-[120px] tracking-wider">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px] shadow-lg shadow-violet-200 dark:shadow-none group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-[10px] overflow-hidden bg-white dark:bg-slate-900">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}&backgroundColor=7c3aed,4f46e5`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  title="Keluar"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigateTo('auth')}
                className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 dark:shadow-none hover:-translate-y-0.5"
              >
                <UserIcon size={18} />
                Masuk
              </button>
            )}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 z-[70] shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-2xl dark:text-white tracking-tighter uppercase">Menu</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full dark:text-slate-400">
                  <X size={24} />
                </button>
              </div>

              {user && (
                <div className="mb-8 p-4 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-3xl border border-violet-100 dark:border-violet-900/30 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px] shadow-lg shadow-violet-200 dark:shadow-none">
                    <div className="w-full h-full rounded-[14px] overflow-hidden bg-white dark:bg-slate-900">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}&backgroundColor=7c3aed,4f46e5`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">{user.displayName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-wider mt-1">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <MobileNavButton active={view === 'home'} onClick={() => navigateTo('home')} icon={<HomeIcon size={20} />} label="Beranda" />
                <MobileNavButton active={view === 'module-list'} onClick={() => navigateTo('module-list')} icon={<BookOpen size={20} />} label="Materi Pembelajaran" />
                {userProfile?.role === 'teacher' && (
                  <MobileNavButton active={view === 'teacher-dashboard'} onClick={() => navigateTo('teacher-dashboard')} icon={<GraduationCap size={20} />} label="Dashboard Guru" />
                )}
                <MobileNavButton active={view === 'profile'} onClick={() => navigateTo('profile')} icon={<UserIcon size={20} />} label="Profil Saya" />
                <MobileNavButton active={view === 'glossary'} onClick={() => navigateTo('glossary')} icon={<BookText size={20} />} label="Glosarium Istilah" />
                <MobileNavButton active={view === 'about'} onClick={() => navigateTo('about')} icon={<Info size={20} />} label="Tentang Modul" />
                
                {user && (
                   <div className="px-6 py-4 mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress Belajar</span>
                       <span className="text-xs font-black text-violet-600 dark:text-violet-400">{stats.overallProgress}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${stats.overallProgress}%` }}
                         className="h-full bg-violet-600"
                       />
                     </div>
                   </div>
                )}

                <button 
                  onClick={() => signOut(auth)}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-all dark:hover:bg-red-900/20"
                >
                  <LogOut size={20} /> Keluar
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                 <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
                </button>
              </div>
              
              <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
                {user ? (
                  <div className="space-y-4">
                    <div 
                      onClick={() => navigateTo('profile')}
                      className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-all"
                    >
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <LogOut size={20} />
                      Keluar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => navigateTo('auth')}
                    className="w-full flex items-center gap-3 p-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                  >
                    <UserIcon size={20} />
                    Masuk / Daftar
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <p className="text-slate-500 font-medium">Memuat data...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Home onStart={() => navigateTo('module-list')} stats={user ? stats : null} />
              </motion.div>
            )}
            {view === 'auth' && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Auth onSuccess={handleAuthSuccess} />
              </motion.div>
            )}
            {view === 'module-list' && (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ModuleList 
                  modules={modules}
                  onSelect={(m) => navigateTo('module-detail', m)} 
                  scores={quizScores} 
                  progress={moduleProgress}
                  stats={user ? stats : null}
                />
              </motion.div>
            )}
            {view === 'module-detail' && selectedModule && (
              <motion.div key={selectedModule.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ModuleDetail 
                  module={selectedModule} 
                  onBack={() => setView('module-list')}
                  onStartQuiz={() => setView('quiz')}
                  onProgress={(step) => updateProgress(selectedModule.id, step)}
                  savedProgress={moduleProgress[selectedModule.id] || []}
                />
              </motion.div>
            )}
            {view === 'quiz' && selectedModule && (
              <motion.div key={`quiz-${selectedModule.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Quiz 
                  module={selectedModule} 
                  onComplete={async (score) => {
                    const newScores = { ...quizScores, [selectedModule.id]: score };
                    setQuizScores(newScores);
                    
                    if (auth.currentUser) {
                      try {
                        const path = `users/${auth.currentUser.uid}`;
                        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                          [`scores.${selectedModule.id}`]: score
                        });
                      } catch (err) {
                        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}`);
                      }
                    }
                    
                    setView('module-list');
                    window.scrollTo(0, 0);
                  }}
                  onBack={() => setView('module-detail')}
                />
              </motion.div>
            )}
            {view === 'glossary' && (
              <motion.div key="glossary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Glossary />
              </motion.div>
            )}
            {view === 'about' && (
              <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <About modules={modules} />
              </motion.div>
            )}
            {view === 'profile' && user && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Profile 
                  userProfile={userProfile} 
                  quizScores={quizScores} 
                  moduleProgress={moduleProgress} 
                  modules={modules} 
                  onClaimCertificate={() => navigateTo('certificate')}
                />
              </motion.div>
            )}
            {view === 'certificate' && user && (
              <motion.div key="certificate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Certificate userProfile={userProfile} onBack={() => navigateTo('profile')} />
              </motion.div>
            )}
            {view === 'teacher-dashboard' && userProfile?.role === 'teacher' && (
              <motion.div key="teacher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TeacherDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 BizTech ICT Literacy - SMK Mandiri</p>
          <p className="mt-1">Dibuat untuk media pembelajaran interaktif siswa SMK</p>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
}

// Sub-components
function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-1 py-1 border-b-2 transition-all cursor-pointer relative ${
        active 
          ? 'border-violet-600 text-violet-600 dark:text-violet-400 font-bold' 
          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute -inset-x-2 -inset-y-1 bg-violet-400/5 dark:bg-violet-400/10 rounded-lg -z-10 blur-sm"
        />
      )}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
        active 
          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function UserStatsBar({ stats }: { stats: { completedModules: number, totalPoints: number, avgScore: number, overallProgress: number } }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center gap-4 group hover:border-violet-300 transition-all">
        <div className="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
          <BookOpen size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Modul</p>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">{stats.completedModules}</p>
        </div>
      </div>
      
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center gap-4 group hover:border-violet-300 transition-all">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
          <Award size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Rata-Skor</p>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">{stats.avgScore}%</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center gap-4 group hover:border-violet-300 transition-all">
        <div className="w-12 h-12 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center shrink-0">
          <Zap size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Poin</p>
          <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">{stats.totalPoints}</p>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-center group hover:border-violet-300 transition-all">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress Total</p>
          <span className="text-xs font-black text-violet-600 dark:text-violet-400">{stats.overallProgress}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.overallProgress}%` }}
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}

function Home({ onStart, stats }: { onStart: () => void, stats: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto py-12 md:py-24"
    >
      {stats && (
        <div className="mb-12">
          <UserStatsBar stats={stats} />
        </div>
      )}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center lg:text-left px-2 sm:px-0">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50 rounded-full text-xs sm:text-sm font-black tracking-widest mb-6 uppercase"
          >
            BizTech ICT Literacy
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
            Literasi ICT dalam <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">Dunia Bisnis</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Selamat datang di media pembelajaran mandiri untuk siswa SMK Kelas 11. 
            Modul ini dirancang untuk membekali kamu dengan pemahaman mendalam tentang 
            pemanfaatan teknologi informasi di dunia bisnis modern.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-violet-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-violet-700 hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] transition-all cursor-pointer group hover:-translate-y-1"
            >
              Mulai Belajar Sekarang
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="user" />
                  </div>
                ))}
              </div>
              <span>Belajar Bersama</span>
            </div>
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-md lg:max-w-none">
          <div className="relative z-10 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 backdrop-blur-3xl p-1 rounded-[3rem] shadow-2xl border border-white/10 transform lg:rotate-3 transition-transform hover:rotate-0 duration-500">
            <div className="bg-white/80 dark:bg-slate-900/90 rounded-[2.8rem] p-8 sm:p-10 backdrop-blur-md">
              <div className="space-y-6">
                <FeatureCard 
                  icon={<BookOpen className="text-amber-500" />} 
                  title="5 Modul Utama" 
                  desc="Materi lengkap kurikulum"
                  color="bg-amber-500/10"
                />
                <FeatureCard 
                  icon={<Award className="text-emerald-500" />} 
                  title="Sertifikat Belajar" 
                  desc="Selesaikan seluruh kuis"
                  color="bg-emerald-500/10"
                />
                <FeatureCard 
                  icon={<Clock className="text-cyan-500" />} 
                  title="Belajar Mandiri" 
                  desc="Atur waktu belajarmu"
                  color="bg-cyan-500/10"
                />
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-violet-600/10 dark:bg-violet-600/5 rounded-full blur-[120px] -z-10" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl opacity-60 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, color }: any) {
  return (
    <div className="flex items-center gap-5 p-5 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <h4 className="font-black text-base dark:text-white leading-tight mb-1">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{desc}</p>
      </div>
    </div>
  );
}

function ModuleList({ modules, onSelect, scores, progress, stats }: { modules: ModuleContent[], onSelect: (m: ModuleContent) => void, scores: Record<string, number>, progress: Record<string, number[]>, stats: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 sm:space-y-12"
    >
      {stats && (
        <UserStatsBar stats={stats} />
      )}
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">Daftar Materi Pembelajaran</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Silahkan pilih materi di bawah ini untuk mulai belajar. Selesaikan materi dan kuis 
          di akhir setiap bab untuk menguji pemahamanmu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
        {modules.map((module, idx) => {
          const score = scores[module.id];
          const isCompleted = score !== undefined;
          
          const completedSteps = progress[module.id]?.length || 0;
          const totalSteps = module.subTopics.length + 1;
          const progressPercent = Math.min(100, Math.round((completedSteps / totalSteps) * 100));

          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => onSelect(module)}
              className="group text-left bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 hover:border-violet-500 dark:hover:border-violet-400 hover:shadow-2xl hover:shadow-violet-200/20 dark:hover:shadow-violet-500/10 transition-all cursor-pointer relative overflow-hidden h-full flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-bl-[4rem] -translate-y-4 translate-x-4 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-colors -z-10" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none' 
                    : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-200 dark:shadow-none'
                }`}>
                  {isCompleted ? <CheckCircle2 size={28} /> : <span className="font-black text-xl">{idx + 1}</span>}
                </div>
                {isCompleted && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-xs font-black px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-widest"
                  >
                    Skor: {score}%
                  </motion.div>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                {module.description}
              </p>

              {/* Progress Bar UI */}
              <div className="mb-6 space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <span>PROGRES BELAJAR</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={14} />
                  <span>{module.quiz.length} Pertanyaan</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function ModuleDetail({ module, onBack, onStartQuiz, onProgress, savedProgress }: { module: ModuleContent, onBack: () => void, onStartQuiz: () => void, onProgress: (step: number) => void, savedProgress: number[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = module.subTopics.length + 1; // Intro + Sub-topics

  useEffect(() => {
    onProgress(currentStep);
  }, [currentStep, onProgress]);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold mb-8 transition-colors cursor-pointer group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Materi
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        {/* Header Header */}
        <div className="min-h-[160px] md:h-40 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 md:p-12 relative flex items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                MODUL {module.id.replace('m', '')}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} /> {module.duration}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{module.title}</h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 md:p-12">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8 md:mb-10 overflow-x-auto pb-4 no-scrollbar">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i}
                className={`h-2 rounded-full transition-all duration-500 shrink-0 ${
                  i === currentStep ? 'w-12 bg-indigo-600' : 'w-4 bg-slate-100 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 ? (
                  <section className="prose dark:prose-invert prose-slate max-w-none">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                        <BookText size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white m-0">Pengantar</h3>
                    </div>
                    <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                      {module.content}
                    </p>
                  </section>
                ) : (
                  <section className="prose dark:prose-invert prose-slate max-w-none">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-violet-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-violet-200 dark:shadow-none">
                        {currentStep}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white m-0">
                        {module.subTopics[currentStep - 1].title}
                      </h3>
                    </div>
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50">
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed m-0 text-content whitespace-pre-wrap">
                        {module.subTopics[currentStep - 1].text}
                      </p>

                      {/* Interactive Section - Conditionally rendered based on module/step */}
                      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 not-prose">
                        {module.id === 'm1' && currentStep === 1 && (
                          <div className="interactive-container">
                            <MatchICTComponents />
                          </div>
                        )}
                        {module.id === 'm1' && currentStep === 2 && (
                          <div className="interactive-container">
                            <ICTImpactSimulation />
                          </div>
                        )}
                        
                        {/* Generic Placeholder for other modules to show capability */}
                        {module.id !== 'm1' && currentStep === 1 && (
                          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-sm text-indigo-700 dark:text-indigo-400 font-medium">
                            💡 <strong>Tip Belajar:</strong> Cobalah untuk menjelaskan materi di atas secara mandiri sebelum beralih ke sub-topik berikutnya.
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                currentStep === 0 
                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed border border-transparent' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-800 sm:border-transparent'
              }`}
            >
              <ChevronLeft size={20} />
              Sebelumnya
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={nextStep}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 text-white rounded-2xl font-black hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-200 transition-all cursor-pointer group"
              >
                Selanjutnya
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <motion.button 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={onStartQuiz}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-200 transition-all cursor-pointer border-b-8 border-emerald-700/50"
              >
                <HelpCircle size={28} />
                Mulai Kuis Sekarang
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Quiz({ module, onComplete, onBack }: { module: ModuleContent, onComplete: (score: number) => void, onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [gameState, setGameState] = useState<'intro' | 'question' | 'feedback'>('intro');
  const [timeLeft, setTimeLeft] = useState(20);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Use refs for stable audio elements
  const audioRefs = useRef<{
    bg: HTMLAudioElement;
    correct: HTMLAudioElement;
    wrong: HTMLAudioElement;
    transition: HTMLAudioElement;
  } | null>(null);

  useEffect(() => {
    if (!audioRefs.current) {
      audioRefs.current = {
        bg: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'),
        correct: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-reward-952.mp3'),
        wrong: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),
        transition: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-digital-quick-reveal-2374.mp3')
      };
      
      audioRefs.current.bg.loop = true;
      audioRefs.current.bg.volume = 0.4;
    }

    return () => {
      if (audioRefs.current) {
        audioRefs.current.bg.pause();
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRefs.current;
    if (!audio) return;
    
    if (!isMuted && gameState !== 'intro' && !showResults) {
      audio.bg.play().catch(e => console.warn("Autoplay blocked:", e));
    } else {
      audio.bg.pause();
    }
  }, [isMuted, showResults, gameState]);

  const playSfx = (key: 'correct' | 'wrong' | 'transition') => {
    const audio = audioRefs.current?.[key];
    if (!isMuted && audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn(`SFX ${key} play failed:`, e));
    }
  };

  const startQuiz = () => {
    // Attempt to start BG music on first interaction
    if (!isMuted && audioRefs.current) {
      audioRefs.current.bg.play().catch(console.error);
    }
    playSfx('transition');
    setGameState('question');
    setTimeLeft(module.quiz[0].timeLimit || 20);
  };

  const question = module.quiz[currentQuestion];
  const timeLimit = question.timeLimit || 20;

  // Timer logic
  useEffect(() => {
    if (gameState !== 'question' || showResults) return;

    if (timeLeft <= 0) {
      handleAnswer(-1); // Timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, showResults]);

  const handleAnswer = (index: number) => {
    if (gameState !== 'question') return;

    setSelectedOption(index);
    const correct = index === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      playSfx('correct');
      const speedBonus = Math.round((timeLeft / timeLimit) * 500);
      setTotalPoints(prev => prev + 500 + speedBonus);
      setStreak(prev => prev + 1);
    } else {
      playSfx('wrong');
      setStreak(0);
    }

    setAnswers(prev => [...prev, index]);
    setGameState('feedback');
  };

  const nextQuestion = () => {
    playSfx('transition');
    if (currentQuestion < module.quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setGameState('question');
      setTimeLeft(module.quiz[currentQuestion + 1].timeLimit || 20);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  if (gameState === 'intro') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12 md:py-20"
      >
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 sm:p-14 shadow-2xl flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-violet-200/50 dark:shadow-none">
            <GraduationCap size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase">Sudah Siap?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg md:text-xl font-medium">
            Modul: <span className="font-black text-violet-600 dark:text-violet-400">{module.title}</span><br/>
            {module.quiz.length} Tantangan Menantimu!
          </p>
          
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-3 px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-400 font-black uppercase text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {isMuted ? "Suara Mati" : "Suara Nyala"}
            </button>
          </div>
          
          <button 
            onClick={startQuiz}
            className="group relative px-16 py-8 bg-violet-600 text-white rounded-[3rem] font-black text-3xl hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_-10px_rgba(124,58,237,0.5)] cursor-pointer overflow-hidden border-b-8 border-violet-800"
          >
            <span className="relative z-10 flex items-center gap-4">
              Mulai Kuis! <ChevronRight size={40} className="group-hover:translate-x-2 transition-transform" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-white/10"
              animate={{ x: ['100%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
          </button>
          
          <button onClick={onBack} className="mt-10 text-slate-400 font-black uppercase text-xs tracking-[0.3em] hover:text-slate-600 transition-colors">
            Nanti saja
          </button>
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    const finalScore = Math.round((answers.filter((ans, i) => ans === module.quiz[i].correctAnswer).length / module.quiz.length) * 100);
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto text-center py-8 md:py-12"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-12 shadow-xl shadow-slate-100 dark:shadow-none">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-2xl shadow-indigo-200 dark:shadow-indigo-900"
          >
            <Award size={48} className="md:size-[64px]" />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Luar Biasa!</h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-8">Kamu telah menyelesaikan modul <span className="font-bold dark:text-white">{module.title}</span></p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Skor Akurasi</p>
              <p className="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400">{finalScore}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Poin</p>
              <p className="text-3xl md:text-4xl font-black text-amber-500">{totalPoints}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => onComplete(finalScore)}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 cursor-pointer"
            >
              Simpan & Keluar
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const shapes = [
    { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', icon: '▲', color: '#f43f5e' },
    { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', icon: '◆', color: '#3b82f6' },
    { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', icon: '●', color: '#f59e0b' },
    { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', icon: '■', color: '#10b981' }
  ];

  return (
    <div className="min-h-[85vh] flex flex-col max-w-5xl mx-auto px-4">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-slate-900 px-5 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <span className="font-black text-slate-400 dark:text-slate-500 text-sm">PROGRES</span>
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                className="h-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / module.quiz.length) * 100}%` }}
               />
            </div>
            <span className="font-black text-indigo-600 dark:text-indigo-400">{currentQuestion + 1}/{module.quiz.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          {streak > 1 && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full font-black flex items-center gap-2 border border-orange-200 dark:border-orange-900"
            >
              🔥 {streak}
            </motion.div>
          )}
          <div className="bg-white dark:bg-slate-900 px-6 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 font-black text-xl text-amber-500 flex items-center gap-2">
            < Award size={20} className="text-amber-400" />
            {totalPoints.toLocaleString()}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'question' ? (
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col"
          >
            {/* Question Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-16 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden text-center flex flex-col justify-center min-h-[350px]">
              {/* Timer Progress Ring */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="48" cy="48" r="40"
                    className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="48" cy="48" r="40"
                    className="fill-none"
                    stroke={timeLeft > 10 ? '#4f46e5' : timeLeft > 5 ? '#f59e0b' : '#f43f5e'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: Math.max(0, timeLeft / timeLimit) }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </svg>
                <motion.div 
                  animate={timeLeft <= 5 ? { scale: [1, 1.2, 1], color: ['#f43f5e', '#ef4444', '#f43f5e'] } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-700 dark:text-slate-300"
                >
                  {timeLeft}
                </motion.div>
              </div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mt-12"
              >
                {question.question}
              </motion.h2>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {question.options.map((option, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(i)}
                  className={`${shapes[i].bg} ${shapes[i].hover} text-white p-6 md:p-10 rounded-[2.5rem] flex items-center gap-6 text-left transition-all shadow-lg hover:shadow-2xl hover:shadow-${shapes[i].bg.split('-')[1]}-200 group cursor-pointer border-b-8 border-black/20`}
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform">
                    {shapes[i].icon}
                  </div>
                  <span className="text-xl md:text-2xl font-black leading-tight">
                    {option}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="f"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className={`flex-1 flex flex-col items-center justify-center p-8 rounded-[4rem] text-white shadow-2xl relative overflow-hidden ${
              isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          >
            {/* Animated background patterns */}
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -left-20 w-96 h-96 border-[40px] border-white/5 rounded-full"
            />
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-20 -right-20 w-[500px] h-[500px] border-[60px] border-white/5 rounded-full"
            />

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center z-10"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
                className="text-9xl mb-8 filter drop-shadow-xl"
              >
                {isCorrect ? '💎' : '👻'}
              </motion.div>
              
              <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter drop-shadow-lg">
                {isCorrect ? 'MANTAP!' : 'WADUH!'}
              </h2>

              <AnimatePresence>
                {isCorrect && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center gap-4 mb-10"
                  >
                    <div className="bg-white/20 backdrop-blur-xl px-10 py-4 rounded-[2rem] border border-white/30 shadow-xl">
                      <p className="text-sm font-black opacity-80 uppercase tracking-widest mb-1 text-emerald-100">Poin Didapat</p>
                      <p className="text-5xl font-black">+{Math.round(500 + (timeLeft / timeLimit) * 500)}</p>
                    </div>
                    {streak > 1 && (
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-amber-400 text-amber-950 px-8 py-3 rounded-full font-black text-2xl shadow-lg border-b-4 border-amber-600"
                      >
                        🔥 {streak} STREAK!
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isCorrect && (
                <div className="bg-white/20 backdrop-blur-xl p-8 rounded-[3rem] border border-white/30 shadow-xl mb-10 max-w-md mx-auto">
                  <p className="text-sm font-black opacity-70 uppercase tracking-widest mb-4">Jawaban Yang Benar:</p>
                  <p className="text-2xl md:text-3xl font-black leading-tight">
                    {question.options[question.correctAnswer]}
                  </p>
                </div>
              )}

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                className="bg-white text-slate-900 px-16 py-6 rounded-[2.5rem] font-black text-2xl hover:shadow-2xl transition-all shadow-xl cursor-pointer border-b-8 border-slate-200"
              >
                {currentQuestion < module.quiz.length - 1 ? 'LANJUTKAN' : 'LIHAT HASIL'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Glossary() {
  const [search, setSearch] = useState('');
  const filtered = GLOSSARY.filter(g => 
    g.term.toLowerCase().includes(search.toLowerCase()) || 
    g.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Glosarium Istilah</h2>
        <p className="text-slate-600 dark:text-slate-400">Kumpulan istilah-istilah penting dalam dunia ICT dan Bisnis Digital.</p>
      </div>

      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Cari istilah atau pengertian..." 
          className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-600 transition-all text-lg dark:text-white shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.map((item, i) => (
          <div key={i} className="p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-200/20 transition-all group">
            <h3 className="text-xl font-black text-violet-600 dark:text-violet-400 mb-2 group-hover:translate-x-1 transition-transform">{item.term}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.definition}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>Tidak ada istilah yang ditemukan</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Profile({ userProfile, quizScores, moduleProgress, modules, onClaimCertificate }: { userProfile: UserProfile | null, quizScores: Record<string, number>, moduleProgress: Record<string, number[]>, modules: ModuleContent[], onClaimCertificate: () => void }) {
  if (!userProfile) return null;
  const completedModules = Object.keys(quizScores).length;
  const isEligibleForCertificate = completedModules === modules.length && modules.length > 0;
  
  const totalPoints = Object.values(quizScores).reduce((acc, score) => acc + (score * 10), 0);
  const avgScore = completedModules > 0 ? Math.round(Object.values(quizScores).reduce((acc, score) => acc + score, 0) / completedModules) : 0;
  
  const totalPossibleSteps = modules.reduce((acc, m) => acc + m.subTopics.length + 1, 0);
  const totalCompletedSteps = Object.values(moduleProgress).reduce((acc, steps) => acc + steps.length, 0);
  const overallProgress = totalPossibleSteps > 0 ? Math.round((totalCompletedSteps / totalPossibleSteps) * 100) : 0;

  const stats = { completedModules, totalPoints, avgScore, overallProgress };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-[2.8rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-violet-200/20 dark:shadow-none">
            {userProfile.displayName?.charAt(0) || 'U'}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">{userProfile.displayName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full text-sm font-medium">
                <Mail size={16} className="text-violet-500" /> {userProfile.email}
              </span>
              <span className="flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 rounded-full text-sm font-black uppercase tracking-wider">
                {userProfile.role === 'teacher' ? 'Guru Literasi ICT' : 'Siswa SMK Mandiri'}
              </span>
              <button 
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 px-4 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-bold hover:bg-red-100 transition-colors"
                title="Keluar dari akun"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <UserStatsBar stats={stats} />

      {isEligibleForCertificate && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shrink-0">
                <Award size={48} className="text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black mb-2">Selamat! Kamu Lulus.</h3>
                <p className="text-indigo-100 max-w-md">Kamu telah menyelesaikan seluruh materi. Klaim sertifikat belajarmu sekarang!</p>
              </div>
            </div>
            <button 
              onClick={onClaimCertificate}
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-900/20 cursor-pointer"
            >
              Lihat Sertifikat
            </button>
          </div>
        </motion.div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 overflow-hidden">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Progress per Modul</h3>
        <div className="space-y-4">
          {modules.map((module, idx) => {
            const score = quizScores[module.id];
            const isCompleted = score !== undefined;
            const topicProgress = moduleProgress[module.id]?.length || 0;
            const totalTopics = module.subTopics.length + 1;
            const progressPercent = Math.round((topicProgress / totalTopics) * 100);
            
            return (
              <div 
                key={module.id} 
                className="flex items-center gap-6 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/20 group transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl ${
                  isCompleted 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                }`}>
                  {isCompleted ? <CheckCircle2 size={28} /> : idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg truncate mb-1">{module.title}</h4>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                     <div 
                       className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                       style={{ width: isCompleted ? '100%' : `${progressPercent}%` }}
                     />
                  </div>
                  {!isCompleted && topicProgress > 0 && (
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                      Materi: {topicProgress}/{totalTopics} Terbaca
                    </p>
                  )}
                </div>

                <div className="text-right min-w-[80px]">
                  {isCompleted ? (
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{score}%</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase">
                      {progressPercent}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function About({ modules }: { modules: ModuleContent[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 underline decoration-indigo-200 dark:decoration-indigo-800 underline-offset-8">Tentang e-Modul Ini</h2>
          
          <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            <p>
              e-Modul Literasi ICT dalam Bisnis ini dikembangkan khusus sebagai media pembelajaran 
              tambahan yang interaktif bagi siswa Sekolah Menengah Kejuruan (SMK) Kelas 11, 
              khususnya program keahlian Bisnis dan Pemasaran.
            </p>
            
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-xl">Tujuan Pembelajaran</h3>
              <ul className="list-disc dark:marker:text-indigo-400 pl-6 space-y-2">
                <li>Memahami peran teknologi informasi dalam mengubah model bisnis tradisional.</li>
                <li>Mampu mengoperasikan perangkat dan software bisnis digital secara efektif.</li>
                <li>Menerapkan strategi pemasaran digital untuk meningkatkan brand awareness.</li>
                <li>Mengetahui prosedur transaksi digital yang aman.</li>
                <li>Menumbuhkan etika yang baik dan kesadaran keamanan dalam berbisnis digital.</li>
              </ul>
            </div>

            <div className="pt-8 flex items-center gap-6 p-6 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-3xl">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                <Info size={32} />
              </div>
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                Aplikasi ini mendukung konsep kurikulum merdeka yang mengedepankan kemandirian 
                siswa dalam mengeksplorasi materi melalui media digital.
              </p>
            </div>

            <div className="pt-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-xl">Peta Pikiran Materi (Mind Map)</h3>
              <p className="mb-4 text-sm">Visualisasi keterkaitan antar modul dan sub-topik pembelajaran.</p>
              <MindMap modules={modules} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

