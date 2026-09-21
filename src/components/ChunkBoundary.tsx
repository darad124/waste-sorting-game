import React from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

/* ====================================================================== *
 *  A lazy screen that fails to arrive.
 *
 *  React.lazy throws whatever the dynamic import rejected with, during
 *  render. With no boundary above it that reaches the root and React
 *  unmounts the whole tree: the app goes to a blank page, with no way back
 *  and nothing on screen to explain it. Verified, not theorised — remove
 *  the Outlast chunk from a build and the tile takes you to an empty page.
 *
 *  It is not an exotic failure either. The chunk is requested by a filename
 *  containing its own content hash, so any deploy that lands while a tab is
 *  open leaves that tab asking for files the server has just replaced.
 *
 *  Reloading is the actual fix in that case — it fetches a fresh index.html
 *  naming the chunks that now exist — so that is the button.
 * ====================================================================== */

interface Props {
  children: React.ReactNode;
  /** What failed to load, in the player's words. */
  label: string;
  onBack?: () => void;
}

export class ChunkBoundary extends React.Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[ChunkBoundary] failed to load a screen", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 p-8 text-center bg-[#fde047]">
        <div className="w-12 h-12 rounded-2xl bg-white/75 border border-slate-950/10 flex items-center justify-center shadow-premium">
          <AlertTriangle size={22} className="text-rose-600" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-black text-slate-900 leading-tight">
            {this.props.label} would not load
          </h2>
          <p className="text-xs font-semibold text-slate-700 max-w-xs leading-snug">
            This usually means the app updated while you had it open. Reloading picks
            up the new version.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-black shadow-premium cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <RotateCcw size={14} /> Reload
          </button>
          {this.props.onBack && (
            <button
              type="button"
              onClick={this.props.onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/80 border border-slate-950/10 text-slate-800 text-xs font-black shadow-premium cursor-pointer hover:bg-white transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}
        </div>
      </div>
    );
  }
}
