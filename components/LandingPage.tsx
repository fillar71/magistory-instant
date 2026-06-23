import React, { useState } from 'react';

interface LandingPageProps {
  onStartFree: () => void;
  onGenerateVideo: (prompt: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartFree, onGenerateVideo }) => {
  const [idea, setIdea] = useState('');

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
          Ubah Teks Menjadi Video Profesional <span className="text-indigo-400">dalam Hitungan Menit</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Didukung oleh AI canggih, Magistory mengubah ide Anda menjadi montase visual yang menakjubkan dengan mudah.
        </p>
        
        <div className="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 mb-8">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full h-24 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Ketik ide video Anda di sini... contoh: 'Video promosi untuk kedai kopi baru dengan suasana cozy'"
          />
          <button
            onClick={() => onGenerateVideo(idea)}
            className="w-full mt-4 py-3 px-6 text-lg font-bold bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-transform transform hover:scale-105"
          >
            Generate Video
          </button>
        </div>
        
        <div>
          <button 
            onClick={onStartFree}
            className="px-8 py-3 text-lg font-semibold border border-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Start For Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;