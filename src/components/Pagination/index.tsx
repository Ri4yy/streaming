"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={`page-${i}`}
                    onClick={() => handlePageChange(i)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        currentPage === i 
                        ? 'bg-red-500 text-white font-medium' 
                        : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors duration-300"
            >
                <BsChevronLeft />
            </button>
            
            {currentPage > 3 && totalPages > 5 && (
                <React.Fragment key="first-page">
                    <button 
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300"
                    >
                        1
                    </button>
                    <span className="text-white/50 px-1">...</span>
                </React.Fragment>
            )}
            
            {renderPageNumbers()}
            
            {currentPage < totalPages - 2 && totalPages > 5 && (
                <React.Fragment key="last-page">
                    <span className="text-white/50 px-1">...</span>
                    <button 
                        onClick={() => handlePageChange(totalPages)}
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300"
                    >
                        {totalPages}
                    </button>
                </React.Fragment>
            )}

            <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors duration-300"
            >
                <BsChevronRight />
            </button>
        </div>
    );
}
