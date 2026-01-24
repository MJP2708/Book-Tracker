// Tag parsing and utilities for @mentions and #hashtags

export interface ParsedContent {
  text: string;
  tags: Tag[];
}

export interface Tag {
  type: "mention" | "hashtag";
  value: string;
  start: number;
  end: number;
}

export function parseContent(text: string): ParsedContent {
  const tags: Tag[] = [];
  const regex = /(@[\w]+|#[\w]+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const value = match[0];
    const type = value[0] === "@" ? "mention" : "hashtag";

    tags.push({
      type,
      value,
      start: match.index,
      end: match.index + value.length,
    });
  }

  return {
    text,
    tags,
  };
}

export function renderContent(text: string) {
  const parts: (string | { type: string; value: string })[] = [];
  const regex = /(@[\w]+|#[\w]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const value = match[0];
    parts.push({
      type: value[0] === "@" ? "mention" : "hashtag",
      value,
    });

    lastIndex = match.index + value.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function extractMentions(text: string): string[] {
  const regex = /@([\w]+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
}

export function extractHashtags(text: string): string[] {
  const regex = /#([\w]+)/g;
  const hashtags: string[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }

  return hashtags;
}
