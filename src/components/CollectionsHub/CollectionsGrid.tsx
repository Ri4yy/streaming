"use client";

import React from 'react';
import Link from 'next/link';
import CollectionCard, { CollectionProps } from './CollectionCard';

interface CollectionsGridProps {
    collections: CollectionProps[];
    title?: string;
    viewAllHref?: string;
}

export default function CollectionsGrid({ collections, title, viewAllHref }: CollectionsGridProps) {
    return (
        <div className="w-full mb-16">
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h2>
                    {viewAllHref && (
                        <Link 
                            href={viewAllHref}
                            className="text-sm font-medium text-white/50 hover:text-[var(--theme-primary)] transition-colors flex items-center gap-1 group"
                        >
                            Смотреть все <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                        </Link>
                    )}
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {collections.map(collection => (
                    <CollectionCard key={collection.id} collection={collection} />
                ))}
            </div>
        </div>
    );
}
