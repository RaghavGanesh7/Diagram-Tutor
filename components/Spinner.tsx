import React from 'react';

export const Spinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500">AI is thinking...</p>
        </div>
    );
};