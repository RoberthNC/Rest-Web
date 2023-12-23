import { Request, Response } from "express";

interface Todo {
  id: number;
  text: string;
  completedAt: Date | null;
}

let todos: Todo[] = [
  { id: 1, text: "Buy milk", completedAt: new Date() },
  { id: 2, text: "Buy bread", completedAt: null },
  { id: 3, text: "Buy butter", completedAt: new Date() },
];

export class TodoController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(+id))
      return res.status(400).json({ error: `ID argument is not a number` });
    const todo = todos.find((todo) => todo.id === +id);
    todo
      ? res.json(todo)
      : res.status(404).json({ error: `Todo with id ${id} was not found` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ error: "Text property is required" });
    const newTodo = {
      id: todos.length + 1,
      text: text,
      completedAt: null,
    };
    todos.push(newTodo);
    return res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });
    const todo = todos.find((todo) => todo.id === id);
    if (!todo)
      return res.status(404).json(`Todo with ID ${id} does not exists`);
    const { text, completedAt } = req.body;
    todo.text = text || todo.text;
    completedAt === "null"
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));
    res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: "TODO ID is not a valid argument" });
    const todoDelete = todos.find((currentTodo) => currentTodo.id === id);
    if (!todoDelete)
      return res
        .status(404)
        .json({ error: `TODO with ID ${id} does not exists` });
    todos = todos.filter((currentTodo) => currentTodo.id !== id);
    return res.json(todoDelete);
  };
}
