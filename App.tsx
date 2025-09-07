import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { DiagramView } from './components/DiagramView';
import { ChatInput } from './components/ChatInput';
import { DrawingCanvas } from './components/DrawingCanvas';
import { refineDiagram, editDiagram } from './services/geminiService';
import { UploadIcon, DrawIcon } from './components/Icons';
import { AppState } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [refinedImage, setRefinedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      setIsDrawing(false);
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
        setIsLoading(AppState.IDLE);
    };
    reader.readAsDataURL(file);
  };

  const handleDrawingComplete = (dataUrl: string) => {
    setOriginalImage(dataUrl);
    setIsDrawing(false);
  };
  
  const startRefinement = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(AppState.REFINING);
    setError(null);
    try {
      const refined = await refineDiagram(originalImage);
      setRefinedImage(refined);
      setEditedImage(refined); // Set initial edited image to the refined one
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to refine diagram. ${message}`);
    } finally {
      setIsLoading(AppState.IDLE);
    }
  }, [originalImage]);

  useEffect(() => {
    if (originalImage) {
        startRefinement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalImage]);

  const handleAskAI = async (prompt: string) => {
    if (!refinedImage || !prompt) return;

    setIsLoading(AppState.EDITING);
    setError(null);
    try {
      // Use the latest edited image for iterative edits
      const baseImageForEdit = editedImage || refinedImage;
      const newEditedImage = await editDiagram(baseImageForEdit, prompt);
      setEditedImage(newEditedImage);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to edit diagram. ${message}`);
    } finally {
      setIsLoading(AppState.IDLE);
    }
  };

  const resetState = () => {
    setOriginalImage(null);
    setRefinedImage(null);
    setEditedImage(null);
    setIsLoading(AppState.IDLE);
    setError(null);
    setIsDrawing(false);
  };

  const downloadResult = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'diagram-tutor-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isDrawing) {
      return <DrawingCanvas onDone={handleDrawingComplete} onCancel={() => setIsDrawing(false)} />;
    }

    if (originalImage) {
      return (
        <>
          <main className="flex-grow p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <DiagramView title="Original Sketch" imageUrl={originalImage} />
            <DiagramView title="AI-Refined Diagram" imageUrl={refinedImage} isLoading={isLoading === AppState.REFINING} />
            <DiagramView title="Updated / Edited Version" imageUrl={editedImage} isLoading={isLoading === AppState.EDITING} />
          </main>
          <footer className="p-4 bg-white/50 backdrop-blur-sm border-t border-slate-200 sticky bottom-0">
            {error && <p className="text-red-500 text-center mb-2 font-medium">{error}</p>}
            <ChatInput onSubmit={handleAskAI} isLoading={isLoading === AppState.EDITING} />
          </footer>
        </>
      );
    }
    
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-5xl font-extrabold text-slate-800 mb-3">Welcome to Diagram Tutor</h2>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl">Upload a hand-drawn sketch or create one on our canvas. Then, use AI to refine, label, and enhance your diagram with simple text or voice commands.</p>
            <div className="flex space-x-4">
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                    <UploadIcon className="w-5 h-5 mr-2" />
                    Upload Sketch
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                <button
                    onClick={() => setIsDrawing(true)}
                    className="inline-flex items-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                    <DrawIcon className="w-5 h-5 mr-2" />
                    Draw Diagram
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-100">
      <Header 
        onNewDiagram={resetState} 
        onDownload={downloadResult}
        isDownloadable={!!editedImage}
      />
      {renderContent()}
    </div>
  );
};

export default App;