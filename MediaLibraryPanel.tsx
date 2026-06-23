import React, { useRef } from 'react';
import { MediaAsset } from '../types';

interface MediaLibraryPanelProps {
  mediaAssets: MediaAsset[];
  onUpload: (files: FileList) => void;
  onAddToTimeline: (asset: MediaAsset) => void;
}

const MediaLibraryPanel: React.FC<MediaLibraryPanelProps> = ({ mediaAssets, onUpload, onAddToTimeline }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onUpload(event.target.files);
            // Reset input value to allow uploading the same file again
            event.target.value = '';
        }
    };
    
    return (
        <div className="bg-gray-800 h-full flex flex-col">
            <div className="p-4 shrink-0 border-b border-gray-700">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="video/*,image/*"
                    className="hidden"
                    aria-hidden="true"
                />
                <button 
                    onClick={handleUploadClick}
                    className="w-full py-2 px-4 text-sm font-bold bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Upload Media
                </button>
            </div>
            <div className="overflow-y-auto flex-grow p-4 space-y-2">
                {mediaAssets.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <p>Media Anda akan muncul di sini.</p>
                        <p className="text-sm">Unggah video atau gambar untuk memulai.</p>
                    </div>
                )}
                {mediaAssets.map(asset => (
                    <div key={asset.id} className="bg-gray-700/50 rounded-lg p-2 flex items-center space-x-3 hover:bg-gray-700 transition-colors">
                         <img src={asset.thumbnail} alt={asset.name} className="w-20 h-12 object-cover rounded bg-gray-600 flex-shrink-0" />
                         <div className="flex-grow overflow-hidden">
                            <p className="text-xs text-white truncate font-medium" title={asset.name}>{asset.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{asset.type}</p>
                         </div>
                         <button 
                             onClick={() => onAddToTimeline(asset)}
                             className="text-xs py-2 px-3 bg-blue-600 hover:bg-blue-500 rounded transition-colors flex items-center justify-center shrink-0" title="Add to timeline">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add
                         </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MediaLibraryPanel;