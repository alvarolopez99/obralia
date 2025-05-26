interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
}

export function NavigationButtons({ onPrevious, onNext, isPreviousDisabled }: NavigationButtonsProps) {
  return (
    <>
      {/* Flecha izquierda */}
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full border border-green-500 text-green-600 bg-white hover:bg-green-50 hover:cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onPrevious}
        aria-label="Mes anterior"
        disabled={isPreviousDisabled}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      {/* Flecha derecha */}
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full border border-green-500 text-green-600 bg-white hover:bg-green-50 hover:cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onNext}
        aria-label="Mes siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </>
  );
} 