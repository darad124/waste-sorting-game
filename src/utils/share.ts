import { LEVELS } from "../data/levels";

export type ShareMode = "detective" | "trivia" | "contamination";

export type ShareTarget =
  | { kind: "level"; id: number }
  | { kind: "mode"; id: ShareMode };

export interface ShareDetails {
  title: string;
  description: string;
  shareText: string;
  imagePath: string;
  imageAlt: string;
  pathname: string;
  queryValue: string;
}

const MODE_DETAILS: Record<ShareMode, Omit<ShareDetails, "pathname" | "queryValue">> = {
  detective: {
    title: "Trash Detective | EcoSort",
    description: "Scan messy scenes, find hidden waste, and learn where every item belongs.",
    shareText: "I just played Trash Detective on EcoSort 🔎♻️ Can you find every hidden waste item?",
    imagePath: "/share-cards/mode-detective.png",
    imageAlt: "EcoSort Trash Detective share card",
  },
  trivia: {
    title: "Yes/No Trivia | EcoSort",
    description: "Test your recycling knowledge with quick yes-or-no waste trivia.",
    shareText: "I just played EcoSort recycling trivia 🧠♻️ How well do you know your waste rules?",
    imagePath: "/share-cards/mode-trivia.png",
    imageAlt: "EcoSort Yes/No Trivia share card",
  },
  contamination: {
    title: "Imposter Hunt | EcoSort",
    description: "Spot the contaminant hiding in each waste stream before it ruins the batch.",
    shareText: "I just played EcoSort Imposter Hunt 🕵️♻️ Can you spot the contaminant?",
    imagePath: "/share-cards/mode-contamination.png",
    imageAlt: "EcoSort Imposter Hunt share card",
  },
};

export const getShareDetails = (target: ShareTarget): ShareDetails => {
  if (target.kind === "level") {
    const level = LEVELS.find((candidate) => candidate.id === target.id) ?? LEVELS[0];

    return {
      title: `${level.name} | EcoSort`,
      description: level.description,
      shareText: `I just played ${level.name} on EcoSort ♻️ Can you beat my sorting run?`,
      imagePath: `/share-cards/level-${level.id}.png`,
      imageAlt: `EcoSort ${level.name} share card`,
      pathname: `/share/level/${level.id}`,
      queryValue: `level-${level.id}`,
    };
  }

  const mode = MODE_DETAILS[target.id];
  return {
    ...mode,
    pathname: `/share/mode/${target.id}`,
    queryValue: `mode-${target.id}`,
  };
};

export const getShareUrl = (target: ShareTarget): string => {
  const details = getShareDetails(target);
  return new URL(details.pathname, window.location.origin).toString();
};

export const getShareText = (target: ShareTarget): string => getShareDetails(target).shareText;

export const parseShareQuery = (value: string | null): ShareTarget | null => {
  if (!value) return null;

  if (value.startsWith("level-")) {
    const levelId = Number(value.slice("level-".length));
    if (LEVELS.some((level) => level.id === levelId)) {
      return { kind: "level", id: levelId };
    }
  }

  if (value.startsWith("mode-")) {
    const mode = value.slice("mode-".length) as ShareMode;
    if (mode in MODE_DETAILS) {
      return { kind: "mode", id: mode };
    }
  }

  return null;
};

export const getSocialShareUrl = (
  platform: "x" | "facebook" | "whatsapp" | "linkedin" | "telegram",
  target: ShareTarget,
): string => {
  const shareUrl = getShareUrl(target);
  const text = getShareText(target);

  switch (platform) {
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
  }
};
