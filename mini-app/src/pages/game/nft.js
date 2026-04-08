// ============================================
// NFT METADATA STRUCTURE
// ============================================

export const NFT_STANDARDS = {
  BEP721: 'BEP-721',  // Unique tokens (instruments, albums)
  BEP1155: 'BEP-1155' // Fungible tokens (notes, gems)
};

export const NFT_ATTRIBUTES = {
  instrument: {
    type: 'instrument',
    category: 'Equipment',
    tradeable: true,
    staking_enabled: true,
    attributes: ['rarity', 'condition', 'year', 'brand', 'power']
  },
  album: {
    type: 'album',
    category: 'Media',
    tradeable: true,
    royalties: true,
    attributes: ['rarity', 'genre', 'artist', 'year', 'plays']
  },
  gem: {
    type: 'gem',
    category: 'Resource',
    tradeable: true,
    stackable: true,
    attributes: ['rarity', 'power', 'multiplier']
  },
  musician: {
    type: 'musician',
    category: 'Character',
    tradeable: true,
    attributes: ['rarity', 'skill', 'specialty', 'level']
  }
};

export function generateNFTMetadata(item, ownerId, tokenId) {
  const baseAttributes = NFT_ATTRIBUTES[item.category] || NFT_ATTRIBUTES.instrument;
  
  return {
    name: item.name,
    description: item.desc || `${item.name} - A ${item.rarity} ${baseAttributes.type}`,
    image: `https://api.telegram.org/file/kingdom-assets/${item.icon.replace(/[^a-z]/gi, '')}.png`,
    external_url: `https://t.me/YourBot/kingdom?item=${tokenId}`,
    attributes: [
      {
        trait_type: 'Rarity',
        value: item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)
      },
      {
        trait_type: 'Category',
        value: baseAttributes.category
      },
      {
        trait_type: 'Type',
        value: baseAttributes.type
      },
      {
        trait_type: 'Value (SAH)',
        value: item.value
      },
      {
        trait_type: 'Tradeable',
        value: baseAttributes.tradeable ? 'Yes' : 'No'
      },
      // Dynamic attributes based on type
      ...(item.category === 'instruments' ? [
        { trait_type: 'Condition', value: ['Mint', 'Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 4)] },
        { trait_type: 'Year', value: 1960 + Math.floor(Math.random() * 60) }
      ] : []),
      ...(item.category === 'albums' ? [
        { trait_type: 'Plays', value: Math.floor(Math.random() * 10000) },
        { trait_type: 'Genre', value: ['Pop', 'Rock', 'Jazz', 'Electronic', 'Classical'][Math.floor(Math.random() * 5)] }
      ] : []),
      ...(item.category === 'gems' ? [
        { trait_type: 'Power', value: 10 + item.value },
        { trait_type: 'Multiplier', value: (item.value / 100).toFixed(2) + 'x' }
      ] : [])
    ],
    blockchain: 'BNB Smart Chain',
    standard: item.category === 'notes' ? NFT_STANDARDS.BEP1155 : NFT_STANDARDS.BEP721,
    token_id: tokenId,
    contract_address: process.env.VITE_NFT_CONTRACT || '0x...',
    owner: ownerId,
    created_at: new Date().toISOString()
  };
}

// Check if item is NFT-ready (high rarity)
export function isNFTEligible(item) {
  const nftRarity = ['rare', 'epic', 'legendary'];
  return nftRarity.includes(item.rarity) && item.value >= 100;
}

// Generate unique token ID
export function generateTokenId(userId, itemId) {
  return `${userId}-${itemId}-${Date.now()}`;
}
