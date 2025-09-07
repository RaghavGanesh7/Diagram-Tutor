import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
    onDone: (dataUrl: string) => void;
    onCancel: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDone, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = '#1e293b'; // slate-800
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                setContext(ctx);
            }
        }
    }, []);

    const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        if (context) {
            context.beginPath();
            context.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        }
    };

    const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context) return;
        const { offsetX, offsetY } = nativeEvent;
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        if (context) {
            context.closePath();
            setIsDrawing(false);
        }
    };

    const clearCanvas = () => {
        if (canvasRef.current && context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };
    
    const handleDone = () => {
        if (canvasRef.current) {
            onDone(canvasRef.current.toDataURL('image/png'));
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-center text-slate-800">Create Your Diagram</h2>
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="border border-slate-300 rounded-md bg-white cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />
                <div className="flex justify-between items-center mt-4">
                    <button onClick={clearCanvas} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300">
                        Clear
                    </button>
                    <div className="space-x-2">
                         <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                            Cancel
                        </button>
                        <button onClick={handleDone} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};