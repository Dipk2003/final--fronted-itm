import React from 'react';

interface LoadingStatesProps {
  type?: 'spinner' | 'skeleton' | 'progress';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  isFullScreen?: boolean;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  type = 'spinner',
  size = 'medium',
  text,
  isFullScreen = false,
}) => {
  const renderSpinner = () => (
    <div className={`spinner ${size}`}>
      <div className="spinner-border" role="status">
        <span className="sr-only">{text || 'Loading...'}</span>
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className={`skeleton ${size}`}>
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
    </div>
  );

  const renderProgress = () => (
    <div className={`progress ${size}`}>
      <div className="progress-bar" role="progressbar" />
    </div>
  );

  const content = () => {
    switch (type) {
      case 'skeleton':
        return renderSkeleton();
      case 'progress':
        return renderProgress();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`loading-states ${isFullScreen ? 'fullscreen' : ''}`}>
      {content()}
      {text && <p className="loading-text">{text}</p>}

      <style jsx>{`
        .loading-states {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          z-index: 1000;
        }

        .spinner {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .spinner.small { width: 1rem; height: 1rem; }
        .spinner.medium { width: 2rem; height: 2rem; }
        .spinner.large { width: 3rem; height: 3rem; }

        .skeleton {
          width: 100%;
          max-width: 600px;
        }

        .skeleton-line {
          height: 1rem;
          background: #f0f0f0;
          margin: 0.5rem 0;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }

        .skeleton.small .skeleton-line { height: 0.5rem; }
        .skeleton.large .skeleton-line { height: 1.5rem; }

        .progress {
          width: 100%;
          max-width: 300px;
          height: 0.5rem;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          width: 100%;
          height: 100%;
          background: var(--primary-color, #007bff);
          animation: progress 1s infinite linear;
        }

        .loading-text {
          margin-top: 1rem;
          color: var(--text-color, #666);
          font-size: 0.9rem;
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingStates;
