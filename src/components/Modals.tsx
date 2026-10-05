import React, { useState } from 'react';
import { WorkoutRoutine } from '../types';

interface ExerciseDetailModalProps {
  routine: WorkoutRoutine | null;
  onClose: () => void;
  onStartWorkout: (routineId: string) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  routine,
  onClose,
  onStartWorkout,
}) => {
  if (!routine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#eff4ff]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eff4ff] bg-[#f8f9ff] flex items-center justify-between">
          <div>
            <span className="font-label-caps text-[11px] text-[#006398] font-bold uppercase tracking-wider">
              {routine.splitTag}
            </span>
            <h3 className="font-headline-sm text-[18px] text-[#0b1c30] font-bold">
              {routine.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777d] hover:bg-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Exercises List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center gap-3 text-[12px] text-[#45464d] bg-[#eff4ff] p-3 rounded-2xl border border-[#dce9ff]/60">
            <span className="material-symbols-outlined text-[#006398] text-[20px]">
              assignment
            </span>
            <span>
              Ficha com <strong>{routine.exercises.length} exercícios</strong> montada pelo{' '}
              <strong>Prof. Lucas</strong> para hipertrofia &amp; força.
            </span>
          </div>

          {routine.exercises.map((ex, idx) => (
            <div
              key={ex.id}
              className="p-3.5 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] flex gap-3 items-start"
            >
              <div className="w-8 h-8 rounded-full bg-[#006398] text-white flex items-center justify-center font-bold text-[13px] shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-label-lg text-[14px] text-[#0b1c30] font-bold truncate">
                    {ex.name}
                  </h4>
                  <span className="font-label-caps text-[11px] text-[#006398] font-bold">
                    {ex.defaultSetsCount} séries
                  </span>
                </div>
                <div className="text-[12px] text-[#45464d] mt-0.5">
                  {ex.targetMuscle} • {ex.defaultReps}
                </div>
                {ex.tip && (
                  <p className="text-[11px] text-[#76777d] mt-1 italic">
                    💡 {ex.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-[#eff4ff] bg-[#f8f9ff] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-[#45464d] font-label-md text-[13px] hover:bg-[#e5eeff]"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onClose();
              onStartWorkout(routine.id);
            }}
            className="px-6 py-2.5 bg-[#006398] hover:bg-[#004b73] text-white font-label-md text-[13px] font-bold rounded-full shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Iniciar Este Treino</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface RequestRoutineChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestRoutineChangeModal: React.FC<RequestRoutineChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reason, setReason] = useState('Aumentar Intensidade');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#eff4ff] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#cce5ff] text-[#006398] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                support_agent
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[17px] text-[#0b1c30] font-bold">
                Solicitar Ajuste de Ficha
              </h3>
              <p className="font-body-sm text-[12px] text-[#45464d]">
                Enviado diretamente ao Prof. Lucas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777d] hover:bg-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <span className="material-symbols-outlined text-[48px] text-[#009668]">
              check_circle
            </span>
            <h4 className="font-headline-sm text-[18px] text-[#0b1c30] font-bold">
              Solicitação Enviada!
            </h4>
            <p className="font-body-sm text-[13px] text-[#45464d]">
              O Prof. Lucas revisará sua ficha em até 24 horas úteis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="font-label-caps text-[11px] text-[#45464d] font-bold uppercase block mb-1">
                Motivo Principal
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-11 bg-[#eff4ff] px-3 rounded-xl text-[#0b1c30] font-medium text-[13px] focus:outline-none focus:ring-2 focus:ring-[#006398]"
              >
                <option>Aumentar Intensidade e Cargas</option>
                <option>Trocar exercício por desconforto/lesão</option>
                <option>Alterar número de dias na semana</option>
                <option>Novo foco muscular (braços/glúteos/costas)</option>
              </select>
            </div>

            <div>
              <label className="font-label-caps text-[11px] text-[#45464d] font-bold uppercase block mb-1">
                Mensagem para o Professor
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Gostaria de variar os exercícios de peito e aumentar o volume de tríceps..."
                className="w-full bg-[#eff4ff] p-3 rounded-xl text-[#0b1c30] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#006398]"
              />
            </div>

            <div className="text-[11px] text-[#76777d]">
              * Você possui 3 solicitações disponíveis este mês.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#45464d] hover:bg-[#e5eeff] rounded-full text-[13px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006398] hover:bg-[#004b73] text-white font-label-md text-[13px] font-bold rounded-full shadow-md active:scale-95 transition-all"
              >
                Enviar Solicitação
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface WorkoutCompletedModalProps {
  summary: {
    routineTitle: string;
    durationMinutes: number;
    calories: number;
    volumeKg: number;
  } | null;
  onClose: () => void;
}

export const WorkoutCompletedModal: React.FC<WorkoutCompletedModalProps> = ({
  summary,
  onClose,
}) => {
  if (!summary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center border border-[#eff4ff] space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#6ffbbe] text-[#002113] mx-auto flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-[36px] font-bold">
            workspace_premium
          </span>
        </div>

        <div>
          <span className="font-label-caps text-[11px] text-[#009668] font-bold uppercase tracking-wider">
            Treino Concluído com Sucesso!
          </span>
          <h3 className="font-headline-md text-[22px] text-[#0b1c30] font-extrabold mt-0.5">
            Excelente Trabalho, Mariana!
          </h3>
          <p className="font-body-sm text-[13px] text-[#45464d] mt-1">
            Mais um passo firme na sua meta semanal.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-[#f8f9ff] p-3 rounded-2xl border border-[#e5eeff]">
          <div>
            <div className="font-headline-sm text-[16px] text-[#0b1c30] font-bold">
              {summary.durationMinutes} min
            </div>
            <div className="font-label-caps text-[10px] text-[#76777d]">Duração</div>
          </div>
          <div>
            <div className="font-headline-sm text-[16px] text-[#0b1c30] font-bold">
              {summary.calories}
            </div>
            <div className="font-label-caps text-[10px] text-[#76777d]">kcal</div>
          </div>
          <div>
            <div className="font-headline-sm text-[16px] text-[#009668] font-bold">
              {(summary.volumeKg / 1000).toFixed(1)}k kg
            </div>
            <div className="font-label-caps text-[10px] text-[#76777d]">Volume</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#006398] hover:bg-[#004b73] text-white font-label-md text-[14px] font-bold rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
        >
          Salvar Treino &amp; Voltar ao Início
        </button>
      </div>
    </div>
  );
};

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Avaliação Física Confirmada',
      time: 'Hoje às 08:30',
      description: 'Sua bioimpedância está agendada para 18 de Novembro às 09:30 com Prof. Gabriel.',
      icon: 'event',
      unread: true,
    },
    {
      id: '2',
      title: 'Novo Recorde Pessoal (PR)!',
      time: 'Ontem',
      description: 'Você atingiu 72kg no supino reto. Aumento de +22kg no ciclo.',
      icon: 'military_tech',
      unread: true,
    },
    {
      id: '3',
      title: 'Mensagem do Prof. Lucas',
      time: 'Segunda-feira',
      description: 'Ficha atualizada com foco em deltoides e peitoral.',
      icon: 'chat',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#eff4ff] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006398] text-[22px]">
              notifications
            </span>
            <h3 className="font-headline-sm text-[17px] text-[#0b1c30] font-bold">
              Notificações
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777d] hover:bg-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border text-left flex gap-3 items-start ${
                n.unread
                  ? 'bg-[#eff4ff] border-[#dce9ff]'
                  : 'bg-[#f8f9ff] border-[#e5eeff]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#006398] shadow-xs shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">
                  {n.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-label-md text-[13px] font-bold text-[#0b1c30] truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-[#76777d] shrink-0">
                    {n.time}
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-[#45464d] mt-0.5 leading-snug">
                  {n.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#e5eeff] text-[#006398] font-label-md text-[13px] font-bold rounded-full hover:bg-[#dce9ff]"
        >
          Marcar todas como lidas
        </button>
      </div>
    </div>
  );
};
