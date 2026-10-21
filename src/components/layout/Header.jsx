import React from 'react';
import { Rocket, Github, BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="h-12 border-b border-slate-800 bg-slate-950/95 px-4 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Rocket className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wider uppercase font-mono flex items-center gap-2">
            Rocket Simulator 3D
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-normal">
              v1.0 AIAA
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
        <span className="hidden sm:inline">Khí quyển: US Standard 1976</span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="hidden sm:inline">Giải thuật: RK4 (2D)</span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors"
        >
          <Github className="w-4 h-4" />
          <span>Open Source</span>
        </a>
      </div>
    </header>
  );
}
