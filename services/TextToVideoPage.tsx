import React, { useState, useEffect } from 'react';
import { generateVideoScript } from './geminiService';
import { VideoScriptScene } from '../types';

interface TextToVideoPageProps {
  onScriptGenerated: (script: VideoScriptScene[]) => void;
  initialPrompt?: string;
  showError: (message: string) => void;
}

const durationOptions = [
  { value: 1, label: '1 menit', credits: 1 },
  { value: 3, label: '3 menit', credits: 3 },
  { value: 5, label: '5 menit', credits: 5 },
  { value: 10, label: '10 menit', credits: 10 },
  { value: 30, label: '30 menit', credits: 30 },
];

const TextToVideoPage: React.FC<TextToVideoPageProps> = ({ onScriptGenerated, initialPrompt, showError }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [duration, setDuration] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  // Mengisi prompt secara otomatis dari halaman utama
  useEffect(() => {
    if (initialPrompt) {
        setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const selectedDuration = durationOptions.find(d => d.value === duration) || durationOptions[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const script = await generateVideoScript(prompt, duration, aspectRatio);
      onScriptGenerated(script);
    } catch (error) {
      console.error("Failed to generate script:", error);
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("Terjadi kesalahan yang tidak diketahui saat membuat skrip.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Buat Video dari Teks</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Ide Video Anda</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="Jelaskan video yang ingin Anda buat..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Aspek Rasio</label>
            <div className="flex space-x-4">
              <button type="button" onClick={() => setAspectRatio('9:16')} className={`flex-1 p-3 rounded-md border-2 transition-colors ${aspectRatio === '9:16' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}>
                9:16 (Potret)
              </button>
              <button type="button" onClick={() => setAspectRatio('16:9')} className={`flex-1 p-3 rounded-md border-2 transition-colors ${aspectRatio === '16:9' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}>
                16:9 (Lanskap)
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">Durasi Video</label>
            <input
              id="duration"
              type="range"
              min="0"
              max={durationOptions.length - 1}
              value={durationOptions.findIndex(d => d.value === duration)}
              onChange={(e) => setDuration(durationOptions[parseInt(e.target.value, 10)].value)}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between flex-wrap gap-y-1 text-xs text-gray-400 mt-2">
              {durationOptions.map(d => <span key={d.value}>{d.label}</span>)}
            </div>
            <p className="text-center mt-3 text-sm">Durasi: {selectedDuration.label} / Biaya: <span className="font-bold text-green-400">{selectedDuration.credits} Kredit</span></p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 text-lg font-bold bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI sedang meracik videomu...
              </>
            ) : (
              'Generate Script & Media'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TextToVideoPage;