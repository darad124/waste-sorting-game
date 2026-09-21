import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, ExternalLink, Link2, Share2, X } from "lucide-react";
import {
  getShareDetails,
  getShareText,
  getShareUrl,
  getSocialShareUrl,
  type ShareTarget,
} from "../utils/share";

interface ShareButtonProps {
  target: ShareTarget;
  label?: string;
  compact?: boolean;
  className?: string;
  /** Replaces the mode's stock share line. For sharing a specific thing the
   *  player has just seen rather than the mode in general. */
  text?: string;
}

const SOCIAL_LABELS = {
  x: "X",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  telegram: "Telegram",
} as const;

export const ShareButton: FC<ShareButtonProps> = ({
  target,
  label = "Share result",
  compact = false,
  className = "",
  text,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ left: 16, top: 16 });
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const details = getShareDetails(target);
  const canUseNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !menuContentRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [isOpen]);

  const handleNativeShare = async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title: details.title,
        text: text ?? getShareText(target),
        url: getShareUrl(target),
      });
      setIsOpen(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setIsOpen(true);
    }
  };

  const handleCopy = async () => {
    const shareUrl = getShareUrl(target);

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("textarea");
      input.value = shareUrl;
      input.setAttribute("readonly", "true");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const openSocialShare = (platform: keyof typeof SOCIAL_LABELS) => {
    window.open(
      getSocialShareUrl(platform, target, text),
      "_blank",
      "noopener,noreferrer,width=720,height=640",
    );
    setIsOpen(false);
  };

  const toggleMenu = () => {
    if (!isOpen) {
      const trigger = menuRef.current?.getBoundingClientRect();
      const menuWidth = Math.min(320, window.innerWidth - 32);
      const menuHeight = 270;
      const gap = 12;
      const horizontalPadding = 16;
      const left = Math.min(
        Math.max(horizontalPadding, (trigger?.right ?? horizontalPadding) - menuWidth),
        window.innerWidth - menuWidth - horizontalPadding,
      );
      const roomBelow = window.innerHeight - (trigger?.bottom ?? horizontalPadding);
      const roomAbove = trigger?.top ?? horizontalPadding;
      const opensBelow = roomBelow >= menuHeight + gap || roomBelow >= roomAbove;
      const unclampedTop = opensBelow
        ? (trigger?.bottom ?? horizontalPadding) + gap
        : (trigger?.top ?? menuHeight + gap) - menuHeight - gap;
      const top = Math.min(
        Math.max(horizontalPadding, unclampedTop),
        window.innerHeight - menuHeight - horizontalPadding,
      );

      setMenuPosition({ left, top });
    }

    setIsOpen((open) => !open);
  };

  return (
    <div className={className} style={isOpen ? { zIndex: 60 } : undefined}>
      <div
        className={compact ? "relative inline-flex" : "relative w-full"}
        ref={menuRef}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={compact ? label : undefined}
          className={compact
            ? "p-2 rounded-xl bg-white/70 text-slate-700 hover:bg-white hover:text-slate-950 border border-slate-950/10 shadow-premium cursor-pointer transition-all"
            : "w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"}
        >
          <Share2 size={16} />
          {!compact && <span>{label}</span>}
        </button>

        {isOpen && typeof document !== "undefined" && createPortal(
          <div
            ref={menuContentRef}
            role="menu"
            style={{ left: menuPosition.left, top: menuPosition.top, zIndex: 70 }}
            className="fixed z-[70] w-[min(320px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-3 text-white shadow-2xl animate-pop-in"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-xs font-black uppercase tracking-wider text-white">Share EcoSort</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close share menu"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {canUseNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-slate-950 transition-colors hover:bg-emerald-400"
              >
                <Share2 size={14} />
                Share from this device
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SOCIAL_LABELS) as Array<keyof typeof SOCIAL_LABELS>).map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => openSocialShare(platform)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-[11px] font-extrabold text-slate-100 transition-colors hover:bg-white/15"
                >
                  <ExternalLink size={11} />
                  {SOCIAL_LABELS[platform]}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-[11px] font-extrabold text-slate-100 transition-colors hover:bg-white/15"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>

            <div className="mt-2 flex items-center gap-1.5 border-t border-white/10 px-1 pt-2 text-[10px] font-semibold text-slate-400">
              <Link2 size={11} />
              <span className="truncate">{getShareUrl(target)}</span>
            </div>
          </div>,
          document.body,
        )}
      </div>
    </div>
  );
};
