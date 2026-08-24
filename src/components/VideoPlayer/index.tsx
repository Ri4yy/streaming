"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Popcorn, Maximize, Minimize, Users, Copy, Send, Edit2, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface VideoPlayerProps {
    tmdbId: number;
    imdbId?: string | null;
    type: 'movie' | 'tv';
}

interface ChatMessage {
    id: string;
    username: string;
    message: string;
    type: 'chat' | 'system';
}

declare global {
    interface Window {
        WatchParty: any;
    }
}

export default function VideoPlayer({ tmdbId, imdbId, type }: VideoPlayerProps) {
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Watch Party States
    const [isWatchParty, setIsWatchParty] = useState(false);
    const [partyInstance, setPartyInstance] = useState<any>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    
    const [username, setUsername] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isChatMinimized, setIsChatMinimized] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    const publisherId = "678901809";
    const mediaType = imdbId ? 'imdb' : (type === 'tv' ? 'series' : 'movie');
    const mediaId = imdbId || tmdbId.toString();

    // Check URL for ?room on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('room')) {
                setIsWatchParty(true);
            }
            // Generate initial random username
            setUsername(`Зритель ${Math.floor(Math.random() * 10000)}`);
        }
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Listen to window messages for chat and player events
    useEffect(() => {
        if (!isWatchParty) return;

        const handleMessage = (e: MessageEvent) => {
            const data = e.data;
            if (!data) return;

            if (data.type === 'chat') {
                setChatMessages(prev => [...prev, {
                    id: Date.now().toString() + Math.random().toString(),
                    username: data.username || 'Зритель',
                    message: data.message,
                    type: 'chat'
                }]);
            } else if (data.type === 'playerEvent' && data.username) {
                let text = '';
                switch (data.event) {
                    case 'play': text = 'запустил видео ▶️'; break;
                    case 'pause': text = 'поставил на паузу ⏸️'; break;
                    case 'seek': text = 'перемотал видео ⏩'; break;
                    case 'file': text = 'переключил серию 📺'; break;
                }
                if (text) {
                    setChatMessages(prev => [...prev, {
                        id: Date.now().toString() + Math.random().toString(),
                        username: data.username,
                        message: text,
                        type: 'system'
                    }]);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isWatchParty]);

    // Initialize WatchParty
    useEffect(() => {
        if (isWatchParty && window.WatchParty && !partyInstance) {
            const timer = setTimeout(() => {
                const party = new window.WatchParty({ 
                    iframe: '#vibix-player',
                    username: username,
                    debug: false
                });
                setPartyInstance(party);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isWatchParty, partyInstance, username]);

    // Update library username if changed
    useEffect(() => {
        if (partyInstance) {
            partyInstance.username = username;
        }
    }, [username, partyInstance]);

    const toggleWatchParty = () => {
        if (isWatchParty) {
            if (partyInstance) {
                try {
                    partyInstance.destroy();
                } catch (e) {
                    console.error('Error destroying party:', e);
                }
                setPartyInstance(null);
            }
            setIsWatchParty(false);
            setChatMessages([]);
            
            // Remove ?room from URL
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('room');
                window.history.pushState({}, '', url);
            }
        } else {
            setIsWatchParty(true);
        }
    };

    const copyInviteLink = () => {
        if (partyInstance) {
            partyInstance.copyInviteLink();
            
            // Add a system message locally
            setChatMessages(prev => [...prev, {
                id: Date.now().toString(),
                username: 'Система',
                message: 'Ссылка скопирована в буфер обмена! Отправьте её друзьям.',
                type: 'system'
            }]);
        }
    };

    const sendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !partyInstance) return;
        
        partyInstance.send({ type: 'chat', message: chatInput, username: username });
        
        // Optimistically add our own message
        setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            username: username,
            message: chatInput,
            type: 'chat'
        }]);
        setChatInput('');
    };

    const handleNameChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditingName(false);
        }
    };

    const insHtml = `<ins id="vibix-player" data-publisher-id="${publisherId}" data-type="${mediaType}" data-id="${mediaId}" data-design="2" data-color1="#333333" data-color2="#d4d4d4" data-color3="#999999" data-color4="#CCCCCC" data-color5="#FFFFFF" data-height="100%" data-width="100%" ${isWatchParty ? 'data-sync="true"' : ''}></ins>`;

    return (
        <>
            {isCinemaMode && (
                <div 
                    className="fixed inset-0 bg-black/90 z-40 transition-opacity duration-300"
                    onClick={() => setIsCinemaMode(false)}
                />
            )}
            
            <div className={`relative transition-all duration-500 ease-in-out mx-auto ${isCinemaMode ? 'z-50' : 'z-10'} ${isExpanded ? 'w-full max-w-full' : 'w-full max-w-[1000px]'}`}>
                
                <div className="relative">
                    <div 
                        key={isWatchParty ? 'sync' : 'normal'} // Force re-render when changing modes
                        className="w-full aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10 shadow-lg relative transition-all duration-300"
                        dangerouslySetInnerHTML={{ __html: insHtml }}
                        suppressHydrationWarning
                    />
                </div>
                
                {/* Chat UI Overlay (Fixed at bottom right of the screen) */}
                {isWatchParty && (
                    <div className={`fixed right-6 w-80 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-[60] transition-all duration-500 ease-in-out ${isChatMinimized ? 'bottom-6 h-[48px]' : 'bottom-6 h-[450px]'}`}>
                        {/* Chat Header */}
                        <div className={`px-4 py-3 min-h-[48px] border-b flex flex-col gap-2 bg-white/5 flex-shrink-0 cursor-pointer transition-colors justify-center ${isChatMinimized ? 'border-transparent' : 'border-white/10'}`} onClick={(e) => { 
                            // Only minimize if clicking the header background or the minimize button itself
                            const target = e.target as HTMLElement;
                            if (target.closest('.minimize-btn') || target === e.currentTarget || target.classList.contains('header-title')) {
                                setIsChatMinimized(!isChatMinimized);
                            }
                        }}>
                            <div className="flex justify-between items-center">
                                <span className="header-title text-sm font-semibold flex items-center gap-2 text-[var(--theme-primary)]">
                                    <Users className="w-4 h-4 pointer-events-none" /> 
                                    Чат комнаты
                                </span>
                                <button 
                                    className="minimize-btn text-white/50 hover:text-white transition-colors p-1"
                                    onClick={(e) => { e.stopPropagation(); setIsChatMinimized(!isChatMinimized); }}
                                >
                                    {isChatMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>
                            
                            {!isChatMinimized && (
                                <div className="flex items-center gap-2 text-xs text-white/70">
                                    <span>Ваше имя:</span>
                                    {isEditingName ? (
                                        <div className="flex items-center gap-1 flex-1">
                                            <input 
                                                autoFocus
                                                type="text" 
                                                value={username}
                                                onChange={e => setUsername(e.target.value)}
                                                onKeyDown={handleNameChange}
                                                onBlur={() => setIsEditingName(false)}
                                                className="bg-black/50 border border-white/20 rounded px-2 py-0.5 w-full outline-none text-white focus:border-[var(--theme-primary)]"
                                            />
                                            <button onClick={(e) => { e.stopPropagation(); setIsEditingName(false); }} className="text-[var(--theme-primary)] hover:text-white transition-colors p-1">
                                                <Check className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 group cursor-pointer py-0.5" onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}>
                                            <span className="font-medium text-white truncate max-w-[120px]">{username}</span>
                                            <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Chat Messages */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-white/20 custom-scrollbar opacity-100 transition-opacity duration-300">
                            {chatMessages.length === 0 && (
                                <div className="text-center text-white/40 text-xs mt-auto mb-auto">
                                    Здесь будут сообщения чата
                                </div>
                            )}
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`text-sm ${msg.type === 'system' ? 'text-[var(--theme-primary)]/70 text-center text-xs my-1' : ''}`}>
                                    {msg.type === 'chat' ? (
                                        <div className="bg-white/10 p-2 rounded-lg inline-block max-w-[95%] border border-white/5">
                                            <span className="font-semibold text-[var(--theme-primary)] text-xs block mb-1">{msg.username}</span>
                                            <span className="text-white/90 break-words">{msg.message}</span>
                                        </div>
                                    ) : (
                                        <span><strong className="text-white/70">{msg.username}</strong> {msg.message}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Chat Input */}
                        <form onSubmit={sendChat} className="p-3 border-t border-white/10 bg-black/40 flex gap-2 flex-shrink-0">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                placeholder="Сообщение..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--theme-primary)]/50 transition-colors text-white"
                            />
                            <button type="submit" className="p-2 px-3 bg-[var(--theme-primary)] text-white rounded-lg hover:brightness-110 transition-all flex items-center justify-center">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}
                
                <div className="flex items-center gap-3 mt-4">
                    <button 
                        onClick={() => setIsCinemaMode(!isCinemaMode)}
                        className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center border backdrop-blur-xl ${
                            isCinemaMode 
                                ? 'bg-[var(--theme-primary)]/20 border-[var(--theme-primary)]/50 text-[var(--theme-primary)]' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                        }`}
                        title="Режим кинотеатра"
                    >
                        <Popcorn className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center border backdrop-blur-xl ${
                            isExpanded 
                                ? 'bg-[var(--theme-primary)]/20 border-[var(--theme-primary)]/50 text-[var(--theme-primary)]' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                        }`}
                        title={isExpanded ? "Свернуть" : "Развернуть"}
                    >
                        {isExpanded ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                    
                    {/* Watch Party Button */}
                    <button 
                        onClick={toggleWatchParty}
                        className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center border backdrop-blur-xl ${
                            isWatchParty 
                                ? 'bg-[var(--theme-primary)]/20 border-[var(--theme-primary)]/50 text-[var(--theme-primary)]' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                        }`}
                        title={isWatchParty ? "Отключить совместный просмотр" : "Совместный просмотр"}
                    >
                        <Users className="w-5 h-5" />
                    </button>

                    {/* Invite Link Button (Only if Watch Party is active) */}
                    {isWatchParty && (
                        <button 
                            onClick={copyInviteLink}
                            className="ml-auto px-4 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-2 text-sm font-medium border backdrop-blur-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                            title="Скопировать ссылку"
                        >
                            <Copy className="w-4 h-4" />
                            Скопировать ссылку
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
