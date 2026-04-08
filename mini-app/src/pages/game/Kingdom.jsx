import { useState, useCallback, useEffect } from 'react';
import StatsBar from './components/StatsBar.jsx';
import ResourceCard from './components/ResourceCard.jsx';
import DailyChest from './components/DailyChest.jsx';
import Market from './components/Market.jsx';
import Guild, { DEMO_GUILDS, DEMO_MEMBERS } from './components/Guild.jsx';
import Trade, { DEMO_PENDING_TRADES } from './components/Trade.jsx';
import TelegramAuth, { useTelegram } from './components/TelegramAuth.jsx';
import { RESOURCES, getRandomChestReward } from './resources.js';
import { isNFTEligible, generateTokenId, generateNFTMetadata } from './nft.js';
import './Animations.css';
import './Kingdom.css';

export default function Kingdom() {
  // Telegram Auth - skip login if from Telegram
  const [telegramUser, setTelegramUser] = useState(null);
  const { hapticFeedback, showAlert, isTelegram } = useTelegram();

  // Auto-skip to demo mode for Telegram users
  useEffect(() => {
    if (isTelegram && !telegramUser) {
      // Set demo user for Telegram
      const demoUser = { is_telegram: true, id: 'tg_' + Date.now(), username: 'Telegram User' };
      setTelegramUser(demoUser);
    }
  }, [isTelegram, telegramUser]);

  // Game State
  const [kingdomLevel, setKingdomLevel] = useState(1);
  const [sahBalance, setSahBalance] = useState(500);
  const [inventory, setInventory] = useState([]);
  const [newItems, setNewItems] = useState(new Set());
  const [activeTab, setActiveTab] = useState('collection');
  const [lastChestOpen, setLastChestOpen] = useState(null);
  
  // Guild State
  const [userGuild, setUserGuild] = useState(null);
  const [guildMembers] = useState(DEMO_MEMBERS);
  
  // Trade State
  const [pendingTrades, setPendingTrades] = useState(DEMO_PENDING_TRADES);
  
  // NFT State
  const [ownedNFTs, setOwnedNFTs] = useState([]);

  // Handle Telegram auth
  const handleTelegramAuth = useCallback((user) => {
    setTelegramUser(user);
    if (user?.is_telegram) {
      // Load user data from Telegram
      hapticFeedback('light');
    }
  }, [hapticFeedback]);

  // Calculate totals
  const totalResources = inventory.reduce((sum, item) => sum + (item.count || 1), 0);
  const musicianCount = inventory.filter(i => i.category === 'musicians').length;

  // Demo market listings
  const [marketListings] = useState([
    { id: 1, item: RESOURCES.instruments.items[0], price: 200, seller: 'producer_x' },
    { id: 2, item: RESOURCES.gems.items[0], price: 80, seller: 'gem_collector' },
    { id: 3, item: RESOURCES.albums.items[2], price: 550, seller: 'vinyl_lover' },
    { id: 4, item: RESOURCES.notes.items[5], price: 8, seller: 'theory_master' },
    { id: 5, item: RESOURCES.musicians.items[2], price: 350, seller: 'studio_head' },
  ]);

  // Handle daily chest
  const handleChestOpen = useCallback(() => {
    hapticFeedback?.('medium');
    const reward = getRandomChestReward();
    setLastChestOpen(Date.now());
    
    setInventory(prev => {
      const existing = prev.find(i => i.id === reward.id);
      if (existing) {
        return prev.map(i => 
          i.id === reward.id 
            ? { ...i, count: (i.count || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...reward, count: 1 }];
    });

    setNewItems(prev => new Set([...prev, reward.id]));
    setTimeout(() => {
      setNewItems(prev => {
        const next = new Set(prev);
        next.delete(reward.id);
        return next;
      });
    }, 3000);

    // Bonus SAH
    setSahBalance(prev => prev + reward.value);
    
    // Check if NFT eligible
    if (isNFTEligible(reward)) {
      const tokenId = generateTokenId(telegramUser?.id || 'demo', reward.id);
      const nft = generateNFTMetadata(reward, telegramUser?.id || 'demo', tokenId);
      setOwnedNFTs(prev => [...prev, nft]);
      showAlert?.('🎉 New NFT minted! Check your collection!');
    }
    
    return reward;
  }, [telegramUser, hapticFeedback, showAlert]);

  // Check if chest can be opened
  const canOpenChest = !lastChestOpen || 
    Date.now() - lastChestOpen >= 24 * 60 * 60 * 1000;

  const timeUntilChest = lastChestOpen 
    ? Math.max(0, 24 * 60 * 60 * 1000 - (Date.now() - lastChestOpen))
    : 0;

  // Handle buy from market
  const handleBuy = (listing) => {
    hapticFeedback?.('light');
    if (sahBalance < listing.price) {
      showAlert?.('Not enough SAH!');
      return;
    }
    
    setSahBalance(prev => prev - listing.price);
    setInventory(prev => {
      const existing = prev.find(i => i.id === listing.item.id);
      if (existing) {
        return prev.map(i => 
          i.id === listing.item.id 
            ? { ...i, count: (i.count || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...listing.item, count: 1 }];
    });

    // Check NFT
    if (isNFTEligible(listing.item)) {
      const tokenId = generateTokenId(telegramUser?.id || 'demo', listing.item.id);
      const nft = generateNFTMetadata(listing.item, telegramUser?.id || 'demo', tokenId);
      setOwnedNFTs(prev => [...prev, nft]);
      showAlert?.('🎉 NFT acquired!');
    }
  };

  // Handle sell
  const handleSell = ({ item, price }) => {
    hapticFeedback?.('light');
    setInventory(prev => prev.filter(i => i.id !== item.id));
    setSahBalance(prev => prev + price);
  };

  // Add starter resources
  const addStarterResources = () => {
    hapticFeedback?.('medium');
    const starters = [
      { ...RESOURCES.notes.items[0], category: 'notes', count: 10 },
      { ...RESOURCES.instruments.items[3], category: 'instruments', count: 1 },
      { ...RESOURCES.musicians.items[1], category: 'musicians', count: 1 },
    ];
    setInventory(starters);
  };

  // Guild handlers
  const handleCreateGuild = (name) => {
    hapticFeedback?.('success');
    setUserGuild({
      id: `guild_${Date.now()}`,
      name,
      icon: '🏛️',
      members: 1,
      level: 1,
      treasury: 0
    });
    showAlert?.(`Guild "${name}" created!`);
  };

  const handleJoinGuild = (guildId) => {
    hapticFeedback?.('light');
    const guild = DEMO_GUILDS.find(g => g.id === guildId);
    if (guild) {
      setUserGuild({
        ...guild,
        treasury: 0
      });
      showAlert?.(`Joined "${guild.name}"!`);
    }
  };

  const handleLeaveGuild = () => {
    hapticFeedback?.('heavy');
    setUserGuild(null);
    showAlert?.('Left the guild');
  };

  const handleGuildDonate = (amount) => {
    if (sahBalance < amount) {
      showAlert?.('Not enough SAH!');
      return;
    }
    hapticFeedback?.('success');
    setSahBalance(prev => prev - amount);
    setUserGuild(prev => ({
      ...prev,
      treasury: (prev?.treasury || 0) + amount
    }));
    showAlert?.(`Donated ${amount} SAH!`);
  };

  // Trade handlers
  const handleSendTrade = (trade) => {
    showAlert?.('Trade offer sent!');
  };

  const handleAcceptTrade = (tradeId) => {
    hapticFeedback?.('success');
    setPendingTrades(prev => prev.filter(t => t.id !== tradeId));
    showAlert?.('Trade accepted!');
  };

  const handleRejectTrade = (tradeId) => {
    hapticFeedback?.('light');
    setPendingTrades(prev => prev.filter(t => t.id !== tradeId));
  };

  return (
    <div className="kingdom-page">
      {/* Telegram Auth Handler */}
      <TelegramAuth onAuth={handleTelegramAuth} />

      {/* Hero Section */}
      <div className="kingdom-hero">
        <div className="hero-bg" />
        {isTelegram && (
          <div className="telegram-badge">📱 Telegram</div>
        )}
        <div className="hero-content">
          <h1 className="kingdom-title">🏰 SAH Kingdom</h1>
          <p className="kingdom-subtitle">
            {telegramUser?.is_telegram 
              ? `Welcome, ${telegramUser.username || telegramUser.first_name}!`
              : 'Build your musical empire'}
          </p>
        </div>
        <div className="hero-decoration">
          <span className="deco-icon">🎵</span>
          <span className="deco-icon">🎸</span>
          <span className="deco-icon">💎</span>
          <span className="deco-icon">🎹</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="kingdom-content">
        {/* Stats Bar */}
        <StatsBar
          kingdomLevel={kingdomLevel}
          totalResources={totalResources}
          sahBalance={sahBalance}
          musicians={musicianCount}
        />

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button 
            className={`nav-tab ${activeTab === 'collection' ? 'active' : ''}`}
            onClick={() => setActiveTab('collection')}
          >
            📦 Collection
          </button>
          <button 
            className={`nav-tab ${activeTab === 'chest' ? 'active' : ''}`}
            onClick={() => setActiveTab('chest')}
          >
            🎁 Chest
          </button>
          <button 
            className={`nav-tab ${activeTab === 'market' ? 'active' : ''}`}
            onClick={() => setActiveTab('market')}
          >
            🎪 Market
          </button>
          <button 
            className={`nav-tab ${activeTab === 'guild' ? 'active' : ''}`}
            onClick={() => setActiveTab('guild')}
          >
            🏛️ Guild
          </button>
          <button 
            className={`nav-tab ${activeTab === 'trade' ? 'active' : ''}`}
            onClick={() => setActiveTab('trade')}
          >
            🤝 Trade
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'collection' && (
            <div className="collection-section">
              {inventory.length === 0 ? (
                <div className="empty-collection">
                  <span className="empty-icon">🎸</span>
                  <h3>Your kingdom awaits!</h3>
                  <p>Start collecting resources to build your musical empire.</p>
                  {ownedNFTs.length > 0 && (
                    <p className="nft-count">🎨 {ownedNFTs.length} NFTs collected</p>
                  )}
                  <button className="starter-btn" onClick={addStarterResources}>
                    Get Starter Pack
                  </button>
                </div>
              ) : (
                <div className="collection-grid">
                  {inventory.map((item, index) => (
                    <div 
                      key={item.id}
                      className="collection-item"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ResourceCard
                        item={item}
                        count={item.count}
                        isNew={newItems.has(item.id)}
                        isSpawning={index < 12}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chest' && (
            <div className="chest-section">
              <DailyChest
                canOpen={canOpenChest}
                timeUntilOpen={timeUntilChest}
                lastOpened={lastChestOpen}
                onOpen={handleChestOpen}
              />
            </div>
          )}

          {activeTab === 'market' && (
            <div className="market-section">
              <Market
                listings={marketListings}
                userBalance={sahBalance}
                userInventory={inventory}
                onBuy={handleBuy}
                onSell={handleSell}
              />
            </div>
          )}

          {activeTab === 'guild' && (
            <div className="guild-section">
              <Guild
                userGuild={userGuild}
                availableGuilds={DEMO_GUILDS}
                members={guildMembers}
                onCreateGuild={handleCreateGuild}
                onJoinGuild={handleJoinGuild}
                onLeaveGuild={handleLeaveGuild}
                onGuildDonate={handleGuildDonate}
              />
            </div>
          )}

          {activeTab === 'trade' && (
            <div className="trade-section">
              <Trade
                myInventory={inventory}
                pendingTrades={pendingTrades}
                onSendTrade={handleSendTrade}
                onAcceptTrade={handleAcceptTrade}
                onRejectTrade={handleRejectTrade}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
