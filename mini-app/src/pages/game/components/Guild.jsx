import { useState } from 'react';
import { useTelegram } from './TelegramAuth.jsx';
import './Guild.css';

export default function Guild({ 
  userGuild = null, 
  availableGuilds = [], 
  onCreateGuild, 
  onJoinGuild, 
  onLeaveGuild,
  onGuildDonate,
  members = []
}) {
  const { hapticFeedback } = useTelegram();
  const [showCreate, setShowCreate] = useState(false);
  const [guildName, setGuildName] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  const handleCreate = () => {
    hapticFeedback('medium');
    onCreateGuild?.(guildName);
    setGuildName('');
    setShowCreate(false);
  };

  const handleJoin = (guildId) => {
    hapticFeedback('light');
    onJoinGuild?.(guildId);
  };

  const handleLeave = () => {
    hapticFeedback('heavy');
    onLeaveGuild?.();
  };

  const handleDonate = (amount) => {
    hapticFeedback('light');
    onGuildDonate?.(amount);
  };

  return (
    <div className="guild-container">
      {/* Header */}
      <div className="guild-header">
        <h2 className="guild-title">🏛️ Guilds</h2>
        {!userGuild && (
          <button 
            className="create-guild-btn"
            onClick={() => {
              hapticFeedback('light');
              setShowCreate(true);
            }}
          >
            + Create
          </button>
        )}
      </div>

      {/* Create Guild Modal */}
      {showCreate && (
        <div className="guild-modal-overlay">
          <div className="guild-modal">
            <h3>Create Your Guild</h3>
            <input
              type="text"
              placeholder="Guild name..."
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
              maxLength={30}
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleCreate}
                disabled={!guildName.trim()}
              >
                Create (100 SAH)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User's Guild */}
      {userGuild ? (
        <div className="my-guild">
          <div className="guild-card active">
            <div className="guild-banner">
              <span className="guild-icon">{userGuild.icon || '🏛️'}</span>
            </div>
            <div className="guild-info">
              <h3>{userGuild.name}</h3>
              <div className="guild-stats">
                <span>👥 {userGuild.members || 1}</span>
                <span>💰 {userGuild.treasury || 0} SAH</span>
                <span>📊 Level {userGuild.level || 1}</span>
              </div>
            </div>
            <div className="guild-actions">
              <button 
                className="action-btn"
                onClick={() => setShowMembers(!showMembers)}
              >
                👥 Members
              </button>
              <button 
                className="action-btn primary"
                onClick={() => handleDonate(50)}
              >
                💝 Donate
              </button>
            </div>
          </div>

          {/* Members List */}
          {showMembers && (
            <div className="members-list">
              <h4>Guild Members</h4>
              {members.map(member => (
                <div key={member.id} className="member-item">
                  <span className="member-avatar">
                    {member.avatar || '👤'}
                  </span>
                  <div className="member-info">
                    <span className="member-name">
                      {member.name}
                      {member.isLeader && ' 👑'}
                    </span>
                    <span className="member-contribution">
                      Contributed: {member.contribution} SAH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leave Button */}
          <button 
            className="leave-btn"
            onClick={handleLeave}
          >
            Leave Guild
          </button>
        </div>
      ) : (
        /* Available Guilds */
        <div className="guilds-grid">
          <h3>Join a Guild</h3>
          {availableGuilds.length === 0 ? (
            <div className="empty-state">
              <span>🏛️</span>
              <p>No guilds available</p>
              <span className="hint">Create your own!</span>
            </div>
          ) : (
            availableGuilds.map(guild => (
              <div 
                key={guild.id}
                className="guild-card"
                onClick={() => handleJoin(guild.id)}
              >
                <div className="guild-banner">
                  <span className="guild-icon">{guild.icon || '🏛️'}</span>
                </div>
                <div className="guild-info">
                  <h4>{guild.name}</h4>
                  <div className="guild-stats">
                    <span>👥 {guild.members}</span>
                    <span>📊 Lv.{guild.level}</span>
                  </div>
                  <button className="join-btn">Join</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Demo data for available guilds
export const DEMO_GUILDS = [
  { id: 1, name: 'BeatMakers', icon: '🎹', members: 42, level: 5 },
  { id: 2, name: 'SoundWaves', icon: '🌊', members: 28, level: 3 },
  { id: 3, name: 'VocalKings', icon: '👑', members: 15, level: 2 },
  { id: 4, name: 'SynthLegends', icon: '🎛️', members: 33, level: 4 },
];

export const DEMO_MEMBERS = [
  { id: 1, name: 'MusicKing', avatar: '🎸', isLeader: true, contribution: 500 },
  { id: 2, name: 'BeatMaker99', avatar: '🥁', isLeader: false, contribution: 200 },
  { id: 3, name: 'VocalPro', avatar: '🎤', isLeader: false, contribution: 150 },
];
