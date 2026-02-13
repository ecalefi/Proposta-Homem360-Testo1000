
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Paperclip, Lock, Search, MoreVertical, CheckCheck, Check, User as UserIcon, CalendarDays, Users, Stethoscope, Megaphone, AlertTriangle } from 'lucide-react';
import { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

// Metadata for contacts to enrich the dynamic message list
const CONTACT_METADATA: Record<string, { name: string; avatar: string; role: string }> = {
    'u1': { name: 'Roberto Mendes', avatar: 'https://picsum.photos/200', role: 'Paciente TRT' },
    'u2': { name: 'Carlos Andrade', avatar: 'https://picsum.photos/201', role: 'Paciente PSA' },
    'u3': { name: 'André Silva', avatar: 'https://picsum.photos/202', role: 'Pós-Op' },
    'u4': { name: 'Felipe Costa', avatar: 'https://picsum.photos/203', role: 'Paciente' },
    'admin-1': { name: 'Dr. Edgar Sarmento', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200', role: 'Médico Urologista' },
    'nutri-1': { name: 'Nutri. Ana Clara', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', role: 'Nutricionista' },
    'trainer-1': { name: 'Personal Beto', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200', role: 'Treinador Físico' }
};

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { messages, sendMessage, markAsRead, sendBroadcast, broadcasts } = useData();
  const [newMessage, setNewMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Professionals to switch views
  const [contactViewMode, setContactViewMode] = useState<'patients' | 'team' | 'broadcast'>('patients');
  
  // Broadcast Form State
  const [broadcastBody, setBroadcastBody] = useState('');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  const isProfessional = user && (user.role === 'admin' || user.role === 'nutritionist' || user.role === 'trainer');
  const isAdmin = user?.role === 'admin';

  // Determine Active Chat Logic on Load
  useEffect(() => {
    if (user && !activeChatId && contactViewMode !== 'broadcast') {
        if (isProfessional) {
            // Find first patient with messages
            const lastMsg = [...messages].reverse().find(m => m.senderId !== user.id && m.receiverId === user.id);
            if (lastMsg) setActiveChatId(lastMsg.senderId);
            else setActiveChatId('u1');
        } else {
            // If patient, default to Admin
            setActiveChatId('admin-1');
        }
    }
  }, [user, messages, contactViewMode]);

  // Mark as Read Logic
  useEffect(() => {
    if (user && activeChatId && contactViewMode !== 'broadcast') {
        markAsRead(activeChatId, user.id);
    }
  }, [activeChatId, messages, user, contactViewMode]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (contactViewMode !== 'broadcast') {
        scrollToBottom();
    }
  }, [messages, activeChatId, contactViewMode]);

  // --- CONTACT LIST LOGIC ---
  const contactList = useMemo(() => {
    if (!user) return [];

    let conversationIds: string[] = [];
    const staffIds = ['admin-1', 'nutri-1', 'trainer-1'];

    if (isProfessional) {
        if (contactViewMode === 'patients') {
            // 1. Get all users I have talked to
            const talkedTo = Array.from(new Set([
                ...messages.filter(m => m.senderId === user.id).map(m => m.receiverId),
                ...messages.filter(m => m.receiverId === user.id).map(m => m.senderId)
            ]));
            
            // 2. Filter out staff members (keep only patients)
            conversationIds = talkedTo.filter(id => !staffIds.includes(id));

            // 3. Fallback: Add mock patients if empty (for demo)
            if (conversationIds.length === 0) conversationIds = ['u1', 'u2', 'u3', 'u4'];
        } else if (contactViewMode === 'team') {
            // TEAM VIEW: Show other staff members
            conversationIds = staffIds.filter(id => id !== user.id);
        } else {
            return []; // Broadcast mode handles its own list
        }
    } else {
        // Patient View: See all staff
        conversationIds = staffIds;
    }

    // Build contact objects
    const contacts = conversationIds.map(id => {
        const metadata = CONTACT_METADATA[id] || { name: 'Usuário', avatar: '', role: 'Contato' };
        
        // Find last message
        const conversationMsgs = messages.filter(m => 
            (m.senderId === id && m.receiverId === user.id) || 
            (m.senderId === user.id && m.receiverId === id)
        );
        const lastMsg = conversationMsgs[conversationMsgs.length - 1];
        
        // Count unread
        const unreadCount = messages.filter(m => m.senderId === id && m.receiverId === user.id && !m.read).length;

        return {
            id,
            ...metadata,
            lastMsg: lastMsg ? lastMsg.content : '',
            time: lastMsg ? lastMsg.timestamp.split(' ')[1]?.substring(0, 5) : '',
            timestampRaw: lastMsg ? lastMsg.timestamp : '0',
            unread: unreadCount
        };
    });

    // Sort by recent
    return contacts.sort((a, b) => b.timestampRaw.localeCompare(a.timestampRaw))
                   .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  }, [messages, user, searchTerm, contactViewMode, isProfessional]);


  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !activeChatId) return;

    const now = new Date();
    const fullDateString = now.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const msg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: activeChatId,
      content: newMessage,
      timestamp: fullDateString,
      read: false,
      type: 'text'
    };

    sendMessage(msg);
    setNewMessage('');

    // Mock Auto-Reply (Only for Patients contacting staff)
    if (user.role === 'patient') {
        setTimeout(() => {
            let replyContent = '';
            if (activeChatId === 'admin-1') replyContent = 'Recebido. Irei analisar e te retorno em breve.';
            else if (activeChatId === 'nutri-1') replyContent = 'Oi! Vi sua mensagem. Já te respondo sobre a dieta.';
            else if (activeChatId === 'trainer-1') replyContent = 'Fala campeão! Já ajusto isso na sua ficha.';
            
            if (replyContent) {
                const reply: Message = {
                    id: (Date.now() + 100).toString(),
                    senderId: activeChatId,
                    receiverId: user.id,
                    content: replyContent,
                    timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    read: false,
                    type: 'text'
                };
                sendMessage(reply);
            }
        }, 3000);
    }
  };

  const handleSendBroadcast = () => {
      if(!broadcastBody.trim()) return;
      setIsSendingBroadcast(true);
      setTimeout(() => {
          sendBroadcast(broadcastBody);
          setBroadcastBody('');
          setIsSendingBroadcast(false);
          alert('Comunicado enviado para todos os pacientes.');
      }, 1500);
  };

  const displayMessages = messages.filter(m => {
    if (!user || !activeChatId) return false;
    return (m.senderId === user.id && m.receiverId === activeChatId) ||
           (m.senderId === activeChatId && m.receiverId === user.id);
  });

  const activeContact = CONTACT_METADATA[activeChatId] || { name: 'Usuário', avatar: '', role: 'Contato' };

  if (!user) return null;
  
  return (
    <div className="h-[calc(100vh-9rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
      {/* Sidebar (Contacts) */}
      <div className={`w-80 border-r border-slate-200 flex flex-col bg-stone-50 ${activeChatId ? 'hidden md:flex' : 'flex w-full'}`}>
            
            {/* View Switcher for Professionals */}
            {isProfessional && (
                <div className="flex border-b border-slate-200 bg-white">
                    <button 
                        onClick={() => setContactViewMode('patients')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                            contactViewMode === 'patients' 
                            ? 'text-primary-800 border-primary-800 bg-primary-50' 
                            : 'text-slate-500 border-transparent hover:bg-slate-50'
                        }`}
                        title="Conversas com Pacientes"
                    >
                        <UserIcon className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => setContactViewMode('team')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                            contactViewMode === 'team' 
                            ? 'text-primary-800 border-primary-800 bg-primary-50' 
                            : 'text-slate-500 border-transparent hover:bg-slate-50'
                        }`}
                        title="Chat da Equipe"
                    >
                        <Stethoscope className="h-4 w-4" />
                    </button>
                    {isAdmin && (
                        <button 
                            onClick={() => setContactViewMode('broadcast')}
                            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                                contactViewMode === 'broadcast' 
                                ? 'text-amber-700 border-amber-600 bg-amber-50' 
                                : 'text-slate-500 border-transparent hover:bg-slate-50'
                            }`}
                            title="Comunicados em Massa"
                        >
                            <Megaphone className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}

            {contactViewMode !== 'broadcast' && (
                <div className="p-4 border-b border-slate-200 bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={contactViewMode === 'team' ? "Buscar profissional..." : "Buscar paciente..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-400 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 bg-slate-50 placeholder-slate-500"
                        />
                    </div>
                </div>
            )}
            
            {/* LIST: CHATS */}
            {contactViewMode !== 'broadcast' && (
                <div className="flex-1 overflow-y-auto">
                    {contactList.map(contact => (
                        <div 
                            key={contact.id} 
                            onClick={() => setActiveChatId(contact.id)}
                            className={`p-4 flex items-center space-x-3 cursor-pointer transition-all border-b border-slate-100 ${
                                activeChatId === contact.id 
                                ? 'bg-white border-l-4 border-l-primary-600 shadow-sm' 
                                : 'hover:bg-white border-l-4 border-l-transparent'
                            }`}
                        >
                            <div className="relative">
                                <img src={contact.avatar} alt={contact.name} className="h-12 w-12 rounded-full bg-slate-200 object-cover border border-slate-200" />
                                {contact.unread > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                        {contact.unread}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className={`text-sm font-bold truncate ${activeChatId === contact.id ? 'text-primary-900' : 'text-slate-700'}`}>{contact.name}</h4>
                                    <span className="text-[10px] text-slate-400">{contact.time}</span>
                                </div>
                                <p className={`text-xs truncate ${contact.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                                    {contact.lastMsg || <span className="italic">Iniciar conversa</span>}
                                </p>
                            </div>
                        </div>
                    ))}
                    {contactList.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            Nenhum contato encontrado.
                        </div>
                    )}
                </div>
            )}

            {/* LIST: BROADCAST HISTORY */}
            {contactViewMode === 'broadcast' && (
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 bg-amber-50 border-b border-amber-100">
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Histórico de Envios</h4>
                    </div>
                    {broadcasts.map(b => (
                        <div key={b.id} className="p-4 border-b border-slate-100 bg-white hover:bg-slate-50 cursor-default">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">{b.date}</span>
                                <div className="flex items-center text-xs text-slate-500">
                                    <Users className="h-3 w-3 mr-1" /> {b.recipientCount}
                                </div>
                            </div>
                            <p className="text-sm text-slate-700 line-clamp-2 italic">"{b.content}"</p>
                        </div>
                    ))}
                </div>
            )}
      </div>

      {/* Main Area: Logic Switch */}
      {contactViewMode === 'broadcast' ? (
          // --- BROADCAST COMPOSER INTERFACE ---
          <div className="flex-1 flex flex-col bg-stone-50 relative">
              <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
                          <Megaphone className="h-5 w-5" />
                      </div>
                      <div>
                          <h3 className="font-bold text-slate-900">Novo Comunicado Geral</h3>
                          <p className="text-xs text-slate-500">Mensagem para todos os pacientes ativos</p>
                      </div>
                  </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto">
                  <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800 mb-6">
                          <AlertTriangle className="h-5 w-5 shrink-0" />
                          <p>Esta mensagem será enviada como uma notificação push e aparecerá no topo do dashboard de <strong>1.248 pacientes</strong>.</p>
                      </div>

                      <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem</label>
                      <textarea 
                          className="w-full border border-slate-400 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[200px] text-slate-900 leading-relaxed resize-none placeholder-slate-500"
                          placeholder="Digite aqui o aviso sobre horários, feriados, campanhas de saúde ou informações importantes..."
                          value={broadcastBody}
                          onChange={(e) => setBroadcastBody(e.target.value)}
                      ></textarea>
                      
                      <div className="mt-6 flex justify-end">
                          <button 
                              onClick={handleSendBroadcast}
                              disabled={!broadcastBody.trim() || isSendingBroadcast}
                              className={`px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all ${
                                  !broadcastBody.trim() || isSendingBroadcast
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-amber-600 text-white hover:bg-amber-700 hover:scale-105'
                              }`}
                          >
                              {isSendingBroadcast ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar Comunicado</>}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      ) : (
          // --- STANDARD CHAT INTERFACE ---
          <div className={`flex-1 flex flex-col bg-[#e5ddd5] relative ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4d3128 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <button onClick={() => setActiveChatId('')} className="md:hidden text-slate-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>

                    <div className="relative">
                        <img src={activeContact?.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{activeContact?.name}</h3>
                        <p className="text-xs text-primary-600 font-medium">
                            {activeContact?.role}
                        </p>
                    </div>
                </div>
                <div className="flex items-center text-slate-400 space-x-4">
                    <div className="hidden sm:flex items-center text-xs bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 font-medium">
                        <Lock className="h-3 w-3 mr-1.5" />
                        Criptografado
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 z-10">
                <div className="flex justify-center py-4">
                    <span className="text-xs bg-slate-200/80 backdrop-blur-sm text-slate-600 px-3 py-1 rounded-full font-medium shadow-sm flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" /> Hoje
                    </span>
                </div>

                {displayMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-2">
                        <div className="bg-slate-200 p-4 rounded-full">
                            <Send className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Inicie a conversa com {activeContact.name}</p>
                    </div>
                )}

                {displayMessages.map((msg, idx) => {
                    const isMe = msg.senderId === user.id;
                    let timeDisplay = '';
                    if (msg.timestamp.includes(' ')) {
                        timeDisplay = msg.timestamp.split(' ')[1].substring(0, 5);
                    }

                    const prevMsg = displayMessages[idx - 1];
                    const isSequence = prevMsg && prevMsg.senderId === msg.senderId;

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-fade-in ${isSequence ? 'mt-1' : 'mt-4'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2 shadow-sm relative text-sm leading-relaxed ${
                                isMe 
                                ? 'bg-primary-600 text-white rounded-2xl rounded-tr-none' 
                                : 'bg-white text-slate-800 rounded-2xl rounded-tl-none'
                            }`}>
                                {!isSequence && (
                                    <div className={`absolute top-0 w-3 h-3 ${isMe ? '-right-2 bg-primary-600 [clip-path:polygon(0_0,0%_100%,100%_0)]' : '-left-2 bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]'}`}></div>
                                )}

                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                
                                <div className={`flex items-center justify-end space-x-1 mt-1 select-none ${isMe ? 'text-primary-200' : 'text-slate-400'}`}>
                                    <span className="text-[10px]">{timeDisplay}</span>
                                    {isMe && (
                                        msg.read ? <CheckCheck className="h-3 w-3 text-blue-300" /> : <Check className="h-3 w-3" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-4 border-t border-slate-200 z-10 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Digite sua mensagem..." 
                            className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                        />
                    </div>
                    <button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
                            newMessage.trim() 
                            ? 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </button>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default Chat;
