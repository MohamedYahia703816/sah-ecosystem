# SAH Referral System — The Community Growth Engine

## Overview

The SAH Referral System is a **blockchain-based community growth engine** built on the traditional "جمعية" (ROSCA - Rotating Savings and Credit Association) model — digitized, transparent, and powered by smart contracts.

Unlike manual referral systems that rely on trust and paper records, SAH's system runs entirely **on-chain** with full transparency, automated payments, and zero possibility of manipulation.

---

## How It Works

### The Core Principle: 3 & 7

The system is built around two numbers:

| Number | Meaning |
|--------|---------|
| **7** | Fixed table size — always exactly 7 members |
| **3** | Each member must bring 3 new members |

### The Cycle

```
[1] [2] [3] [4] [5] [6] [7]  ← 7 members in the table
```

When the **8th person** joins:
- Person **[1]** exits the table (and collects their earnings)
- Person **[8]** becomes the new **[7]**
- Everyone shifts up one position

```
[2] [3] [4] [5] [6] [7] [8]  ← The table moves forward
```

This cycle continues **infinitely** — tables never end, they just keep moving.

---

## The $3 Entry Fee

To join any table, a new member pays **$3**, distributed as:

| Recipient | Amount | Purpose |
|-----------|--------|---------|
| **The Inviter (7th)** | $1 | Reward for bringing new members |
| **The First (1st)** | $1 | Reward for completing the cycle |
| **SAH Treasury** | $1 | Supports the ecosystem & token price |

### Why $3?
- **Low barrier to entry** — anyone can join
- **Sustainable economics** — each dollar has a purpose
- **Ecosystem support** — 33% goes to the SAH treasury

---

## The Growth Tree

Each member who completes their position (becomes 7th) must bring **3 new members**. Each of those 3 becomes the 8th person in a **new table**.

```
                    [Original Member]
                   /        |        \
              Table 1    Table 2    Table 3     ← 3 new tables
             /   |   \   /   |   \   /   |   \
            8    8    8   8    8    8   8    8   8  ← 9 people
           /|\  /|\ ... (each brings 3 more)
          ... 27 ... 81 ... 243 ... 729 ... 2,187
```

At **Level 7** of the tree, a single original member has **2,187 people** below them — each contributing to the ecosystem.

---

## Smart Contract Automation

### What the Contract Does

| Function | Description |
|----------|-------------|
| **Table Management** | Tracks positions, handles rotations |
| **Payment Routing** | Automatically splits $3 to the right recipients |
| **Invitation Distribution** | Platform issues invitations automatically |
| **Treasury Collection** | Routes 33% to SAH treasury |
| **Cycle Completion** | Detects when a member reaches position 1 |

### What the Contract Does NOT Do

| Limitation | Why |
|------------|-----|
| **No manual invitations** | Members don't search for people — the platform distributes |
| **No off-chain payments** | Everything is on-chain, fully transparent |
| **No trust required** | Smart contracts enforce all rules |

---

## Platform-Issued Invitations

### The Problem with Manual Systems

In traditional referral systems:
- Members struggle to find 3 people
- Growth is slow and uneven
- Many tables stall and fail
- Members lose trust and leave

### The SAH Solution

**The platform issues invitations automatically:**

1. New users discover SAH through marketing
2. They pay $3 to enter the system
3. The smart contract places them in the next available table
4. The inviter (7th position) gets credited automatically
5. No searching, no selling, no stress

### Benefits

| Benefit | Description |
|---------|-------------|
| **Guaranteed placement** | Every paying member gets into a table |
| **Fair distribution** | Tables fill evenly across the tree |
| **No spam** | Members don't need to recruit on the streets |
| **Organic growth** | Marketing brings users, platform places them |

---

## Handling Failed Branches

### The Reality

Not every member will successfully bring 3 new members. Some branches will stall.

### The Impact

When a branch fails:
- Members **above** the stalled branch earn **less than maximum**
- The tree doesn't collapse — it just grows slower in that direction
- Other branches continue growing normally

### The Platform's Role

The platform mitigates this by:
1. **Centralized invitation distribution** — platform brings users, not members
2. **Smart placement algorithm** — fills tables where they're needed most
3. **Treasury buffer** — the 33% treasury can subsidize stalled branches

---

## Integration with SAH Token

### SAH Rewards

Every referral system participant receives **10,000 SAH** upon registration, in addition to the dollar-based earnings.

### Treasury Impact

The $1 per entry that goes to the SAH treasury:
- **Supports token price** through buybacks and burns
- **Funds liquidity pools** on PancakeSwap
- **Finances marketing** to bring more users
- **Develops new features** for the ecosystem

### The Flywheel

```
More users → More $3 entries → More treasury revenue
    ↓                              ↓
More SAH burns              Higher token value
    ↓                              ↓
More demand for SAH         More users join
```

---

## Launch Strategy

### Phase 1: Seed (1,000 Users)
- First 1,000 users register in the Mini App
- High SAH reward task triggers registrations
- 1,000 users enter the referral system
- Platform distributes them intelligently across initial tables

### Phase 2: Growth (10,000 Users)
- Organic marketing brings more users
- Referral earnings become visible and attractive
- Word-of-mouth accelerates growth
- Treasury grows, supporting token price

### Phase 3: Scale (100,000+ Users)
- System becomes self-sustaining
- Treasury funds major marketing campaigns
- Token gains real market value
- DAO governance takes over treasury management

---

## Transparency & Trust

### Everything On-Chain

| Data | Visibility |
|------|-----------|
| Table positions | Public on BscScan |
| Payment routing | Public on BscScan |
| Treasury balance | Public on BscScan |
| Burn transactions | Public on BscScan |

### No Hidden Fees

- **Entry:** Exactly $3 — no more, no less
- **Distribution:** Exactly $1/$1/$1 — always
- **Gas fees:** Negligible on BNB Chain ($0.001-$0.01)

---

## FAQ

**Q: Is this a pyramid scheme?**
A: No. Unlike pyramid schemes, there's no promise of guaranteed returns. Earnings depend on actual system participation. The platform distributes invitations — members don't recruit.

**Q: What happens if I can't find 3 people?**
A: You don't need to find anyone. The platform handles invitation distribution. You earn based on your position in the table.

**Q: Is my money safe?**
A: All transactions are handled by smart contracts on BNB Chain. No human can intercept or manipulate payments.

**Q: How much can I earn?**
A: Earnings vary based on your position and the growth of your branch. The maximum theoretical earning at position 1 is ~$2,187, but actual earnings depend on system growth.

**Q: Can I join multiple tables?**
A: Yes. After exiting as position 1, you can re-enter the system with a new $3 payment and start a new cycle.

---

## Links

- **Smart Contract:** [View on BscScan](https://testnet.bscscan.com/)
- **Telegram Bot:** [@Sah_Sonic_bot](https://t.me/Sah_Sonic_bot)
- **SAH Token:** [Tokenomics](tokenomics.md)
