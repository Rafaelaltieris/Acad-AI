import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isWorkoutActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  isWorkoutActive = false,
}) => {
  const tabs = [
    { id: 'inicio', label: 'Início', icon: 'home' },
    { id: 'treinos', label: 'Treinos', icon: 'fitness_center' },
    { id: 'executar', label: 'Executar', icon: 'play_arrow', isSpecial: true },
    { id: 'evolucao', label: 'Evolução', icon: 'trending_up' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[#ffffff]/90 backdrop-blur-xl border-t border-[#eff4ff] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center w-16 h-12 transition-all active:scale-95 group relative ${
                  isActive ? 'text-[#006398]' : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                {/* Elevated circular action button */}
                <div
                  className={`w-11 h-11 -mt-4 rounded-full flex items-center justify-center text-white transition-all shadow-[0_4px_14px_rgba(0,99,152,0.35)] group-hover:scale-105 active:scale-95 ${
                    isWorkoutActive
                      ? 'bg-[#006398] ring-4 ring-[#cce5ff]'
                      : 'bg-[#006398]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isWorkoutActive ? 'timer' : 'play_arrow'}
                  </span>
                  {isWorkoutActive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#6ffbbe] rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </div>
                <span
                  className={`font-label-caps text-[11px] mt-0.5 tracking-wide ${
                    isActive ? 'text-[#006398] font-bold' : 'text-[#45464d]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-colors active:scale-95 ${
                isActive ? 'text-[#006398]' : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
              <span
                className={`font-label-caps text-[11px] mt-0.5 tracking-wide ${
                  isActive ? 'text-[#006398] font-bold' : 'text-[#45464d]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
