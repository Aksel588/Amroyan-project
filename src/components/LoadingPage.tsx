
import NetworkAnimation from '@/components/NetworkAnimation';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <NetworkAnimation />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
        <div className="relative">
          <img 
            src="/lovable-uploads/5180109d-84d2-4fc9-aad0-bd08a847311d.png" 
            alt="Amroyan Consulting Logo" 
            className="h-24 w-auto animate-logo-pulse"
          />
        </div>
        <div className="w-48 h-1 bg-gradient-to-r from-logo-dark/20 via-logo-medium/30 to-logo-dark/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-logo-light to-transparent animate-loading-bar w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
