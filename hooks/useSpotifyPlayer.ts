'use client';

import { useReducer, useEffect, useRef, useCallback } from 'react';
import { SpotifyTrack, getPlaylistTracks, formatDuration } from '@/lib/spotify';

interface UseSpotifyPlayerOptions {
  playlistId: string;
  autoplay?: boolean;
}

interface SpotifyPlayerState {
  tracks: SpotifyTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  progress: number;
  duration: number;
}

type SpotifyPlayerAction =
  | { type: 'load-start' }
  | { type: 'load-success'; tracks: SpotifyTrack[] }
  | { type: 'load-error'; error: string }
  | { type: 'set-playing'; isPlaying: boolean }
  | { type: 'set-progress'; progress: number }
  | { type: 'set-duration'; duration: number }
  | { type: 'next-track' }
  | { type: 'previous-track' };

const initialState: SpotifyPlayerState = {
  tracks: [],
  currentTrackIndex: 0,
  isPlaying: false,
  isLoading: true,
  error: null,
  progress: 0,
  duration: 0,
};

function spotifyPlayerReducer(
  state: SpotifyPlayerState,
  action: SpotifyPlayerAction
): SpotifyPlayerState {
  switch (action.type) {
    case 'load-start':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'load-success':
      return {
        ...state,
        tracks: action.tracks,
        currentTrackIndex: 0,
        isLoading: false,
      };
    case 'load-error':
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    case 'set-playing':
      return {
        ...state,
        isPlaying: action.isPlaying,
      };
    case 'set-progress':
      return {
        ...state,
        progress: action.progress,
      };
    case 'set-duration':
      return {
        ...state,
        duration: action.duration,
        progress: 0,
      };
    case 'next-track':
      return {
        ...state,
        currentTrackIndex: Math.min(state.currentTrackIndex + 1, state.tracks.length - 1),
        isPlaying: false,
        progress: 0,
      };
    case 'previous-track':
      return {
        ...state,
        currentTrackIndex: Math.max(state.currentTrackIndex - 1, 0),
        isPlaying: false,
        progress: 0,
      };
    default:
      return state;
  }
}

export function useSpotifyPlayer({ playlistId, autoplay = false }: UseSpotifyPlayerOptions) {
  const [state, dispatch] = useReducer(spotifyPlayerReducer, initialState);
  const embedRef = useRef<HTMLIFrameElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAttemptedAutoplay = useRef(false);

  const currentTrack = state.tracks[state.currentTrackIndex] || null;

  useEffect(() => {
    if (!playlistId) return;

    let isCancelled = false;
    dispatch({ type: 'load-start' });

    getPlaylistTracks(playlistId)
      .then((loadedTracks) => {
        if (isCancelled) return;
        dispatch({ type: 'load-success', tracks: loadedTracks });
      })
      .catch((error: Error) => {
        if (isCancelled) return;
        dispatch({
          type: 'load-error',
          error: error.message || 'Failed to load playlist',
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [playlistId]);

  useEffect(() => {
    if (!currentTrack || !embedRef.current) return;

    const iframe = embedRef.current;
    const trackId = currentTrack.id;
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&t=0`;

    iframe.src = embedUrl;
    dispatch({ type: 'set-duration', duration: currentTrack.duration_ms });

    if (autoplay && !hasAttemptedAutoplay.current) {
      hasAttemptedAutoplay.current = true;
    }
  }, [currentTrack, autoplay]);

  useEffect(() => {
    if (!state.isPlaying || !state.duration) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      const nextProgress = state.progress + 1000;
      if (nextProgress >= state.duration) {
        dispatch({ type: 'set-playing', isPlaying: false });
        dispatch({ type: 'set-progress', progress: state.duration });
        return;
      }

      dispatch({ type: 'set-progress', progress: nextProgress });
    }, 1000);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [state.duration, state.isPlaying, state.progress]);

  const play = useCallback(() => {
    dispatch({ type: 'set-playing', isPlaying: true });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'set-playing', isPlaying: false });
  }, []);

  const togglePlayPause = useCallback(() => {
    dispatch({ type: 'set-playing', isPlaying: !state.isPlaying });
  }, [state.isPlaying]);

  const nextTrack = useCallback(() => {
    if (state.currentTrackIndex < state.tracks.length - 1) {
      dispatch({ type: 'next-track' });
    }
  }, [state.currentTrackIndex, state.tracks.length]);

  const previousTrack = useCallback(() => {
    if (state.currentTrackIndex > 0) {
      dispatch({ type: 'previous-track' });
    }
  }, [state.currentTrackIndex]);

  const seekTo = useCallback(
    (ms: number) => {
      dispatch({
        type: 'set-progress',
        progress: Math.max(0, Math.min(ms, state.duration)),
      });
    },
    [state.duration]
  );

  return {
    tracks: state.tracks,
    currentTrack,
    currentTrackIndex: state.currentTrackIndex,
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    error: state.error,
    progress: state.progress,
    duration: state.duration,
    embedRef,
    play,
    pause,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    hasNext: state.currentTrackIndex < state.tracks.length - 1,
    hasPrevious: state.currentTrackIndex > 0,
    formattedProgress: formatDuration(state.progress),
    formattedDuration: formatDuration(state.duration),
  };
}
