import React from 'react';
import { AppImageLinks } from '../types';

interface HeaderProps {
  currentTab: string;
  imageLinks: AppImageLinks;
  onOpenNotifications: () => void;
  onOpenImageManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  imageLinks,
  onOpenNotifications,
  onOpenImageManager,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'inicio':
        return 'Início';
      case 'treinos':
        return 'Treinos';
      case 'executar':
        return 'Executar';
      case 'evolucao':
        return 'Evolução';
      default:
        return 'Início';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#e5eeff]/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto h-16 px-5 flex items-center justify-between">
        {/* Brand & Section Indicator */}
        <div className="flex items-center gap-2">
          {/* Logo with safe fallback */}
          <div 
            onClick={onOpenImageManager}
            className="cursor-pointer group flex items-center gap-2"
            title="Clique para gerenciar links de imagens"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-[#131b2e] shadow-sm ring-1 ring-[#006398]/30 group-hover:scale-105 transition-transform">
              <img
                src={imageLinks.logoUrl}
                alt="Pulse Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback vector icon matching user Image 2
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="material-symbols-outlined text-[#6ffbbe] text-[20px] absolute pointer-events-none">
                check_circle
              </span>
            </div>
            <span className="font-headline-sm text-[20px] font-bold text-[#0b1c30] tracking-tight">
              Pulse
            </span>
          </div>

          <span 
            className="material-symbols-outlined text-[#006398] text-[20px] select-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>

          <span className="text-[#45464d] text-[13px] font-normal opacity-40 ml-1">
            |
          </span>

          <span className="font-label-md text-[13px] text-[#45464d] font-semibold ml-1 truncate max-w-[120px]">
            {getTabTitle(currentTab)}
          </span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Direct Image Links Shortcut Button */}
          <button
            onClick={onOpenImageManager}
            aria-label="Gerenciar links das imagens"
            title="Alterar links das imagens do HTML"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#006398] hover:bg-[#e5eeff] active:scale-95 transition-all relative"
          >
            <span className="material-symbols-outlined text-[20px]">
              image
            </span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notificações"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#45464d] hover:text-[#0b1c30] hover:bg-[#e5eeff] active:scale-95 transition-all relative"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#006398] ring-2 ring-[#f8f9ff]"></span>
          </button>

          {/* User Profile Avatar with Image Link shortcut */}
          <button
            onClick={onOpenImageManager}
            aria-label="Perfil do usuário"
            title="Mariana - Gerenciar fotos"
            className="w-9 h-9 rounded-full ring-2 ring-[#006398]/30 overflow-hidden active:scale-95 transition-transform shadow-sm relative group bg-[#eff4ff]"
          >
            <img
              src={imageLinks.profileUrl}
              alt="Mariana"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
