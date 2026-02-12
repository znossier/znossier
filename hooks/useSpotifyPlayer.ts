'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SpotifyTrack, getPlaylistTracks, formatDuration } from '@/lib/spotify';

interface UseSpotifyPlayerOptions {
  playlistId: string;
  autoplay?: boolean;
}

export function useSpotifyPlayer({ playlistId, autoplay = false }: UseSpotifyPlayerOptions) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const embedRef = useRef<HTMLIFrameElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAttemptedAutoplay = useRef(false);

  // Load playlist tracks
  useEffect(() => {
    if (!playlistId) return;

    setIsLoading(true);
    setError(null);
    
    getPlaylistTracks(playlistId)
      .then((loadedTracks) => {
        setTracks(loadedTracks);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load playlist');
        setIsLoading(false);
      });
  }, [playlistId]);

  const currentTrack = tracks[currentTrackIndex] || null;

  // Initialize Spotify embed
  useEffect(() => {
    if (!currentTrack || !embedRef.current) return;

    const iframe = embedRef.current;
    const trackId = currentTrack.id;
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&t=0`;
    
    iframe.src = embedUrl;
    setDuration(currentTrack.duration_ms);
    setProgress(0);

    // Attempt autoplay after a short delay
    if (autoplay && !hasAttemptedAutoplay.current) {
      hasAttemptedAutoplay.current = true;
      // Autoplay will be handled by user interaction due to browser policies
    }
  }, [currentTrack, autoplay]);

  // Update progress (simulated, as we can't get real-time progress from embed)
  useEffect(() => {
    if (!isPlaying || !duration) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1000;
        if (newProgress >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return newProgress;
      });
    }, 1000);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const play = useCallback(() => {
    setIsPlaying(true);
    // Note: Actual playback control requires user interaction due to browser policies
    // The embed iframe will handle playback
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setProgress(0);
      setIsPlaying(false);
    }
  }, [currentTrackIndex, tracks.length]);

  const previousTrack = useCallback(() => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  }, [currentTrackIndex]);

  const seekTo = useCallback((ms: number) => {
    setProgress(Math.max(0, Math.min(ms, duration)));
  }, [duration]);

  return {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isLoading,
    error,
    progress,
    duration,
    embedRef,
    play,
    pause,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    hasNext: currentTrackIndex < tracks.length - 1,
    hasPrevious: currentTrackIndex > 0,
    formattedProgress: formatDuration(progress),
    formattedDuration: formatDuration(duration),
  };
}
