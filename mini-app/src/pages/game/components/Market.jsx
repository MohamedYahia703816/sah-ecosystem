import { useState, useCallback } from 'react';
import ResourceCard from './ResourceCard.jsx';
import './Market.css';

export default function Market({ 
  listings = [], 
  onBuy, 
  onSell, 
  userBalance = 0,
  userInventory = []
}) {
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellPrice, setSellPrice] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuy = async (listing) => {
    if (isProcessing) return;
    if (userBalance < listing.price) {
      showNotification('Not enough SAH!', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await onBuy?.(listing);
      showNotification(`Bought ${listing.item.name}!`);
    } catch (err) {
      showNotification('Purchase failed!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSell = () => {
    if (!selectedItem || !sellPrice) return;
    
    const price = parseInt(sellPrice);
    if (isNaN(price) || price < 1) {
      showNotification('Invalid price!', 'error');
      return;
    }

    setIsProcessing(true);
    onSell?.({
      item: selectedItem,
      price
    });
    
    setSelectedItem(null);
    setSellPrice('');
    setIsProcessing(false);
    showNotification(`Listed ${selectedItem.name} for ${price} SAH!`);
  };

  return (
    <div className="market-container">
      {/* Header */}
      <div className="market-header">
        <h2 className="market-title">🎪 Music Market</h2>
        <div className="market-tabs">
          <button 
            className={`tab ${activeTab === 'buy' ? 'active' : ''}`}
            onClick={() => setActiveTab('buy')}
          >
            Buy
          </button>
          <button 
            className={`tab ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => setActiveTab('sell')}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Content */}
      <div className="market-content">
        {activeTab === 'buy' ? (
          /* Buy Listings */
          <div className="listings-grid">
            {listings.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🏪</span>
                <p>No listings available</p>
                <span className="empty-hint">Check back later!</span>
              </div>
            ) : (
              listings.map((listing, index) => (
                <div 
                  key={listing.id}
                  className="listing-card"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ResourceCard
                    item={listing.item}
                    size="small"
                    showCount={false}
                  />
                  <div className="listing-info">
                    <span className="seller">@{listing.seller}</span>
                    <div className="listing-price">
                      <span className="price-amount">{listing.price}</span>
                      <span className="price-label">SAH</span>
                    </div>
                  </div>
                  <button 
                    className="buy-btn"
                    onClick={() => handleBuy(listing)}
                    disabled={isProcessing || userBalance < listing.price}
                  >
                    {userBalance >= listing.price ? 'Buy' : 'No Funds'}
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Sell Section */
          <div className="sell-section">
            {selectedItem ? (
              <div className="sell-form">
                <div className="selected-item">
                  <ResourceCard
                    item={selectedItem}
                    size="medium"
                    showCount={false}
                  />
                </div>
                <div className="price-input">
                  <label>Set your price:</label>
                  <div className="input-wrapper">
                    <span className="input-icon">💰</span>
                    <input
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      placeholder="Enter SAH amount"
                      min="1"
                    />
                    <span className="input-suffix">SAH</span>
                  </div>
                </div>
                <div className="sell-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setSelectedItem(null);
                      setSellPrice('');
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="confirm-sell-btn"
                    onClick={handleSell}
                    disabled={!sellPrice || isProcessing}
                  >
                    List for Sale
                  </button>
                </div>
              </div>
            ) : (
              <div className="inventory-grid">
                <h3>Select an item to sell:</h3>
                {userInventory.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📦</span>
                    <p>No items in inventory</p>
                    <span className="empty-hint">Collect resources first!</span>
                  </div>
                ) : (
                  userInventory.map((item, index) => (
                    <div
                      key={item.id}
                      className="inventory-item"
                      style={{ animationDelay: `${index * 30}ms` }}
                      onClick={() => setSelectedItem(item)}
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
            )}
          </div>
        )}
      </div>

      {/* Market Stats */}
      <div className="market-stats">
        <div className="stat">
          <span className="stat-label">Active Listings</span>
          <span className="stat-value">{listings.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg Price</span>
          <span className="stat-value">
            {listings.length > 0 
              ? Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length)
              : 0} SAH
          </span>
        </div>
      </div>
    </div>
  );
}
