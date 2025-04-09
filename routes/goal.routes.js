const express = require('express');
const GoalController = require('../controllers/goal.controller.js');

const router = express.Router();

// GET /api/v1/goals - get all goals for a user
router.get('/', GoalController.getAllGoals);

// GET /api/v1/goals/:id - get goal by ID
router.get('/:id', GoalController.getGoalById);

// POST /api/v1/goals - create a new goal
router.post('/', GoalController.createGoal);

// PUT /api/v1/goals/:id - update a goal
router.put('/:id', GoalController.updateGoal);

// DELETE /api/v1/goals/:id - delete a goal
router.delete('/:id', GoalController.deleteGoal);

module.exports = router;