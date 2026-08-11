"use client";

import React from 'react';
import CollectionCard, { CollectionProps } from '../CollectionsHub/CollectionCard';
import { MessageSquare } from 'lucide-react';

interface ArticleFooterProps {
    tags: string[];
    similarCollections: CollectionProps[];
}

export default function ArticleFooter({ tags, similarCollections }: ArticleFooterProps) {
    return (
        <div className="w-full mt-12 mb-10 lg:mb-24">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-16">
                <span className="text-white/50 text-sm py-1.5 mr-2">Теги:</span>
                {tags.map(tag => (
                    <span key={tag} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer backdrop-blur-sm">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Similar Collections */}
            <div className="mb-20">
                <h3 className="text-2xl font-bold text-white mb-8">Похожие подборки</h3>
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {similarCollections.map(collection => (
                        <CollectionCard key={collection.id} collection={collection} />
                    ))}
                </div>
            </div>

            {/* Comments Placeholder */}
            <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-md">
                <div className="w-16 h-16 bg-[var(--theme-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--theme-primary)]/30">
                    <MessageSquare className="w-8 h-8 text-[var(--theme-primary)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Обсуждение</h3>
                <p className="text-white/50 mb-6 max-w-md mx-auto">
                    А какие фильмы вы бы добавили в этот список? Поделитесь своим мнением в комментариях!
                </p>
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-3 rounded-xl transition-all">
                    Войти, чтобы оставить комментарий
                </button>
            </div>
        </div>
    );
}
