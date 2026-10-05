import React, { useState } from 'react';
import { AppImageLinks } from '../types';
import { INITIAL_IMAGES } from '../data/mockData';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageLinks: AppImageLinks;
  onUpdateImageLinks: (newLinks: AppImageLinks) => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  isOpen,
  onClose,
  imageLinks,
  onUpdateImageLinks,
}) => {
  const [draftLinks, setDraftLinks] = useState<AppImageLinks>(imageLinks);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState(false);

  if (!isOpen) return null;

  const imageItems = [
    {
      key: 'logoUrl' as keyof AppImageLinks,
      title: 'Logo Pulse (Ícone do App)',
      description: 'Ícone exibido no topo e na identidade do aplicativo.',
      preset: INITIAL_IMAGES.logoUrl,
    },
    {
      key: 'profileUrl' as keyof AppImageLinks,
      title: 'Foto de Perfil (Mariana)',
      description: 'Foto do usuário exibida no cabeçalho e perfil.',
      preset: INITIAL_IMAGES.profileUrl,
    },
    {
      key: 'exerciseBenchPressUrl' as keyof AppImageLinks,
      title: 'Foto do Exercício (Supino Reto)',
      description: 'Miniatura da execução na tela de treino ativo.',
      preset: INITIAL_IMAGES.exerciseBenchPressUrl,
    },
    {
      key: 'baselinePhotoUrl' as keyof AppImageLinks,
      title: 'Foto de Base (Setembro 2024 - 66.0 kg)',
      description: 'Primeira imagem do comparativo visual na tela Evolução.',
      preset: INITIAL_IMAGES.baselinePhotoUrl,
    },
    {
      key: 'currentPhotoUrl' as keyof AppImageLinks,
      title: 'Foto de Evolução (Outubro 2024 - 64.2 kg)',
      description: 'Segunda imagem do comparativo visual na tela Evolução.',
      preset: INITIAL_IMAGES.currentPhotoUrl,
    },
  ];

  const handleLinkChange = (key: keyof AppImageLinks, value: string) => {
    setDraftLinks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSave = () => {
    onUpdateImageLinks(draftLinks);
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    setDraftLinks(INITIAL_IMAGES);
    onUpdateImageLinks(INITIAL_IMAGES);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#eff4ff]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#eff4ff] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#cce5ff] text-[#006398] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">link</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[18px] text-[#0b1c30] font-bold">
                Links Diretos das Imagens
              </h3>
              <p className="font-body-sm text-[12px] text-[#45464d]">
                Substitua ou adicione URLs diretas de imagens do HTML
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777d] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="p-3.5 bg-[#eff4ff] rounded-2xl flex items-start gap-3 border border-[#dce9ff]">
            <span className="material-symbols-outlined text-[#006398] text-[20px] mt-0.5">
              info
            </span>
            <div className="text-[13px] text-[#0b1c30] leading-snug">
              <strong>Dica:</strong> Você pode colar qualquer link direto de imagem (<code className="bg-white px-1.5 py-0.5 rounded text-[#006398]">.jpg</code>, <code className="bg-white px-1.5 py-0.5 rounded text-[#006398]">.png</code>, <code className="bg-white px-1.5 py-0.5 rounded text-[#006398]">.svg</code> ou links do Google/Unsplash). O app atualizará instantaneamente todas as telas.
            </div>
          </div>

          {imageItems.map((item) => {
            const currentUrl = draftLinks[item.key];
            return (
              <div
                key={item.key}
                className="bg-[#f8f9ff] rounded-2xl p-4 border border-[#e5eeff] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-[14px] text-[#0b1c30] font-bold">
                    {item.title}
                  </span>
                  <button
                    onClick={() => handleCopy(item.key, currentUrl)}
                    className="font-label-caps text-[11px] text-[#006398] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedKey === item.key ? 'check' : 'content_copy'}
                    </span>
                    {copiedKey === item.key ? 'Copiado!' : 'Copiar URL'}
                  </button>
                </div>
                <p className="font-body-sm text-[12px] text-[#45464d]">
                  {item.description}
                </p>

                {/* Preview and Input Row */}
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#c6c6cd] overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                    <img
                      src={currentUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      value={currentUrl}
                      onChange={(e) => handleLinkChange(item.key, e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full text-[12px] font-mono px-3 py-2 bg-white rounded-xl border border-[#c6c6cd] focus:outline-none focus:border-[#006398] text-[#0b1c30]"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#76777d]">
                      <span>Link direto</span>
                      <button
                        onClick={() => handleLinkChange(item.key, item.preset)}
                        className="text-[#006398] hover:underline"
                      >
                        Restaurar original
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#eff4ff] bg-[#f8f9ff] flex items-center justify-between gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-full border border-[#c6c6cd] text-[#45464d] font-label-md text-[13px] hover:bg-white active:scale-95 transition-all"
          >
            Redefinir Todas
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-[#45464d] font-label-md text-[13px] hover:bg-[#e5eeff] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-[#006398] hover:bg-[#004b73] text-white font-label-md text-[13px] font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">
                {saveFeedback ? 'check' : 'save'}
              </span>
              <span>{saveFeedback ? 'Salvo!' : 'Aplicar Imagens'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
