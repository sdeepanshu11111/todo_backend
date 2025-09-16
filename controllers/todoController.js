import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createTodo = async (req, res) => {
  const todo = await Todo.create({
    user: req.user.id,
    title: req.body.title,
    priority: req.body.priority,
    category: req.body.category,
  });

  res.status(201).json(todo);
};

export const updateTodo = async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );

  return res.json(todo);
};

export const deleteTodo = async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: "Todo deleted" });
};
