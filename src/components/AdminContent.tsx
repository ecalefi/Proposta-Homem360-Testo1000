
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, Video, FileText, Search, PlayCircle, BookOpen, Upload } from 'lucide-react';
import { CONTENT_LIBRARY, MOCK_FAQ } from '../constants';

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'faq'>('library');
  const [searchTerm, setSearchTerm] = useState('');

  // Combine mock data with local state for MVP manipulation
  const [contentList, setContentList] = useState(CONTENT_LIBRARY);
  const [faqs, setFaqs] = useState(MOCK_FAQ);

  const filteredContent = contentList.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFaqs = faqs.filter(item => item.question.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDeleteContent = (id: string) => {
      if(confirm('Tem certeza que deseja excluir este conteúdo?')) {
          setContentList(prev => prev.filter(i => i.id !== id));
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary-900">Central de Conteúdo</h2>
            <button className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors text-sm font-bold flex items-center shadow-sm">
                <Upload className="h-4 w-4 mr-2" /> Novo Conteúdo
            </button>
        </div>

        {/* Tabs & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab('library')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'library' ? 'bg-white text-primary-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Biblioteca (Vídeos/Artigos)
                </button>
                <button 
                    onClick={() => setActiveTab('faq')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'faq' ? 'bg-white text-primary-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    FAQ (Perguntas)
                </button>
            </div>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
                />
            </div>
        </div>

        {/* Content View */}
        {activeTab === 'library' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                        <div className="relative h-40 bg-slate-900">
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-bold uppercase backdrop-blur-sm">
                                {item.type === 'video' ? 'Vídeo' : 'Artigo'}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                <button className="bg-white text-primary-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                    Editar
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <span className="text-xs font-bold text-primary-600 uppercase mb-1">{item.category}</span>
                            <h4 className="font-bold text-slate-900 leading-tight mb-2 flex-1">{item.title}</h4>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                <span className="text-xs text-slate-500 flex items-center">
                                    {item.type === 'video' ? <PlayCircle className="h-3 w-3 mr-1"/> : <FileText className="h-3 w-3 mr-1"/>}
                                    {item.duration}
                                </span>
                                <button 
                                    onClick={() => handleDeleteContent(item.id)}
                                    className="text-slate-400 hover:text-red-500 p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Add New Card */}
                <button className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all h-full min-h-[300px]">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Plus className="h-8 w-8" />
                    </div>
                    <span className="font-bold">Adicionar Novo Item</span>
                </button>
            </div>
        ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="divide-y divide-slate-100">
                    {filteredFaqs.map(faq => (
                        <div key={faq.id} className="p-6 hover:bg-stone-50 transition-colors group">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="bg-primary-50 p-2 rounded-lg h-fit text-primary-600 shrink-0">
                                        <HelpCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-1 block">{faq.category}</span>
                                        <h4 className="font-bold text-slate-900 text-lg mb-2">{faq.question}</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">{faq.answer}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                     <button className="text-primary-700 font-bold text-sm hover:underline flex items-center justify-center gap-2 mx-auto">
                         <Plus className="h-4 w-4" /> Adicionar Nova Pergunta
                     </button>
                 </div>
            </div>
        )}
    </div>
  );
};

export default AdminContent;
