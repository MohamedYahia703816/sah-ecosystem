import { useState } from 'react';
import { RARITY_STYLES } from '../resources.js';
import './ResourceCard.css';

export default function ResourceCard({
  item,
  count = 1,
  onClick,
  isNew = false,
  isSpawning = false,
  isRemoving = false,
  showCount = true,
  size = 'medium'
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const rarityStyle = RARITY_STYLES[item.rarity] || RARITY_STYLES.common;
  
  const handleClick = () => {
    if (isPressed) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick?.(item);
  };

  const cardClasses = [
    'resource-card',
    `rarity-${item.rarity}`,
    `size-${size}`,
    isNew && 'is-new',
    isSpawning && 'is-spawning',
    isRemoving && 'is-removing',
    isHovered && 'is-hovered',
    isPressed && 'is-pressed'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      style={{
        '--rarity-color': rarityStyle.borderColor,
        '--rarity-glow': rarityStyle.glowColor,
        '--rarity-bg': rarityStyle.bgGradient,
        animationDelay: isSpawning ? `${Math.random() * 300}ms` : '0ms'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
    >
      {/* Glow Effect */}
      <div className="card-glow" />
      
      {/* Rarity Badge */}
      <div className={`rarity-badge rarity-${item.rarity}`}>
        {item.rarity.charAt(0).toUpperCase()}
      </div>
      
      {/* Icon */}
      <div className="card-icon">
        {item.icon}
      </div>
      
      {/* Count Badge */}
      {showCount && count > 1 && (
        <div className="count-badge">
          x{count}
        </div>
      )}
      
      {/* Info */}
      <div className="card-info">
        <h4 className="card-name">{item.name}</h4>
        <div className="card-value">
          <span className="value-icon">💰</span>
          <span className="value-amount">{item.value}</span>
          <span className="value-label">SAH</span>
        </div>
      </div>
      
      {/* Hover Tooltip */}
      <div className="card-tooltip">
        <p className="tooltip-desc">{item.desc}</p>
        <span className="tooltip-rarity">{item.rarity.toUpperCase()}</span>
      </div>
      
      {/* New Indicator */}
      {isNew && <div className="new-badge">NEW!</div>}
    </div>
  );
}
