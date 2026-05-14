interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 ${onClick ? 'active:scale-[0.98] transition-all cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
