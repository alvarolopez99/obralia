interface ClearDatesButtonProps {
  onClick: () => void;
  className?: string;
}

export function ClearDatesButton({ onClick, className }: ClearDatesButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className || "mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors hover:cursor-pointer"}
    >
      Clear dates
    </button>
  );
} 