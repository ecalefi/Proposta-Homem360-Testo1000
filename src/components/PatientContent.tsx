import React, { useState } from 'react';
import { PlayCircle, FileText, HelpCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { CONTENT_LIBRARY, MOCK_FAQ } from '../constants';

const PatientContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'articles' | 'faq'>('videos');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredContent = CONTENT_LIBRARY.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaq = MOCK_FAQ.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderVideos = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.filter(c => c.type === 'video').map(video => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="relative aspect-video bg-slate-900">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white opacity-90 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                    </span>
                </div>
                <div className="p-4">
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">{video.category}</span>
                    <h3 className="font-bold text-slate-900 mt-1 mb-2 leading-tight">{video.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{video.description}</p>
                </div>
            </div>
        ))}
    </div>
  );

  const renderArticles = () => (
    <div className="space-y-4">
        {filteredContent.filter(c => c.type === 'article').map(article => (
            <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row gap-4 hover:border-primary-300 transition-colors cursor-pointer">
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-primary-600 uppercase bg-primary-50 px-2 py-1 rounded">{article.category}</span>
                        <span className="text-xs text-slate-400 flex items-center"><FileText className="h-3 w-3 mr-1"/> {article.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{article.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{article.description}</p>
                    <button className="mt-3 text-sm font-medium text-primary-700 hover:text-primary-800 hover:underline">Ler artigo completo →</button>
                </div>
            </div>
        ))}
    </div>
  );

  const renderFaq = () => (
    <div className="space-y-3 max-w-3xl mx-auto">
        {filteredFaq.map(faq => (
            <div key={faq.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button 
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50 transition-colors"
                >
                    <span className="font-bold text-slate-800">{faq.question}</span>
                    {expandedFaq === faq.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-2 pt-4 bg-stone-50">
                        {faq.answer}
                        <div className="mt-2 text-xs text-primary-600 font-medium uppercase tracking-wide">
                            Categoria: {faq.category}
                        </div>
                    </div>
                )}
            </div>
        ))}
    </div>
  );

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-primary-900">Biblioteca Dr. Edgar</h2>
                <p className="text-slate-500">Conteúdo exclusivo para sua jornada de saúde.</p>
            </div>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Pesquisar conteúdo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'videos' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            >
                <div className="flex items-center"><PlayCircle className="h-4 w-4 mr-2" /> Vídeos</div>
            </button>
            <button 
                onClick={() => setActiveTab('articles')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'articles' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            >
                 <div className="flex items-center"><FileText className="h-4 w-4 mr-2" /> Artigos</div>
            </button>
            <button 
                onClick={() => setActiveTab('faq')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'faq' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
            >
                 <div className="flex items-center"><HelpCircle className="h-4 w-4 mr-2" /> Dúvidas (FAQ)</div>
            </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
            {activeTab === 'videos' && renderVideos()}
            {activeTab === 'articles' && renderArticles()}
            {activeTab === 'faq' && renderFaq()}
            
            {((activeTab === 'videos' || activeTab === 'articles') && filteredContent.length === 0) || (activeTab === 'faq' && filteredFaq.length === 0) ? (
                <div className="text-center py-12">
                    <p className="text-slate-500">Nenhum conteúdo encontrado para sua busca.</p>
                </div>
            ) : null}
        </div>
    </div>
  );
};

export default PatientContent;