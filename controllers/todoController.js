import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.userID });
    res.json(todos);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createTodo = async (req, res) => {
  const todo = await Todo.create({
    user: req.user.userID,
    title: req.body.title,
  });

  res.status(201).json(todo);
};

export const updateTodo = async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userID },
    req.body,
    { new: true }
  );

  return res.json(todo);
};

export const deleteTodo = async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.userID });
  res.json({ message: "Todo deleted" });
};
