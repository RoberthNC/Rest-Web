import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos";

export class TodoController {
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    return res.status(200).json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(+id))
      return res.status(400).json({ error: `ID argument is not a number` });
    const todo = await prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    return res.status(200).json(todo);
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });
    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });
    return res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.update({ ...req.body, id });
    if (error) return res.status(400).json({ error });
    const todo = await prisma.todo.findFirst({
      where: {
        id: id,
      },
    });
    if (!todo)
      return res
        .status(404)
        .json({ error: `Todo with ID ${id} was not found` });
    const updatedTodo = await prisma.todo.update({
      where: {
        id: id,
      },
      data: updateTodoDto!.values,
    });
    return res.status(200).json(updatedTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: "TODO ID is not a valid argument" });
    const deletedTodo = await prisma.todo.delete({
      where: {
        id: id,
      },
    });
    if (!deletedTodo)
      return res.status(404).json({ error: "Todo could not be deleted" });
    return res.status(200).json(deletedTodo);
  };
}
