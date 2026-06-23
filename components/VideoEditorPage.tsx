import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VideoScriptScene, MediaAsset, TimelineClip } from '../types';
import { searchPexelsVideos } from '../services/pexelsService';
import MediaLibraryPanel from '../MediaLibraryPanel';

interface VideoEditorPageProps {
  initialScript: VideoScriptScene[];
  showError: (message: string) => void;
}

interface SceneWithMedia extends VideoScriptScene {
    media?: MediaAsset;
    alternatives: MediaAsset[];
    currentAlternativeIndex: number;
}

const LOCAL_STORAGE_KEY = 'magistory-ai-video-project';

// New component to display script and generated media
const ScriptAndMediaPanel: React.FC<{ 
    scenes: SceneWithMedia[];
    onMediaChange: (sceneIndex: number) => void;
    onAddToTimeline: (asset: MediaAsset) => void;
    onKeywordChange: (sceneIndex: number, newKeyword: string) => void;
    onKeywordSearch: (sceneIndex: number) => void;
}> = ({ scenes, onMediaChange, onAddToTimeline, onKeywordChange, onKeywordSearch }) => {
    
    if (!scenes || scenes.length === 0) {
        return (
            <div className="bg-gray-800 h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
                <p className="font-semibold">No Script Loaded</p>
                <p className="text-sm">Generate a script from the 'Text to Video' page to see media suggestions here.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 h-full flex flex-col">
            <div className="overflow-y-auto flex-grow p-4 space-y-4">
                {scenes.map((scene, index) => (
                    <div key={scene.scene} className="bg-gray-700/50 rounded-lg overflow-hidden shadow-md">
                        {scene.media ? <img src={scene.media.thumbnail} alt={scene.visual} className="w-full h-32 object-cover" /> : <div className="w-full h-32 bg-gray-600 flex items-center justify-center text-xs text-gray-400">No media found</div>}
                        <div className="p-3">
                            <h4 className="font-bold text-sm mb-2">Scene {scene.scene}</h4>
                             <div className="flex items-center space-x-2 mb-2">
                                <input 
                                    type="text"
                                    value={scene.stock_keyword}
                                    onChange={(e) => onKeywordChange(index, e.target.value)}
                                    className="flex-grow bg-gray-600 text-xs rounded-md p-2 border border-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    aria-label={`Keyword for scene ${scene.scene}`}
                                />
                                <button
                                    onClick={() => onKeywordSearch(index)}
                                    className="p-2 bg-gray-600 hover:bg-indigo-600 rounded transition-colors"
                                    title="Search for new media with this keyword"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-gray-300 mb-3 h-8 overflow-hidden" title={scene.narration}>
                                {scene.narration}
                            </p>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => onMediaChange(index)}
                                    className="flex-1 text-xs py-2 px-3 bg-gray-600 hover:bg-indigo-600 rounded transition-colors flex items-center justify-center"
                                    title="Next alternative"
                                    disabled={!scene.media || scene.alternatives.length < 2}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    Next
                                </button>
                                <button 
                                    onClick={() => scene.media && onAddToTimeline(scene.media)}
                                    className="flex-1 text-xs py-2 px-3 bg-blue-600 hover:bg-blue-500 rounded transition-colors flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed" title="Add to timeline"
                                    disabled={!scene.media}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const InspectorPanel: React.FC = () => {
    return (
        <div className="bg-gray-800 h-full p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Properties</h3>
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-400">Volume</label>
                    <input type="range" className="w-full mt-1"/>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Opacity</label>
                    <input type="range" className="w-full mt-1"/>
                </div>
                 <div>
                    <label className="text-sm text-gray-400">Scale</label>
                    <input type="range" className="w-full mt-1"/>
                </div>
            </div>
        </div>
    );
};

const PIXELS_PER_SECOND = 20;

const TimeRuler: React.FC<{ totalDuration: number; zoomLevel: number; scrollLeft: number }> = ({ totalDuration, zoomLevel, scrollLeft }) => {
    const rulerRef = useRef<HTMLCanvasElement>(null);
    const totalWidth = totalDuration * PIXELS_PER_SECOND * zoomLevel;

    useEffect(() => {
        const canvas = rulerRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#9ca3af'; // gray-400
        ctx.font = '10px sans-serif';

        const majorTickInterval = zoomLevel > 2 ? 1 : zoomLevel > 0.5 ? 5 : 10;
        const minorTicksPerMajor = 5;

        for (let i = 0; i <= totalDuration; i += majorTickInterval / minorTicksPerMajor) {
            const x = i * PIXELS_PER_SECOND * zoomLevel - scrollLeft;
            if (x < -10 || x > canvas.width / dpr) continue;

            const isMajorTick = i % majorTickInterval === 0;

            ctx.beginPath();
            ctx.moveTo(x, isMajorTick ? 8 : 12);
            ctx.lineTo(x, 24);
            ctx.strokeStyle = isMajorTick ? '#9ca3af' : '#6b7280'; // gray-400, gray-500
            ctx.lineWidth = 1;
            ctx.stroke();

            if (isMajorTick) {
                ctx.textAlign = 'center';
                ctx.fillText(`${i}s`, x, 18);
            }
        }
    }, [totalDuration, zoomLevel, scrollLeft]);

    return (
        <div className="relative h-6 bg-gray-700 w-full overflow-hidden shrink-0">
            <canvas ref={rulerRef} className="w-full h-full" />
        </div>
    );
};

const Playhead: React.FC<{ currentTime: number; zoomLevel: number }> = ({ currentTime, zoomLevel }) => {
    const leftPosition = currentTime * PIXELS_PER_SECOND * zoomLevel;
    return (
        <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{ transform: `translateX(${leftPosition}px)` }}
        >
            <div className="w-0.5 h-full bg-red-500"></div>
            <div className="absolute -top-1.5 -translate-x-1/2 w-3 h-3 bg-red-500" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
        </div>
    );
};


const Timeline: React.FC<{ 
    clips: TimelineClip[]; 
    assets: Record<string, MediaAsset>;
    zoomLevel: number;
    onZoomChange: (newZoom: number) => void;
    currentTime: number;
    totalDuration: number;
}> = ({ clips, assets, zoomLevel, onZoomChange, currentTime, totalDuration }) => {
    const videoClips = clips.filter(c => c.track === 'video');
    const timelineContainerRef = useRef<HTMLDivElement>(null);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollLeft(e.currentTarget.scrollLeft);
    };
    
    const handleZoomIn = () => onZoomChange(Math.min(zoomLevel * 1.5, 20));
    const handleZoomOut = () => onZoomChange(Math.max(zoomLevel / 1.5, 0.1));


    const renderClips = (clipsToRender: TimelineClip[], color: string) => {
        if (!clipsToRender.length) return null;

        return clipsToRender.map(clip => {
            const asset = assets[clip.assetId];
            if (!asset) return null;
            return (
                <div 
                    key={clip.id} 
                    className={`${color} h-16 rounded flex items-center p-2 text-xs overflow-hidden whitespace-nowrap absolute top-2`} 
                    style={{ 
                        width: `${(clip.end - clip.start) * PIXELS_PER_SECOND * zoomLevel}px`,
                        left: `${clip.start * PIXELS_PER_SECOND * zoomLevel}px`,
                        minWidth: '20px'
                    }}
                >
                   {asset.name}
                </div>
            );
        });
    }

     const gridSpacing = useMemo(() => {
        const interval = zoomLevel > 2 ? 1 : zoomLevel > 0.5 ? 5 : 10;
        return interval * PIXELS_PER_SECOND * zoomLevel;
    }, [zoomLevel]);


    return (
        <div className="bg-gray-900 h-full flex flex-col">
            <div className="flex items-center space-x-4 p-2 bg-gray-800 rounded mb-2 shrink-0">
                <div className="flex items-center space-x-2">
                     <button title="Split" className="p-2 hover:bg-gray-700 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v12a1 1 0 102 0V4zM15 4a1 1 0 10-2 0v12a1 1 0 102 0V4zM9 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                     <button title="Delete" className="p-2 text-red-400 hover:bg-gray-700 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                </div>
                <div className="flex items-center space-x-2 flex-grow">
                    <button onClick={handleZoomOut} className="p-2 hover:bg-gray-700 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></button>
                    <input
                        type="range"
                        min="0.1"
                        max="20"
                        step="0.1"
                        value={zoomLevel}
                        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <button onClick={handleZoomIn} className="p-2 hover:bg-gray-700 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg></button>
                </div>
            </div>
            <TimeRuler totalDuration={totalDuration} zoomLevel={zoomLevel} scrollLeft={scrollLeft} />
            <div ref={timelineContainerRef} onScroll={handleScroll} className="flex-grow space-y-1 overflow-auto">
                <div className="h-full relative" style={{ 
                    width: `${totalDuration * PIXELS_PER_SECOND * zoomLevel}px`,
                    backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
                    backgroundSize: `${gridSpacing}px 100%`
                }}>
                    <Playhead currentTime={currentTime} zoomLevel={zoomLevel} />
                    {/* Video Track */}
                    <div className="bg-gray-800/50 rounded p-1 h-20 relative w-full">
                        <span className="text-xs text-gray-500 absolute top-1 left-2 z-10">Video</span>
                        {videoClips.length > 0 ? renderClips(videoClips, 'bg-blue-500') : <div className="text-gray-600 text-sm absolute left-14 top-1/2 -translate-y-1/2">Add media to the video track</div>}
                    </div>
                    {/* Audio Track */}
                    <div className="bg-gray-800/50 rounded p-1 h-16 relative w-full mt-1">
                        <span className="text-xs text-gray-500 absolute top-1 left-2 z-10">Audio</span>
                        <div className="text-gray-600 text-sm absolute left-14 top-1/2 -translate-y-1/2">Add audio to this track</div>
                    </div>
                    {/* Text Track */}
                    <div className="bg-gray-800/50 rounded p-1 h-16 relative w-full mt-1">
                        <span className="text-xs text-gray-500 absolute top-1 left-2 z-10">Text</span>
                        <div className="text-gray-600 text-sm absolute left-14 top-1/2 -translate-y-1/2">Add text elements here</div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const VideoEditorPage: React.FC<VideoEditorPageProps> = ({ initialScript, showError }) => {
    const [rendering, setRendering] = useState(false);
    const [activeTab, setActiveTab] = useState<'script' | 'media'>('script');
    
    const [scenesWithMedia, setScenesWithMedia] = useState<SceneWithMedia[]>([]);
    const [userMedia, setUserMedia] = useState<MediaAsset[]>([]);
    const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([]);
    const [zoomLevel, setZoomLevel] = useState(1);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isProcessingScript, setIsProcessingScript] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const animationFrameRef = useRef<number | null>(null);

     const totalDuration = useMemo(() => {
        if (timelineClips.length === 0) return 30; // Default duration
        return Math.max(30, ...timelineClips.map(c => c.end));
    }, [timelineClips]);

    // Load project from localStorage on initial mount
    useEffect(() => {
        // Only load if no new script is being passed in
        if (!initialScript || initialScript.length === 0) {
             try {
                const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (savedStateJSON) {
                    const savedState = JSON.parse(savedStateJSON);
                    if (savedState) {
                        setScenesWithMedia(savedState.scenesWithMedia || []);
                        setUserMedia(savedState.userMedia || []);
                        setTimelineClips(savedState.timelineClips || []);
                    }
                }
            } catch (error) {
                console.error("Failed to load project from localStorage", error);
                // Clear corrupted data
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
    }, []); // Empty dependency array ensures this runs only once on mount

     // Save project state to localStorage whenever it changes
    useEffect(() => {
        // Don't save if it's the initial empty state before anything is loaded or generated
        if (scenesWithMedia.length > 0 || userMedia.length > 0 || timelineClips.length > 0) {
            const projectState = {
                scenesWithMedia,
                userMedia,
                timelineClips,
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectState));
        }
    }, [scenesWithMedia, userMedia, timelineClips]);

    useEffect(() => {
        const processInitialScript = async () => {
            if (initialScript && initialScript.length > 0) {
                // Explicitly reset state for the new project to ensure a clean slate.
                setTimelineClips([]);
                setScenesWithMedia([]);
                
                setIsProcessingScript(true);
                try {
                    // Step 1: Fetch all media alternatives for each scene.
                    const scenesWithAlternativesPromises = initialScript.map(async (scene) => {
                        const alternatives = await searchPexelsVideos(scene.stock_keyword, 5);
                        return {
                            ...scene,
                            alternatives,
                            currentAlternativeIndex: 0,
                        };
                    });
                    const fetchedScenes = await Promise.all(scenesWithAlternativesPromises);

                    // Step 2 (REVISED): Build the timeline with robust, fixed durations.
                    let currentTimelineTime = 0;
                    const newClips: TimelineClip[] = [];
                    const finalScenesWithMedia = fetchedScenes.map(scene => {
                        const initialMedia = scene.alternatives[0]; // This can be undefined if no media is found
                        const sceneDuration = 5; // Use a fixed, predictable duration for each scene.

                        // Only add a clip to the timeline if media was actually found.
                        if (initialMedia) {
                            const newClip: TimelineClip = {
                                id: self.crypto.randomUUID(),
                                assetId: initialMedia.id,
                                track: 'video',
                                start: currentTimelineTime,
                                end: currentTimelineTime + sceneDuration, // Use the fixed duration
                                layer: 0,
                            };
                            newClips.push(newClip);
                        }
                        
                        // CRITICAL: Always advance the timeline cursor by the fixed duration,
                        // regardless of whether media was found. This prevents timeline gaps/collapses.
                        currentTimelineTime += sceneDuration;

                        return { ...scene, media: initialMedia };
                    });
                    
                    // Step 3: Set state for both scenes and timeline clips
                    setScenesWithMedia(finalScenesWithMedia);
                    setTimelineClips(newClips);
                } catch (error) {
                    console.error("Failed to process initial script:", error);
                     if (error instanceof Error) {
                        showError(error.message);
                    } else {
                        showError("Gagal memproses skrip dan mengambil media awal.");
                    }
                } finally {
                    setIsProcessingScript(false);
                }
            }
        };

        processInitialScript();
    }, [initialScript, showError]);

    const allAssets = useMemo(() => {
        const assetsMap: Record<string, MediaAsset> = {};
        scenesWithMedia.forEach(scene => {
            if(scene.alternatives) {
                scene.alternatives.forEach(alt => {
                    assetsMap[alt.id] = alt;
                });
            }
        });
        userMedia.forEach(asset => {
            assetsMap[asset.id] = asset;
        });
        return assetsMap;
    }, [scenesWithMedia, userMedia]);

    // FIX: Refactored playback control effect for correctness and to fix cancelAnimationFrame error.
    // This effect manages the animation frame loop for playback.
    useEffect(() => {
        if (!isPlaying) {
            // If not playing, do nothing. The cleanup from the previous run will have stopped the loop.
            return;
        }
    
        let lastTime = performance.now();
        
        const tick = (now: number) => {
          const deltaTime = (now - lastTime) / 1000;
          lastTime = now;
    
          setCurrentTime(prevTime => {
            const newTime = prevTime + deltaTime;
    
            if (newTime >= totalDuration) {
              setIsPlaying(false); // Triggers a re-render, which causes this effect's cleanup to run and stop the loop.
              return totalDuration;
            }
            
            // If we're still playing, request the next frame. This is the core of the loop.
            animationFrameRef.current = requestAnimationFrame(tick);
            return newTime;
          });
        };
    
        // Start the animation loop.
        animationFrameRef.current = requestAnimationFrame(tick);
    
        // The cleanup function is critical. It's called when the component unmounts
        // or when a dependency changes (in this case, when `isPlaying` becomes false).
        return () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        };
      }, [isPlaying, totalDuration]);

    // Video source and time synchronization effect
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const activeClip = timelineClips.find(
            clip => currentTime >= clip.start && currentTime < clip.end
        );

        if (activeClip) {
            const asset = allAssets[activeClip.assetId];
            if (asset && video.src !== asset.src) {
                video.src = asset.src;
            }
            
            const seekTime = currentTime - activeClip.start;
            // Seek only if the difference is significant to avoid stuttering
            if (Math.abs(video.currentTime - seekTime) > 0.2) {
                video.currentTime = seekTime;
            }

            if (isPlaying && video.paused) {
                video.play().catch(e => console.error("Error playing video:", e));
            } else if (!isPlaying && !video.paused) {
                video.pause();
            }
        } else {
            video.pause();
            if (video.src) {
                // Clear source only if it's not already empty to avoid unnecessary reloads
                video.removeAttribute('src');
                video.load();
            }
        }
    }, [currentTime, isPlaying, timelineClips, allAssets]);


    const handleMediaChange = (sceneIndex: number) => {
        setScenesWithMedia(currentScenes => {
            const newScenes = [...currentScenes];
            const scene = newScenes[sceneIndex];
            if (scene && scene.alternatives.length > 0) {
                const newIndex = (scene.currentAlternativeIndex + 1) % scene.alternatives.length;
                scene.currentAlternativeIndex = newIndex;
                scene.media = scene.alternatives[newIndex];
            }
            return newScenes;
        });
    };

    const handleKeywordChange = (sceneIndex: number, newKeyword: string) => {
        setScenesWithMedia(currentScenes => {
            const newScenes = [...currentScenes];
            const scene = newScenes[sceneIndex];
            if (scene) {
                scene.stock_keyword = newKeyword;
            }
            return newScenes;
        });
    };

    const handleKeywordSearch = async (sceneIndex: number) => {
        const sceneToUpdate = scenesWithMedia[sceneIndex];
        if (!sceneToUpdate) return;

        try {
            const newAlternatives = await searchPexelsVideos(sceneToUpdate.stock_keyword, 5);
            setScenesWithMedia(currentScenes => {
                const newScenes = [...currentScenes];
                const scene = newScenes[sceneIndex];
                if (scene) {
                    scene.alternatives = newAlternatives;
                    scene.currentAlternativeIndex = 0;
                    scene.media = newAlternatives.length > 0 ? newAlternatives[0] : undefined;
                }
                return newScenes;
            });
        } catch (error) {
            console.error("Failed to search for new media:", error);
            if (error instanceof Error) {
                showError(error.message);
            } else {
                showError("Gagal mencari media baru.");
            }
        }
    };

    const handleFileUpload = (files: FileList) => {
        const newAssets: MediaAsset[] = Array.from(files).map(file => {
            const isVideo = file.type.startsWith('video/');
            const videoPlaceholderThumbnail = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z' /%3E%3C/svg%3E";

            return {
                id: self.crypto.randomUUID(),
                name: file.name,
                type: isVideo ? 'video' : 'image',
                src: URL.createObjectURL(file),
                thumbnail: isVideo ? videoPlaceholderThumbnail : URL.createObjectURL(file),
                duration: isVideo ? undefined : 5, // Default 5s for images
            };
        });

        newAssets.forEach(asset => {
            if (asset.type === 'video') {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                   URL.revokeObjectURL(video.src);
                   setUserMedia(prev => {
                       const updated = [...prev];
                       const targetAsset = updated.find(a => a.id === asset.id);
                       if (targetAsset) {
                           targetAsset.duration = video.duration;
                       }
                       return updated;
                   });
                };
                 video.src = asset.src;
            }
        });

        setUserMedia(prev => [...prev, ...newAssets]);
    };

    const handleAddToTimeline = (asset: MediaAsset) => {
        setTimelineClips(prevClips => {
            const videoTrackClips = prevClips.filter(c => c.track === 'video');
            const lastClip = videoTrackClips.length > 0 ? videoTrackClips.reduce((a, b) => a.end > b.end ? a : b) : null;
            const newStart = lastClip ? lastClip.end : 0;
            const clipDuration = Math.min(asset.duration || 5, 5); 
            const newClip: TimelineClip = {
                 id: self.crypto.randomUUID(),
                 assetId: asset.id,
                 track: 'video',
                 start: newStart,
                 end: newStart + clipDuration,
                 layer: 0,
            };
            return [...prevClips, newClip].sort((a,b) => a.start - b.start);
        });
    };

    const handlePlayPause = () => {
        if (timelineClips.length === 0) return;
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            if (currentTime >= totalDuration) {
                setCurrentTime(0);
            }
            setIsPlaying(true);
        }
    };

    const handleRender = () => {
        setRendering(true);
        setTimeout(() => {
            alert("Video rendering complete! (simulated)");
            setRendering(false);
        }, 5000);
    };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative">
        {isProcessingScript && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                 <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-semibold mt-4 text-white">AI is building your first draft...</p>
                <p className="text-sm text-gray-400">Fetching relevant media and placing it on the timeline.</p>
            </div>
        )}
        <div className="flex justify-end items-center p-2 bg-gray-800 border-b border-gray-700">
             <button
                onClick={handleRender}
                disabled={rendering}
                className="px-6 py-2 font-semibold bg-green-600 rounded-md hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-wait"
            >
                {rendering ? 'Rendering...' : 'Render'}
            </button>
        </div>
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-1 gap-4 p-2 overflow-y-auto lg:overflow-hidden">
            {/* Left Column */}
            <div className="lg:col-span-3 flex flex-col bg-gray-800 rounded-lg min-h-[80vh] lg:min-h-0">
                 <div className="shrink-0 border-b border-gray-700">
                    <nav className="flex space-x-1 p-1" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('script')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'script' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        >
                            Script & AI Media
                        </button>
                        <button
                            onClick={() => setActiveTab('media')}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'media' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        >
                            Media Saya
                        </button>
                    </nav>
                </div>
                <div className="flex-grow overflow-hidden">
                    {activeTab === 'script' ? (
                        <ScriptAndMediaPanel 
                            scenes={scenesWithMedia}
                            onMediaChange={handleMediaChange}
                            onAddToTimeline={handleAddToTimeline}
                            onKeywordChange={handleKeywordChange}
                            onKeywordSearch={handleKeywordSearch}
                        />
                    ) : (
                        <MediaLibraryPanel 
                            mediaAssets={userMedia}
                            onUpload={handleFileUpload}
                            onAddToTimeline={handleAddToTimeline}
                        />
                    )}
                </div>
            </div>

            {/* Center Column */}
            <div className="order-first lg:order-none lg:col-span-7 flex flex-col gap-2 min-h-[80vh] lg:min-h-0">
                {/* Preview Player */}
                <div className="bg-black flex-grow flex items-center justify-center relative rounded-lg overflow-hidden">
                     <video
                        ref={videoRef}
                        muted
                        playsInline
                        className="max-w-full max-h-full"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                    />
                    {timelineClips.length === 0 && !isProcessingScript && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="mt-4">Preview akan muncul di sini</p>
                            <p className="text-sm">Tambahkan media ke timeline dan tekan putar</p>
                        </div>
                    )}
                    <div 
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity duration-300 group cursor-pointer" 
                        onClick={handlePlayPause}
                    >
                        <button className="text-white bg-black bg-opacity-50 rounded-full p-4 transform opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 focus:outline-none" aria-label={isPlaying ? 'Pause' : 'Play'}>
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664l-3.197-1.882z" clipRule="evenodd" /></svg>
                            )}
                        </button>
                    </div>
                </div>
                {/* Timeline */}
                <div className="h-1/3">
                   <Timeline 
                       clips={timelineClips} 
                       assets={allAssets}
                       zoomLevel={zoomLevel}
                       onZoomChange={setZoomLevel}
                       currentTime={currentTime}
                       totalDuration={totalDuration}
                   />
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 min-h-[50vh] lg:min-h-0">
                <InspectorPanel />
            </div>
        </div>
    </div>
  );
};

export default VideoEditorPage;