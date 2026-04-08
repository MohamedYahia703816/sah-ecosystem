// ============================================
// SAH KINGDOM — RESOURCE DEFINITIONS
// ============================================

export const RESOURCES = {
  instruments: {
    name: 'Instruments',
    icon: '🎸',
    color: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.4)',
    items: [
      { id: 'ins_1', name: 'Vintage Stratocaster', icon: '🎸', rarity: 'rare', value: 250, desc: '1965 American Classic' },
      { id: 'ins_2', name: 'Moog Synthesizer', icon: '🎹', rarity: 'epic', value: 500, desc: 'Analog warmth, digital precision' },
      { id: 'ins_3', name: 'Ludwig Drum Kit', icon: '🥁', rarity: 'rare', value: 300, desc: 'The heartbeat of rock' },
      { id: 'ins_4', name: 'Fender Telecaster', icon: '🎸', rarity: 'common', value: 50, desc: 'Country twang, blues soul' },
      { id: 'ins_5', name: 'Steinway Grand', icon: '🎹', rarity: 'legendary', value: 2000, desc: 'The pinnacle of pianos' },
      { id: 'ins_6', name: 'Gibson Les Paul', icon: '🎸', rarity: 'epic', value: 450, desc: 'Rock royalty' },
      { id: 'ins_7', name: 'Violin', icon: '🎻', rarity: 'rare', value: 180, desc: 'Classical elegance' },
      { id: 'ins_8', name: 'Saxophone', icon: '🎷', rarity: 'common', value: 80, desc: 'Smooth jazz vibes' },
    ]
  },
  notes: {
    name: 'Notes',
    icon: '🎵',
    color: '#4a9eff',
    glowColor: 'rgba(74, 158, 255, 0.4)',
    items: [
      { id: 'note_1', name: 'Quarter Note', icon: '♩', rarity: 'common', value: 1, desc: 'Basic rhythm unit' },
      { id: 'note_2', name: 'Half Note', icon: '𝅗𝅥', rarity: 'common', value: 2, desc: 'Hold it down' },
      { id: 'note_3', name: 'Whole Note', icon: '𝅝', rarity: 'common', value: 3, desc: 'Full duration' },
      { id: 'note_4', name: 'Eighth Notes', icon: '♪', rarity: 'common', value: 1, desc: 'Quick succession' },
      { id: 'note_5', name: 'Rest', icon: '𝄽', rarity: 'common', value: 1, desc: 'The space between' },
      { id: 'note_6', name: 'Treble Clef', icon: '𝄞', rarity: 'rare', value: 10, desc: 'High voice symbol' },
    ]
  },
  musicians: {
    name: 'Musicians',
    icon: '👤',
    color: '#9b59b6',
    glowColor: 'rgba(155, 89, 182, 0.4)',
    items: [
      { id: 'mus_1', name: 'Studio Session Pro', icon: '🎤', rarity: 'rare', value: 150, desc: 'Always nails the take' },
      { id: 'mus_2', name: 'Beat Maker', icon: '🎧', rarity: 'common', value: 50, desc: 'Rhythm specialist' },
      { id: 'mus_3', name: 'Vocal Virtuoso', icon: '🎚️', rarity: 'epic', value: 400, desc: 'Emotion in every note' },
      { id: 'mus_4', name: 'Mix Engineer', icon: '🔊', rarity: 'rare', value: 200, desc: 'Audio alchemist' },
      { id: 'mus_5', name: 'Legend', icon: '⭐', rarity: 'legendary', value: 1500, desc: 'The GOAT' },
    ]
  },
  albums: {
    name: 'Albums',
    icon: '💿',
    color: '#e74c3c',
    glowColor: 'rgba(231, 76, 60, 0.4)',
    items: [
      { id: 'alb_1', name: 'Indie Debut', icon: '💿', rarity: 'common', value: 30, desc: 'Fresh sounds' },
      { id: 'alb_2', name: 'Studio Album', icon: '💿', rarity: 'rare', value: 150, desc: 'Professional release' },
      { id: 'alb_3', name: 'Concept Album', icon: '💿', rarity: 'epic', value: 600, desc: 'A musical journey' },
      { id: 'alb_4', name: 'Greatest Hits', icon: '🏆', rarity: 'epic', value: 800, desc: 'Best of the best' },
      { id: 'alb_5', name: 'Platinum Record', icon: '🥇', rarity: 'legendary', value: 3000, desc: 'Million seller' },
    ]
  },
  gems: {
    name: 'Gems',
    icon: '💎',
    color: '#2ecc71',
    glowColor: 'rgba(46, 204, 113, 0.4)',
    items: [
      { id: 'gem_1', name: 'Sound Crystal', icon: '💎', rarity: 'rare', value: 100, desc: 'Enhances audio quality' },
      { id: 'gem_2', name: 'Rhythm Emerald', icon: '💚', rarity: 'rare', value: 120, desc: 'Boosts tempo' },
      { id: 'gem_3', name: 'Melody Ruby', icon: '❤️', rarity: 'epic', value: 300, desc: 'Improves harmony' },
      { id: 'gem_4', name: 'Harmony Sapphire', icon: '💙', rarity: 'epic', value: 350, desc: 'Perfect chords' },
      { id: 'gem_5', name: 'Diamond of Fame', icon: '💠', rarity: 'legendary', value: 5000, desc: 'Legendary multiplier' },
    ]
  }
};

export const RARITY_STYLES = {
  common: {
    borderColor: '#888888',
    glowColor: 'rgba(136, 136, 136, 0.3)',
    labelColor: '#888888',
    bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
  },
  rare: {
    borderColor: '#4a9eff',
    glowColor: 'rgba(74, 158, 255, 0.5)',
    labelColor: '#4a9eff',
    bgGradient: 'linear-gradient(135deg, #0a1520 0%, #1a2535 100%)'
  },
  epic: {
    borderColor: '#9b59b6',
    glowColor: 'rgba(155, 89, 182, 0.6)',
    labelColor: '#9b59b6',
    bgGradient: 'linear-gradient(135deg, #150a20 0%, #251530 100%)'
  },
  legendary: {
    borderColor: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.7)',
    labelColor: '#d4af37',
    bgGradient: 'linear-gradient(135deg, #1a150a 0%, #2a2510 100%)'
  }
};

export const CHEST_REWARDS = [
  { type: 'notes', weight: 40 },
  { type: 'instruments', weight: 25 },
  { type: 'musicians', weight: 15 },
  { type: 'albums', weight: 12 },
  { type: 'gems', weight: 8 }
];

export function getRandomChestReward() {
  const totalWeight = CHEST_REWARDS.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const reward of CHEST_REWARDS) {
    random -= reward.weight;
    if (random <= 0) {
      const resourcePool = RESOURCES[reward.type].items;
      const rarityRoll = Math.random();
      let filteredItems;
      
      if (rarityRoll < 0.6) filteredItems = resourcePool.filter(i => i.rarity === 'common');
      else if (rarityRoll < 0.85) filteredItems = resourcePool.filter(i => i.rarity === 'rare');
      else if (rarityRoll < 0.97) filteredItems = resourcePool.filter(i => i.rarity === 'epic');
      else filteredItems = resourcePool.filter(i => i.rarity === 'legendary');
      
      if (filteredItems.length === 0) filteredItems = resourcePool;
      
      return {
        ...filteredItems[Math.floor(Math.random() * filteredItems.length)],
        category: reward.type
      };
    }
  }
  
  return { ...CHEST_REWARDS[0], ...RESOURCES[CHEST_REWARDS[0].type].items[0] };
}
