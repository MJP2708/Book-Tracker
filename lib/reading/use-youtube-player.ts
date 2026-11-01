"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MusicSource } from "@/lib/reading/youtube";

type PlayerEvent = { data: number; target: YouTubePlayer };

type YouTubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideoAt(index: number): void;
  setVolume(volume: number): void;
  getPlayerState(): number;
  destroy(): void;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      width: string;
      height: string;
      videoId?: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady(event: { target: YouTubePlayer }): void;
        onStateChange(event: PlayerEvent): void;
        onError(event: PlayerEvent): void;
      };
    }
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type PlayerStatus = "loading" | "playing" | "paused" | "blocked" | "error";

const STATE_UNSTARTED = -1;
const STATE_ENDED = 0;
const STATE_PLAYING = 1;
const STATE_PAUSED = 2;
const STATE_BUFFERING = 3;
const STATE_CUED = 5;

// Browsers can refuse to start audio without a direct press on the player.
const AUTOPLAY_CHECK_MS = 4000;

const LOAD_FAILED = "Couldn't reach YouTube. Check your connection or ad blocker.";

// Not split by error code: YouTube reports 150 ("embedding disabled") for ended
// live streams and unprocessed videos too, so the code can't name the real cause.
const PLAYBACK_FAILED =
  "YouTube won't play this one here. It may be private, ended, or blocked from embedding. Try another.";

let apiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);

  apiPromise ??= new Promise<YouTubeApi>((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT as YouTubeApi);
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => {
      script.remove();
      apiPromise = null;
      reject(new Error(LOAD_FAILED));
    };
    document.head.appendChild(script);
  });

  return apiPromise;
}

/**
 * Plays `source` in a YouTube player inside the returned container. The source
 * is fixed for the hook's lifetime, so give the calling component a `key` to
 * switch tracks.
 */
export function useYouTubePlayer(source: MusicSource, volume: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const volumeRef = useRef(volume);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    volumeRef.current = volume;
    playerRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let player: YouTubePlayer | null = null;
    let autoplayCheck: ReturnType<typeof setTimeout> | undefined;

    const fail = (message: string) => {
      clearTimeout(autoplayCheck);
      setStatus("error");
      setErrorMessage(message);
    };

    loadYouTubeApi()
      .then((api) => {
        if (cancelled) return;

        // YouTube swaps this element for its iframe, so keep it out of React's tree.
        const target = document.createElement("div");
        container.appendChild(target);

        player = new api.Player(target, {
          width: "100%",
          height: "100%",
          videoId: source.kind === "video" ? source.id : undefined,
          playerVars: {
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
            ...(source.kind === "playlist" ? { listType: "playlist", list: source.id } : {}),
          },
          events: {
            onReady: ({ target: ready }) => {
              if (cancelled) return;
              playerRef.current = ready;
              // Set the volume before starting, or the first moment plays at full volume.
              ready.setVolume(volumeRef.current);
              ready.playVideo();
              autoplayCheck = setTimeout(() => {
                const state = ready.getPlayerState();
                if (state === STATE_UNSTARTED || state === STATE_CUED) setStatus("blocked");
              }, AUTOPLAY_CHECK_MS);
            },
            onStateChange: ({ data, target: active }) => {
              if (data === STATE_PLAYING) setStatus("playing");
              else if (data === STATE_PAUSED) setStatus("paused");
              else if (data === STATE_BUFFERING) setStatus("loading");
              else if (data === STATE_ENDED) {
                if (source.kind === "playlist") {
                  active.playVideoAt(0);
                } else {
                  active.seekTo(0, true);
                  active.playVideo();
                }
              }
            },
            onError: () => fail(PLAYBACK_FAILED),
          },
        });
      })
      .catch((error: Error) => {
        if (!cancelled) fail(error.message);
      });

    return () => {
      cancelled = true;
      clearTimeout(autoplayCheck);
      playerRef.current = null;
      player?.destroy?.();
      container.replaceChildren();
    };
  }, [source.id, source.kind]);

  const togglePlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.getPlayerState() === STATE_PLAYING) player.pauseVideo();
    else player.playVideo();
  }, []);

  return { containerRef, status, errorMessage, togglePlayback };
}
