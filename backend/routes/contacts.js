import express from 'express';
import { Contact } from '../models/Contact.js';

const router = express.Router();

// GET /api/contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// POST /api/contacts
router.post('/', async (req, res) => {
  try {
    const contactData = req.body;
    const contact = await Contact.create(contactData);
    res.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

export default router;