import express from 'express'; 
import mongoose from 'mongoose'; 
import cors from 'cors';  
 
 
const app = express(); 
 
// Middleware 
app.use(cors()); 
app.use(express.json()); 
 
// Connect to MongoDB 
 
mongoose.connect('mongodb://localhost:27017/mydatabase') 
  .then(() => console.log('Connected to MongoDB')) 
  .catch((err) => console.error('Failed to connect to MongoDB', err)); 
 
 
// Define the Task schema and model 
const taskSchema = new mongoose.Schema({ 
  title: { type: String, required: true }, 
  status: { type: Boolean, default: false }, 
}); 
 
const Task = mongoose.model('Task', taskSchema); 
 
// API routes 
 
// Get all tasks 
app.get('/tasks', async (req, res) => { 
  const tasks = await Task.find(); 
  res.json(tasks); 
}); 
 
// Add a new task 
app.post('/tasks', async (req, res) => { 
  const { title } = req.body; 
  const newTask = new Task({ title }); 
  await newTask.save(); 
  res.json(newTask); 
}); 
 
// Update a task 
app.put('/tasks/:id', async (req, res) => { 
  const { id } = req.params; 
  const { title, status } = req.body; 
  const updatedTask = await Task.findByIdAndUpdate(id, { title, status }, { new: true }); 
  res.json(updatedTask); 
}); 
 
// Delete a task 
app.delete('/tasks/:id', async (req, res) => { 
  const { id } = req.params; 
  await Task.findByIdAndDelete(id); 
  res.json({ message: 'Task deleted' }); 
}); 
 
// Start the server 
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));