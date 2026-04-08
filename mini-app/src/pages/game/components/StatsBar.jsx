import { useState, useEffect, useRef } from 'react';
import './StatsBar.css';

export default function StatsBar({ 
  kingdomLevel = 1, 
  totalResources = 0, 
  sahBalance = 0, 
  musicians = 0,
  onLevelUp
}) {
  const [displayBalance, setDisplayBalance] = useState(sahBalance);
  const [displayResources, setDisplayResources] = useState(totalResources);
  const [balanceAnim, setBalanceAnim] = useState(null);
  const [levelUpAnim, setLevelUpAnim] = useState(false);
  const prevBalance = useRef(sahBalance);
  const prevResources = useRef(totalResources);
  const prevLevel = useRef(kingdomLevel);

  // Animate balance changes
  useEffect(() => {
    if (sahBalance !== prevBalance.current) {
      const diff = sahBalance - prevBalance.current;
      setBalanceAnim(diff > 0 ? 'up' : 'down');
      
      // Count up/down animation
      const steps = 20;
      const stepValue = diff / steps;
      let current = prevBalance.current;
      
      const interval = setInterval(() => {
        current += stepValue;
        setDisplayBalance(Math.round(current));
        if ((diff > 0 && current >= sahBalance) || 
            (diff < 0 && current <= sahBalance)) {
          clearInterval(interval);
          setDisplayBalance(sahBalance);
        }
      }, 30);
      
      setTimeout(() => setBalanceAnim(null), 500);
      prevBalance.current = sahBalance;
    }
  }, [sahBalance]);

  // Animate resource changes
  useEffect(() => {
    if (totalResources !== prevResources.current) {
      const diff = totalResources - prevResources.current;
      prevResources.current = totalResources;
    }
  }, [totalResources]);

  // Level up animation
  useEffect(() => {
    if (kingdomLevel > prevLevel.current) {
      setLevelUpAnim(true);
      onLevelUp?.();
      setTimeout(() => setLevelUpAnim(false), 1000);
      prevLevel.current = kingdomLevel;
    }
  }, [kingdomLevel, onLevelUp]);

  return (
    <div className="stats-bar">
      {/* Kingdom Level */}
      <div className={`stat-card level-card ${levelUpAnim ? 'level-up' : ''}`}>
        <div className="stat-icon">🏰</div>
        <div className="stat-info">
          <span className="stat-label">Kingdom Level</span>
          <span className="stat-value level-value">{kingdomLevel}</span>
        </div>
        {levelUpAnim && (
          <div className="level-up-burst">
            <span>⬆️</span>
          </div>
        )}
      </div>

      {/* Total Resources */}
      <div className="stat-card resources-card">
        <div className="stat-icon">📦</div>
        <div className="stat-info">
          <span className="stat-label">Resources</span>
          <span className="stat-value">{totalResources}</span>
        </div>
      </div>

      {/* SAH Balance */}
      <div className={`stat-card balance-card ${balanceAnim ? `balance-${balanceAnim}` : ''}`}>
        <div className="stat-icon">💰</div>
        <div className="stat-info">
          <span className="stat-label">SAH Balance</span>
          <span className="stat-value balance-value">
            {displayBalance.toLocaleString()}
            <span className="balance-suffix">SAH</span>
          </span>
        </div>
      </div>

      {/* Musicians */}
      <div className="stat-card musicians-card">
        <div className="stat-icon">👥</div>
        <div className="stat-info">
          <span className="stat-label">Musicians</span>
          <span className="stat-value">{musicians}</span>
        </div>
      </div>
    </div>
  );
}
