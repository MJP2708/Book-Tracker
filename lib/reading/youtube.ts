export type MusicSource = { kind: "video" | "playlist"; id: string };

export type MusicPreset = {
  key: string;
  label: string;
  source: MusicSource;
};

// Regular uploads rather than 24/7 live streams: a stream's ID stops working
// whenever the channel restarts it, which has already killed Lofi Girl's main one.
export const MUSIC_PRESETS: MusicPreset[] = [
  { key: "lofi", label: "Lofi", source: { kind: "video", id: "lTRiuFIWV54" } },
  { key: "jazz", label: "Jazz", source: { kind: "video", id: "neV3EPgvZ3g" } },
  { key: "cafe", label: "Café", source: { kind: "video", id: "MYPVQccHhAQ" } },
];

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]);

const VIDEO_ID = /^[\w-]{11}$/;
const PLAYLIST_ID = /^[\w-]{10,}$/;
const VIDEO_PATH_PREFIXES = new Set(["embed", "shorts", "live", "v"]);

function videoSource(id: string | null | undefined): MusicSource | null {
  return id && VIDEO_ID.test(id) ? { kind: "video", id } : null;
}

/**
 * Turns a pasted YouTube link into something the player can load, or null if
 * it isn't one. A watch link that also carries `list=` plays just that video,
 * because those lists are often auto-generated mixes that can't be embedded.
 */
export function parseYouTubeLink(input: string): MusicSource | null {
  const value = input.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const [first, second] = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be" || host === "www.youtu.be") {
    return videoSource(first);
  }

  if (!YOUTUBE_HOSTS.has(host)) return null;

  if (first === "watch") {
    return videoSource(url.searchParams.get("v"));
  }

  if (first === "playlist") {
    const list = url.searchParams.get("list");
    return list && PLAYLIST_ID.test(list) ? { kind: "playlist", id: list } : null;
  }

  return first && VIDEO_PATH_PREFIXES.has(first) ? videoSource(second) : null;
}
