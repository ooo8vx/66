import express from 'express';
import { Project } from '../models/Project.js';

const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { userId, featured, limit } = req.query;
    let projects;
    
    if (featured === 'true') {
      projects = await Project.findFeatured(parseInt(limit) || 6);
    } else if (userId) {
      projects = await Project.findByUserId(userId, true);
    } else {
      projects = await Project.findAll(parseInt(limit) || 10);
    }
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const projectData = req.body;
    const project = await Project.create(projectData);
    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;