import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// GET /api/users/:discordId
router.get('/:discordId', async (req, res) => {
  try {
    const { discordId } = req.params;
    const user = await User.findByDiscordId(discordId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    
    if (!userData.discord_id || !userData.username) {
      return res.status(400).json({ 
        error: 'Missing required fields: discord_id and username are required' 
      });
    }
    
    const user = await User.createOrUpdate(userData);
    res.json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to create or update user' });
  }
});

// PUT /api/users/:discordId
router.put('/:discordId', async (req, res) => {
  try {
    const { discordId } = req.params;
    const updateData = req.body;
    
    const user = await User.updateByDiscordId(discordId, updateData);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;