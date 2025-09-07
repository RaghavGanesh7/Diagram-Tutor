import React from 'react';
import { Spinner } from './Spinner';

interface DiagramViewProps {
    title: string;
    imageUrl: string | null;
    isLoading?: boolean;
}

export const DiagramView: React.FC<DiagramViewProps> = ({ title, imageUrl, isLoading = false }) => {
    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden border border-slate-200 h-full transition-all duration-300 hover:shadow-xl hover:border-blue-300">
            <h3 className="text-lg font-semibold text-slate-800 p-3 bg-slate-50 border-b border-slate-200">{title}</h3>
            <div className="flex-grow p-4 flex items-center justify-center relative min-h-[200px]">
                {isLoading ? (
                    <Spinner />
                ) : imageUrl ? (
                    <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain" />
                ) : (
                    <div className="text-slate-400">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <p className="mt-2 text-sm">Waiting for diagram...</p>
                    </div>
                )}
            </div>
        </div>
    );
};