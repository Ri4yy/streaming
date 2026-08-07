"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { BsPlayFill, BsPauseFill, BsVolumeUpFill, BsVolumeMuteFill, BsFullscreen, BsFullscreenExit } from 'react-icons/bs';

interface CustomPlayerProps {
    url: string;
    autoPlay?: boolean;
}

export default function CustomPlayer({ url, autoPlay = false }: CustomPlayerProps) {
    const playerRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    
    const [playing, setPlaying] = useState(autoPlay);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
        setMuted(parseFloat(e.target.value) === 0);
    };

    const handleToggleMute = () => {
        setMuted(!muted);
        if (volume === 0 && !muted) {
            setVolume(0.8); // Restore volume if it was 0
        }
    };

    const handleProgress = (state: { played: number, playedSeconds: number }) => {
        if (!playing) return;
        setPlayed(state.played);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayed(parseFloat(e.target.value));
    };

    const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
        if (playerRef.current) {
            playerRef.current.currentTime = parseFloat(e.currentTarget.value) * duration;
        }
    };

    const handleDuration = (duration: number) => {
        setDuration(duration);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const formatTime = (seconds: number) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (playing) {
                setShowControls(false);
            }
        }, 2500);
    };

    const handleMouseLeave = () => {
        if (playing) {
            setShowControls(false);
        }
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
                if (!showControls) setShowControls(true);
            }}
        >
            {/* Player */}
            {isMounted && (
                <ReactPlayer
                    {...({
                        ref: playerRef,
                        url: url,
                        width: "100%",
                        height: "100%",
                        playing: playing,
                        volume: volume,
                        muted: muted,
                        light: true,
                        playIcon: <React.Fragment></React.Fragment>,
                        onProgress: handleProgress,
                        onDuration: handleDuration,
                        onEnded: () => setPlaying(false),
                        onPlay: () => setPlaying(true),
                        onPause: () => setPlaying(false),
                        style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
                        controls: false,
                        config: {
                            youtube: {
                                playerVars: { rel: 0 }
                            }
                        }
                    } as any)}
                />
            )}

            {/* Click to play/pause overlay (middle of screen) */}
            <div 
                className={`absolute inset-0 z-10 flex justify-center items-center cursor-pointer transition-opacity duration-300 ${!playing || showControls ? 'bg-black/40 opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handlePlayPause}
            >
                <button 
                    className={`w-20 h-20 bg-white/20 hover:bg-[#ff1414] backdrop-blur-md rounded-full flex justify-center items-center transition-all duration-300 ${!playing ? 'scale-100' : 'scale-75 opacity-0'}`}
                >
                    <BsPlayFill className="text-white text-5xl ml-2" />
                </button>
            </div>

            {/* Bottom Controls Bar */}
            <div 
                className={`absolute bottom-0 left-0 right-0 z-20 px-4 py-4 bg-gradient-to-t from-black/90 to-transparent transition-transform duration-300 ${showControls || !playing ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Timeline */}
                <div className="flex items-center gap-4 mb-2">
                    <input 
                        type="range" 
                        min={0} 
                        max={0.999999} 
                        step="any"
                        value={played}
                        onMouseDown={() => setPlaying(false)}
                        onChange={handleSeekChange}
                        onMouseUp={handleSeekMouseUp}
                        className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#ff1414]"
                        style={{
                            background: `linear-gradient(to right, #ff1414 ${played * 100}%, #4b5563 ${played * 100}%)`
                        }}
                    />
                </div>

                <div className="flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={handlePlayPause} className="hover:text-[#ff1414] transition-colors">
                            {playing ? <BsPauseFill className="text-2xl" /> : <BsPlayFill className="text-2xl" />}
                        </button>
                        
                        <div className="flex items-center gap-2 group/volume relative">
                            <button onClick={handleToggleMute} className="hover:text-[#ff1414] transition-colors">
                                {muted || volume === 0 ? <BsVolumeMuteFill className="text-2xl" /> : <BsVolumeUpFill className="text-2xl" />}
                            </button>
                            <input 
                                type="range" 
                                min={0} 
                                max={1} 
                                step="any"
                                value={muted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-300 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#ff1414] origin-left"
                                style={{
                                    background: `linear-gradient(to right, #ff1414 ${(muted ? 0 : volume) * 100}%, #4b5563 ${(muted ? 0 : volume) * 100}%)`
                                }}
                            />
                        </div>

                        <span className="text-sm font-medium ml-2 font-mono">
                            {formatTime(played * duration)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <button onClick={toggleFullscreen} className="hover:text-[#ff1414] transition-colors">
                            {isFullscreen ? <BsFullscreenExit className="text-xl" /> : <BsFullscreen className="text-xl" />}
                        </button>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #ff1414;
                    cursor: pointer;
                    transition: transform 0.1s;
                }
                input[type=range]:hover::-webkit-slider-thumb {
                    transform: scale(1.3);
                }
            `}</style>
        </div>
    );
}
