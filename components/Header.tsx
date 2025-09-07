import React from 'react';
import { NewDiagramIcon, DownloadIcon } from './Icons';

interface HeaderProps {
    onNewDiagram: () => void;
    onDownload: () => void;
    isDownloadable: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNewDiagram, onDownload, isDownloadable }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center w-full z-10 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800">
                <span role="img" aria-label="brain emoji" className="mr-2">🧠</span>
                Diagram Tutor
            </h1>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onNewDiagram}
                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <NewDiagramIcon className="w-5 h-5 mr-2" />
                    New Diagram
                </button>
                <button
                    onClick={onDownload}
                    disabled={!isDownloadable}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download Result
                </button>
            </div>
        </header>
    );
};