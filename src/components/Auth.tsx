import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthProps {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'student' as 'student' | 'teacher'
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!validateEmail(formData.email)) {
      setError('Format email tidak valid.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (!isLogin && !formData.displayName.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: formData.displayName
        });

        // Initialize user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: formData.displayName,
          role: formData.role,
          createdAt: serverTimestamp(),
          scores: {},
          progress: {}
        });
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email atau kata sandi salah.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-100 dark:shadow-none"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {isLogin 
              ? 'Masuk untuk melanjutkan pembelajaranmu' 
              : 'Daftar untuk mulai belajar dan menyimpan progress'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm font-medium"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500">
                    <User size={18} />
                  </div>
                  <input 
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/30 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all dark:text-white"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.displayName}
                    onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Saya mendaftar sebagai:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                      formData.role === 'student' 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-indigo-200'
                    }`}
                  >
                    Siswa
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'teacher' })}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                      formData.role === 'teacher' 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-indigo-200'
                    }`}
                  >
                    Guru
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500">
                <Mail size={18} />
              </div>
              <input 
                type="email"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/30 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all dark:text-white"
                placeholder="email@sekolah.sch.id"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/30 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all dark:text-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                {isLogin ? 'Masuk' : 'Daftar Sekarang'}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="ml-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              {isLogin ? 'Daftar di sini' : 'Masuk sekarang'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
