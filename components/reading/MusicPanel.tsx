"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { useYouTubePlayer } from "@/lib/reading/use-youtube-player";
import { MUSIC_PRESETS, parseYouTubeLink, type MusicSource } from "@/lib/reading/youtube";

const STORAGE_KEY = "reading-mode-music";

type MusicPrefs = {
  /** A preset key, or "custom" / "off". */
  selection: string;
  customLink: string;
  volume: number;
};

const DEFAULT_PREFS: MusicPrefs = {
  selection: MUSIC_PRESETS[0].key,
  customLink: "",
  volume: 40,
};

const CHOICES = [
  ...MUSIC_PRESETS.map(({ key, label }) => ({ key, label })),
  { key: "custom", label: "My link" },
  { key: "off", label: "Off" },
];

function loadPrefs(): MusicPrefs {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return {
      selection: CHOICES.some(({ key }) => key === saved.selection)
        ? saved.selection
        : DEFAULT_PREFS.selection,
      customLink: typeof saved.customLink === "string" ? saved.customLink : "",
      volume:
        typeof saved.volume === "number" && saved.volume >= 0 && saved.volume <= 100
          ? saved.volume
          : DEFAULT_PREFS.volume,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: MusicPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Without storage the music still plays; the choice just isn't remembered.
  }
}

function selectedSource({ selection, customLink }: MusicPrefs): MusicSource | null {
  if (selection === "custom") return parseYouTubeLink(customLink);
  return MUSIC_PRESETS.find(({ key }) => key === selection)?.source ?? null;
}

function AmbientPlayer({
  source,
  volume,
  onVolumeChange,
}: {
  source: MusicSource;
  volume: number;
  onVolumeChange: (volume: number) => void;
}) {
  const { containerRef, status, errorMessage, togglePlayback } = useYouTubePlayer(source, volume);
  const isPlaying = status === "playing";

  return (
    <div className="space-y-3">
      {/* YouTube's terms require a visible player of at least 200×200px, so it can't be hidden. */}
      <div ref={containerRef} className="h-50 w-full overflow-hidden rounded-xl bg-black" />

      {status === "blocked" && (
        <p role="status" className="text-sm text-amber-300">
          Your browser held the music back. Press play to start it.
        </p>
      )}
      {errorMessage && (
        <p role="alert" className="text-sm text-rose-300">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          disabled={status === "error"}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <Volume2 className="h-4 w-4 shrink-0 text-stone-400" aria-hidden />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          aria-label="Music volume"
          className="w-full accent-amber-500"
        />
      </div>
    </div>
  );
}

export function MusicPanel() {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [draftLink, setDraftLink] = useState(prefs.customLink);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => savePrefs(prefs), [prefs]);

  const source = selectedSource(prefs);

  const handleLinkSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!parseYouTubeLink(draftLink)) {
      setLinkError("That doesn't look like a YouTube video or playlist link.");
      return;
    }
    setLinkError(null);
    setPrefs((current) => ({ ...current, customLink: draftLink.trim() }));
  };

  return (
    <section aria-label="Background music" className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CHOICES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={prefs.selection === key}
            onClick={() => setPrefs((current) => ({ ...current, selection: key }))}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              prefs.selection === key
                ? "bg-amber-500 text-stone-950"
                : "bg-white/10 text-stone-200 hover:bg-white/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {prefs.selection === "custom" && (
        <form onSubmit={handleLinkSubmit} className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="url"
              value={draftLink}
              onChange={(event) => setDraftLink(event.target.value)}
              placeholder="Paste a YouTube link"
              aria-label="YouTube link"
              aria-invalid={linkError !== null}
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
            >
              Play
            </button>
          </div>
          {linkError && (
            <p role="alert" className="text-sm text-rose-300">
              {linkError}
            </p>
          )}
        </form>
      )}

      {source && (
        <AmbientPlayer
          key={`${source.kind}:${source.id}`}
          source={source}
          volume={prefs.volume}
          onVolumeChange={(volume) => setPrefs((current) => ({ ...current, volume }))}
        />
      )}
    </section>
  );
}
