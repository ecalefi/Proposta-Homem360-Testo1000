
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, User, Stethoscope, ArrowRight, ArrowLeft, Utensils, Dumbbell } from 'lucide-react';

interface LoginProps {
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: 'patient' | 'admin' | 'nutritionist' | 'trainer') => {
    setIsLoading(true);
    // For demo purposes, we auto-fill email if empty based on role
    let demoEmail = email;
    if (!demoEmail) {
        if (role === 'admin') demoEmail = 'dr.edgar@clinica.com';
        else if (role === 'nutritionist') demoEmail = 'nutri.ana@clinica.com';
        else if (role === 'trainer') demoEmail = 'beto.personal@clinica.com';
        else demoEmail = 'roberto.mendes@email.com';
    }
    
    await signIn(demoEmail, role);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-900 opacity-20 transform -skew-x-12"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-primary-900 relative z-10 animate-fade-in-up">
        <div className="p-8 bg-stone-50 border-b border-stone-200 text-center relative">
            {onBack && (
                <button 
                    onClick={onBack}
                    className="absolute left-6 top-8 text-slate-400 hover:text-primary-700 transition-colors"
                    title="Voltar ao início"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
            )}

            <div className="mx-auto h-12 w-12 bg-primary-950 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <ShieldCheck className="h-8 w-8 text-gold-500" />
            </div>
            <h1 className="text-2xl font-bold text-primary-950 font-serif">DR. EDGAR SARMENTO</h1>
            <p className="text-sm text-gold-600 font-medium tracking-widest uppercase mt-1">Urologia & Performance</p>
        </div>

        <div className="p-8 space-y-6">
            <div className="text-center">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Bem-vindo de volta</h2>
                <p className="text-slate-600 text-sm mb-6">Selecione seu perfil para acessar o sistema.</p>
            </div>

            <div className="space-y-4">
                <button 
                    onClick={() => handleLogin('patient')}
                    disabled={isLoading}
                    className="w-full group relative flex items-center p-4 border-2 border-slate-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                >
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                        <User className="h-6 w-6 text-primary-700 group-hover:text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                        <span className="block text-primary-900 font-bold group-hover:text-primary-800">Sou Paciente</span>
                        <span className="block text-slate-500 text-xs mt-0.5">Acessar meu acompanhamento</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary-500" />
                </button>

                <div className="grid grid-cols-3 gap-3">
                    <button 
                        onClick={() => handleLogin('admin')}
                        disabled={isLoading}
                        className="group relative flex flex-col items-center justify-center p-3 border-2 border-slate-200 rounded-xl hover:border-primary-900 hover:bg-stone-100 transition-all text-center h-28"
                    >
                        <div className="h-9 w-9 bg-stone-200 rounded-full flex items-center justify-center group-hover:bg-primary-900 transition-colors mb-2">
                            <Stethoscope className="h-5 w-5 text-stone-600 group-hover:text-gold-500" />
                        </div>
                        <div>
                            <span className="block text-primary-900 font-bold text-xs">Médico</span>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleLogin('nutritionist')}
                        disabled={isLoading}
                        className="group relative flex flex-col items-center justify-center p-3 border-2 border-slate-200 rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition-all text-center h-28"
                    >
                        <div className="h-9 w-9 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-600 transition-colors mb-2">
                            <Utensils className="h-5 w-5 text-emerald-600 group-hover:text-white" />
                        </div>
                        <div>
                            <span className="block text-emerald-900 font-bold text-xs">Nutrição</span>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleLogin('trainer')}
                        disabled={isLoading}
                        className="group relative flex flex-col items-center justify-center p-3 border-2 border-slate-200 rounded-xl hover:border-orange-600 hover:bg-orange-50 transition-all text-center h-28"
                    >
                        <div className="h-9 w-9 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors mb-2">
                            <Dumbbell className="h-5 w-5 text-orange-600 group-hover:text-white" />
                        </div>
                        <div>
                            <span className="block text-orange-900 font-bold text-xs">Personal</span>
                        </div>
                    </button>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                    Ambiente seguro e criptografado. <br/>
                    Ao entrar, você concorda com nossos termos de privacidade.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
