import { useState, useEffect, useRef } from 'react';
import ResourceCard from './ResourceCard.jsx';
import './DailyChest.css';

export default function DailyChest({
  onOpen,
  canOpen = false,
  timeUntilOpen = 0,
  lastOpened = null
}) {
  const [isOpening, setIsOpening] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [shaking, setShaking] = useState(false);
  const chestRef = useRef(null);

  // Shaking effect when ready to open
  useEffect(() => {
    if (canOpen && !isOpening) {
      const shakeInterval = setInterval(() => {
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
      }, 5000);
      return () => clearInterval(shakeInterval);
    }
  }, [canOpen, isOpening]);

  // Countdown timer
  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleOpen = async () => {
    if (!canOpen || isOpening) return;
    
    setIsOpening(true);
    
    // Open animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate rewards
    const newRewards = [];
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const reward = onOpen?.() || { 
        id: `reward_${Date.now()}_${i}`,
        name: 'Mystery Reward',
        icon: '🎁',
        rarity: 'common',
        value: 10,
        category: 'notes'
      };
      newRewards.push({ ...reward, index: i });
    }
    
    setRewards(newRewards);
    setShowRewards(true);
    
    // Auto-close rewards after showing
    setTimeout(() => {
      setShowRewards(false);
      setIsOpening(false);
      setRewards([]);
    }, 5000);
  };

  return (
    <div className="daily-chest-container">
      {/* Chest */}
      <div 
        ref={chestRef}
        className={`daily-chest ${canOpen ? 'ready' : 'locked'} ${isOpening ? 'opening' : ''} ${shaking ? 'shaking' : ''}`}
        onClick={handleOpen}
      >
        {/* Glow ring */}
        <div className="chest-glow-ring" />
        
        {/* Chest icon */}
        <div className="chest-icon">
          {isOpening ? '✨' : canOpen ? '🎁' : '🔒'}
        </div>
        
        {/* Status */}
        <div className="chest-status">
          {canOpen ? (
            <span className="status-ready">TAP TO OPEN!</span>
          ) : (
            <span className="status-timer">{formatTime(timeUntilOpen)}</span>
          )}
        </div>
        
        {/* Lock icon overlay when locked */}
        {!canOpen && (
          <div className="lock-overlay">
            <span>🔒</span>
          </div>
        )}
      </div>

      {/* Light burst effect */}
      {isOpening && (
        <div className="light-burst">
          <div className="burst-ring" />
          <div className="burst-ring delay-1" />
          <div className="burst-ring delay-2" />
        </div>
      )}

      {/* Rewards */}
      {showRewards && (
        <div className="rewards-container">
          <h3 className="rewards-title">🎉 Rewards!</h3>
          <div className="rewards-grid">
            {rewards.map((reward, index) => (
              <div 
                key={reward.id}
                className="reward-slot"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ResourceCard
                  item={reward}
                  size="small"
                  isSpawning={true}
                  showCount={false}
                />
                <button 
                  className="collect-btn"
                  onClick={() => {
                    // Collect logic handled by parent
                  }}
                >
                  Collect
                </button>
              </div>
            ))}
          </div>
          <p className="rewards-hint">Collect all rewards!</p>
        </div>
      )}

      {/* Info */}
      <div className="chest-info">
        <h3>Daily Chest</h3>
        <p>Open once every 24 hours for free rewards!</p>
      </div>
    </div>
  );
}
