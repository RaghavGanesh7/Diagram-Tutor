import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicIcon, SendIcon } from './Icons';

interface ChatInputProps {
    onSubmit: (prompt: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const { transcript, isListening, startListening, stopListening, browserSupportsSpeechRecognition } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setPrompt(transcript);
        }
    }, [transcript]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSubmit(prompt);
            setPrompt('');
        }
    };
    
    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 max-w-3xl mx-auto">
            <div className="relative flex-grow">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Color the nucleus blue' or 'Label the mitochondria'..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                />
                {browserSupportsSpeechRecognition && (
                    <button
                        type="button"
                        onClick={toggleListening}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        title={isListening ? 'Stop recording' : 'Start recording'}
                    >
                        <MicIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="p-3 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Ask AI"
            >
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SendIcon className="w-5 h-5" />}
            </button>
        </form>
    );
};