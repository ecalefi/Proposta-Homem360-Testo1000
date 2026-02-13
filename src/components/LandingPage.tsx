
import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Database, 
  Lock, 
  ArrowRight, 
  CheckCircle2,
  Brain,
  Layout,
  ChevronRight,
  Star,
  Users,
  Utensils,
  Dumbbell,
  Sun,
  BookOpen
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-800 overflow-x-hidden">
      
      {/* 1. HERO SECTION - Premium & Impactful */}
      <header className="bg-primary-950 text-white relative overflow-hidden pb-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gold-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-800/30 rounded-full blur-[120px]"></div>
        </div>

        {/* Navbar */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-3">
             <div className="bg-white/5 p-2 rounded-lg backdrop-blur-md border border-white/10">
                <ShieldCheck className="h-6 w-6 text-gold-500" />
             </div>
             <div>
                <h1 className="text-xl font-bold font-serif tracking-wider text-white">DR. EDGAR SARMENTO</h1>
                <p className="text-[10px] text-gold-500 uppercase tracking-widest font-medium">Urologia & Performance</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={onEnter}
                className="hidden md:flex items-center gap-2 text-sm font-bold text-primary-200 hover:text-white transition-colors border border-transparent hover:border-white/20 px-4 py-2 rounded-full"
            >
                <Users className="h-4 w-4" /> Área da Equipe
            </button>
            <button 
                onClick={onEnter}
                className="flex items-center px-6 py-2.5 bg-white text-primary-950 rounded-full hover:bg-gold-50 transition-all font-bold text-sm shadow-lg shadow-white/10"
            >
                Sou Paciente
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-wider">
                    <Star className="h-3 w-3 mr-2 fill-gold-500" /> Medicina de Alta Performance
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                    Domine sua biologia. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Eleve sua potência.</span>
                </h2>
                <p className="text-lg text-primary-200 leading-relaxed max-w-lg">
                    O primeiro ecossistema digital que integra <strong>Urologia, Nutrição e Treino</strong> em uma única plataforma. Monitore biomarcadores, gerencie o método 7 Ps e conecte-se com sua equipe multidisciplinar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                        onClick={onEnter}
                        className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-gold-900/30 flex items-center justify-center group"
                    >
                        Acessar Meu Hub <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
                        Conhecer o Método
                    </button>
                </div>
                
                <div className="pt-8 flex items-center gap-6 text-sm text-primary-300 font-medium">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gold-500" /> Atendimento 360º
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gold-500" /> Monitoramento de Dados
                    </div>
                </div>
            </div>
            
            {/* Right Content - CSS PHONE MOCKUP */}
            <div className="relative flex justify-center lg:justify-end perspective-1000">
                 {/* Decorative Circle */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full opacity-50"></div>
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-white/5 rounded-full opacity-30"></div>

                 {/* Phone Frame */}
                 <div className="relative w-[300px] h-[600px] bg-primary-950 rounded-[40px] border-[8px] border-primary-800 shadow-2xl shadow-black/50 overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700 z-20">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-primary-900 rounded-b-xl z-30"></div>
                    
                    {/* Screen Content */}
                    <div className="w-full h-full bg-stone-50 overflow-hidden flex flex-col">
                        {/* Header Mockup */}
                        <div className="bg-white p-5 pt-10 pb-4 shadow-sm border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase">Bem-vindo</div>
                                <div className="text-primary-900 font-bold text-lg">Roberto Mendes</div>
                            </div>
                            <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                        </div>

                        {/* Body Content Mockup */}
                        <div className="p-4 space-y-4">
                            {/* Card 1: Chart */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Testosterona</span>
                                    <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">▲ Ideal</span>
                                </div>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-2xl font-bold text-primary-900">820</span>
                                    <span className="text-xs text-slate-400 mb-1">ng/dL</span>
                                </div>
                                {/* CSS Chart Line */}
                                <div className="flex items-end gap-1 h-12">
                                    <div className="w-1/5 bg-slate-100 h-[40%] rounded-t-sm"></div>
                                    <div className="w-1/5 bg-slate-100 h-[55%] rounded-t-sm"></div>
                                    <div className="w-1/5 bg-slate-100 h-[70%] rounded-t-sm"></div>
                                    <div className="w-1/5 bg-primary-200 h-[85%] rounded-t-sm"></div>
                                    <div className="w-1/5 bg-primary-600 h-[100%] rounded-t-sm relative">
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gold-500 rounded-full border border-white"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: 7Ps */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <h4 className="text-xs font-bold text-primary-900 mb-3 uppercase">Hábitos de Hoje (7 Ps)</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Activity className="h-3 w-3"/></div>
                                            <span className="text-xs font-bold text-slate-700">Hidratação</span>
                                        </div>
                                        <span className="text-xs text-slate-500">2.5L / 3L</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                        <div className="bg-blue-500 w-[80%] h-full rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                             {/* Card 3: Team */}
                             <div className="bg-primary-900 p-4 rounded-xl shadow-lg text-white flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 p-2 rounded-lg"><MessageSquare className="h-4 w-4 text-gold-500"/></div>
                                    <div>
                                        <div className="text-xs text-primary-200">Nutricionista</div>
                                        <div className="text-sm font-bold">Nova Mensagem</div>
                                    </div>
                                </div>
                                <div className="h-2 w-2 bg-gold-500 rounded-full"></div>
                             </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-auto bg-white p-4 border-t border-slate-100 flex justify-around text-slate-300">
                            <div className="h-6 w-6 bg-primary-900 rounded-lg"></div>
                            <div className="h-6 w-6 bg-slate-200 rounded-lg"></div>
                            <div className="h-6 w-6 bg-slate-200 rounded-lg"></div>
                            <div className="h-6 w-6 bg-slate-200 rounded-lg"></div>
                        </div>
                    </div>
                 </div>

                 {/* Floating Element: Notification */}
                 <div className="absolute top-[20%] -right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-xl z-40 flex items-center gap-3 border border-slate-100 animate-float max-w-[200px]">
                    <div className="bg-green-100 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Personal Beto</p>
                        <p className="text-xs font-bold text-slate-900">Treino ajustado!</p>
                    </div>
                 </div>
            </div>
        </div>
      </header>

      {/* 2. FULL ECOSYSTEM PRESENTATION (Features) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h3 className="text-gold-600 font-bold uppercase tracking-widest text-xs mb-3">Solução Completa</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-950 font-serif">O Ecossistema de Saúde Masculina</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
                Integramos todas as áreas vitais para sua performance em um único aplicativo inteligente.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. Medicina */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary-900/5 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-7 w-7 text-primary-700" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Medicina de Precisão</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                    Acompanhe a evolução da sua testosterona, PSA e outros biomarcadores com gráficos detalhados e alertas automáticos de saúde.
                </p>
            </div>

            {/* 2. Nutrição */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Utensils className="h-7 w-7 text-emerald-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Nutrição Estratégica</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                    Planos alimentares integrados ao app. Receba feedback da sua nutricionista e registre refeições com facilidade.
                </p>
            </div>

            {/* 3. Treino */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-orange-900/5 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Dumbbell className="h-7 w-7 text-orange-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Treino & Performance</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                    Fichas de treino na palma da mão. Seu personal trainer acompanha sua frequência e ajusta as cargas remotamente.
                </p>
            </div>

            {/* 4. Método 7 Ps */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-gold-900/5 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-gold-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sun className="h-7 w-7 text-gold-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Método 7 Ps</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                    Gestão de estilo de vida exclusiva: Sono, Físico, Dieta, Família, Mente, Lazer e Espiritualidade em um único dashboard.
                </p>
            </div>

            {/* 5. Comunicação */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-7 w-7 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Chat Multidisciplinar</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                    Canal direto e seguro com Médico, Nutricionista e Personal. Tire dúvidas e envie feedbacks sem burocracia.
                </p>
            </div>

            {/* 6. Conteúdo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-purple-900/5 hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-7 w-7 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Biblioteca Premium</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                    Acesso exclusivo a vídeos e artigos do Dr. Edgar sobre reposição hormonal, hipertrofia e saúde sexual.
                </p>
            </div>

        </div>
      </section>

      {/* 3. VALUE PROPOSITION - MANAGEMENT SIDE */}
      <section className="bg-stone-100 py-24 px-6 border-y border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Content */}
            <div className="order-2 lg:order-1">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gold-500 h-px w-8"></div>
                    <h3 className="text-gold-600 font-bold uppercase tracking-widest text-xs">Gestão Clínica 2.0</h3>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-primary-950 font-serif mb-6 leading-tight">
                    Visão unificada para a <br/>equipe médica
                 </h2>
                 <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    Centralize prontuários, planos alimentares e rotinas de treino. Médicos, Nutricionistas e Treinadores colaboram em tempo real para maximizar os resultados do paciente.
                 </p>
                 
                 <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-primary-700 shrink-0"><Brain className="h-6 w-6" /></div>
                        <div>
                            <h4 className="text-lg font-bold text-primary-900">Inteligência de Dados</h4>
                            <p className="text-slate-600 text-sm mt-1">Identifique pacientes com PSA subindo ou baixa aderência ao plano alimentar automaticamente.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-primary-700 shrink-0"><Database className="h-6 w-6" /></div>
                        <div>
                            <h4 className="text-lg font-bold text-primary-900">Prontuário Integrado</h4>
                            <p className="text-slate-600 text-sm mt-1">Histórico completo visível para toda a equipe, garantindo segurança e alinhamento no tratamento.</p>
                        </div>
                    </div>
                 </div>
            </div>
            
            {/* Right Content - CSS DESKTOP MOCKUP */}
            <div className="order-1 lg:order-2 relative">
                <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-700">
                    {/* Window Controls */}
                    <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    
                    {/* Desktop App Layout */}
                    <div className="flex h-[350px]">
                        {/* Sidebar */}
                        <div className="w-20 bg-primary-950 flex flex-col items-center py-6 gap-6">
                            <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                            <div className="w-8 h-8 bg-primary-800 rounded-lg"></div>
                            <div className="w-8 h-8 bg-primary-900 rounded-lg"></div>
                            <div className="w-8 h-8 bg-primary-900 rounded-lg"></div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 bg-stone-50 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-primary-900 text-lg">Pacientes em Acompanhamento</h3>
                                <div className="bg-white px-4 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-400">Buscar...</div>
                            </div>

                            {/* Table Mockup */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-4 gap-4 p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                                    <div className="col-span-2">Paciente</div>
                                    <div>Status</div>
                                    <div className="text-right">Ação</div>
                                </div>
                                
                                {/* Row 1 */}
                                <div className="grid grid-cols-4 gap-4 p-3 border-b border-slate-50 items-center">
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                                        <div className="text-sm font-bold text-slate-700">Roberto Mendes</div>
                                    </div>
                                    <div><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Em Dia</span></div>
                                    <div className="text-right"><div className="w-6 h-6 bg-slate-100 rounded ml-auto"></div></div>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-4 gap-4 p-3 border-b border-slate-50 items-center bg-red-50/50">
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                                        <div className="text-sm font-bold text-slate-700">Carlos Andrade</div>
                                    </div>
                                    <div><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Alerta PSA</span></div>
                                    <div className="text-right"><div className="w-6 h-6 bg-slate-100 rounded ml-auto"></div></div>
                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-4 gap-4 p-3 border-b border-slate-50 items-center">
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                                        <div className="text-sm font-bold text-slate-700">André Silva</div>
                                    </div>
                                    <div><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Pós-Op</span></div>
                                    <div className="text-right"><div className="w-6 h-6 bg-slate-100 rounded ml-auto"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Badge */}
                <div className="absolute -bottom-6 -left-6 bg-primary-900 text-white px-6 py-4 rounded-xl shadow-xl z-20">
                    <div className="text-xs text-gold-500 uppercase font-bold tracking-wider mb-1">Resultado</div>
                    <div className="text-2xl font-bold font-serif">+40% Retenção</div>
                </div>
            </div>
        </div>
      </section>

      {/* 4. PHILOSOPHY / FOOTER */}
      <footer className="bg-primary-950 text-white py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-6">
                    <ShieldCheck className="h-8 w-8 text-gold-500" />
                    <span className="text-2xl font-serif font-bold tracking-wide">DR. EDGAR SARMENTO</span>
                </div>
                <p className="text-primary-200 max-w-sm leading-relaxed text-lg italic font-serif">
                    "Homens fortes cuidam de si mesmos para cuidar melhor de suas famílias."
                </p>
                <div className="mt-8 flex space-x-4">
                    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                        <Users className="h-4 w-4 text-gold-500" />
                        <span className="text-xs font-bold text-primary-200">CRM-DF 12345</span>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-gold-500 mb-6 uppercase text-xs tracking-widest">Plataforma</h4>
                <ul className="space-y-3 text-primary-200 text-sm">
                    <li><button onClick={onEnter} className="hover:text-white transition-colors hover:translate-x-1 duration-200 inline-block">Prontuário Digital</button></li>
                    <li><button onClick={onEnter} className="hover:text-white transition-colors hover:translate-x-1 duration-200 inline-block">Agendamento Online</button></li>
                    <li><button onClick={onEnter} className="hover:text-white transition-colors hover:translate-x-1 duration-200 inline-block">Método 7 Ps</button></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-gold-500 mb-6 uppercase text-xs tracking-widest">Institucional</h4>
                <ul className="space-y-3 text-primary-200 text-sm">
                    <li className="hover:text-white cursor-pointer transition-colors">Sobre o Dr. Edgar</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Clínica em Brasília</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Política de Privacidade</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Termos de Uso</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 text-center text-primary-400 text-sm flex flex-col md:flex-row justify-between items-center">
            <span>&copy; 2026 Clínica Dr. Edgar Sarmento. Todos os direitos reservados.</span>
            <span className="mt-2 md:mt-0 flex items-center gap-2">
                <Lock className="h-3 w-3" /> Ambiente Seguro e Certificado
            </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
