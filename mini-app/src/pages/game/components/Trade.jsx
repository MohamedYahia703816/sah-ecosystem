import { useState } from 'react';
import { useTelegram } from './TelegramAuth.jsx';
import ResourceCard from './ResourceCard.jsx';
import './Trade.css';

export default function Trade({
  myInventory = [],
  onSendTrade,
  pendingTrades = [],
  onAcceptTrade,
  onRejectTrade
}) {
  const { hapticFeedback, showAlert } = useTelegram();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [showMyTrades, setShowMyTrades] = useState(false);

  const handleSelectItem = (item) => {
    hapticFeedback('light');
    setSelectedItem(item);
  };

  const handleSendOffer = async () => {
    if (!selectedItem || !selectedPartner || !offerPrice) {
      showAlert('Please select an item, partner, and price');
      return;
    }

    hapticFeedback('medium');
    
    const trade = {
      id: `trade_${Date.now()}`,
      item: selectedItem,
      offeredBy: 'me',
      price: parseInt(offerPrice),
      status: 'pending',
      timestamp: Date.now()
    };

    onSendTrade?.(trade);
    
    setSelectedItem(null);
    setSelectedPartner(null);
    setOfferPrice('');
    showAlert('Trade offer sent! 🎉');
  };

  const handleAccept = (tradeId) => {
    hapticFeedback('success');
    onAcceptTrade?.(tradeId);
  };

  const handleReject = (tradeId) => {
    hapticFeedback('light');
    onRejectTrade?.(tradeId);
  };

  // Demo partners
  const partners = [
    { id: 1, name: 'BeatMaker99', avatar: '🥁' },
    { id: 2, name: 'SynthMaster', avatar: '🎛️' },
    { id: 3, name: 'VocalQueen', avatar: '👑' },
    { id: 4, name: 'GuitarHero', avatar: '🎸' },
  ];

  return (
    <div className="trade-container">
      {/* Header */}
      <div className="trade-header">
        <h2 className="trade-title">🤝 Trade Center</h2>
        <div className="trade-tabs">
          <button 
            className={`tab ${!showMyTrades ? 'active' : ''}`}
            onClick={() => setShowMyTrades(false)}
          >
            New Trade
          </button>
          <button 
            className={`tab ${showMyTrades ? 'active' : ''}`}
            onClick={() => setShowMyTrades(true)}
          >
            My Trades ({pendingTrades.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {showMyTrades ? (
        /* Pending Trades */
        <div className="pending-trades">
          {pendingTrades.length === 0 ? (
            <div className="empty-state">
              <span>📋</span>
              <p>No pending trades</p>
              <span className="hint">Send an offer to start trading!</span>
            </div>
          ) : (
            pendingTrades.map(trade => (
              <div key={trade.id} className="trade-card">
                <div className="trade-info">
                  <span className="trade-icon">{trade.item.icon}</span>
                  <div className="trade-details">
                    <span className="trade-item">{trade.item.name}</span>
                    <span className="trade-price">{trade.price} SAH</span>
                  </div>
                </div>
                <div className="trade-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleAccept(trade.id)}
                  >
                    ✓
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(trade.id)}
                  >
                    ✗
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* New Trade Form */
        <div className="trade-form">
          {/* Step 1: Select Item */}
          <div className="form-step">
            <h3>1️⃣ Select Item to Trade</h3>
            <div className="items-grid">
              {myInventory.length === 0 ? (
                <p className="no-items">No items to trade</p>
              ) : (
                myInventory.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={selectedItem?.id === item.id ? 'selected' : ''}
                  >
                    <ResourceCard
                      item={item}
                      size="small"
                      showCount={false}
                    />
                  </div>
                ))
              )}
            </div>
            {selectedItem && (
              <div className="selected-info">
                Selected: <strong>{selectedItem.name}</strong>
              </div>
            )}
          </div>

          {/* Step 2: Select Partner */}
          <div className="form-step">
            <h3>2️⃣ Select Trading Partner</h3>
            <div className="partners-grid">
              {partners.map(partner => (
                <div 
                  key={partner.id}
                  className={`partner-card ${selectedPartner?.id === partner.id ? 'selected' : ''}`}
                  onClick={() => {
                    hapticFeedback('light');
                    setSelectedPartner(partner);
                  }}
                >
                  <span className="partner-avatar">{partner.avatar}</span>
                  <span className="partner-name">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Set Price */}
          <div className="form-step">
            <h3>3️⃣ Set Your Price</h3>
            <div className="price-input">
              <span className="currency">💰</span>
              <input
                type="number"
                placeholder="Enter SAH amount..."
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                min="1"
              />
              <span className="suffix">SAH</span>
            </div>
          </div>

          {/* Submit */}
          <button 
            className="send-offer-btn"
            onClick={handleSendOffer}
            disabled={!selectedItem || !selectedPartner || !offerPrice}
          >
            Send Trade Offer
          </button>
        </div>
      )}
    </div>
  );
}

// Demo pending trades
export const DEMO_PENDING_TRADES = [
  { id: 1, item: { name: 'Vintage Stratocaster', icon: '🎸' }, price: 300, offeredBy: 'BeatMaker99' },
  { id: 2, item: { name: 'Diamond of Fame', icon: '💠' }, price: 4500, offeredBy: 'SynthMaster' },
];
