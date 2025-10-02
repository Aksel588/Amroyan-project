import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface AdminLinkProps {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const AdminLink = ({ className = '', onClick, children }: AdminLinkProps) => {
  return (
    <Link
      to="/admin"
      onClick={onClick}
      className={`text-sm font-medium transition-colors hover:text-gold-400 flex items-center gap-1 ${className}`}
    >
      <Shield size={16} />
      {children || 'Ադմին'}
    </Link>
  );
};

export default AdminLink;
