const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGoal = async (req, res) => {
  const { title, targetAmount, deadline } = req.body;
  try {
    const goal = await Goal.create({
      user: req.user._id,
      title,
      targetAmount,
      deadline
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFundsToGoal = async (req, res) => {
  const { amount } = req.body;
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.currentAmount += Number(amount);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
      goal.currentAmount = goal.targetAmount;
    }
    
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  addFundsToGoal,
  deleteGoal
};
