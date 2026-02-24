import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/tasks", async (req, res) => {
  const { completed } = req.query;
  const where: any = {};
  if (completed === "true") where.completed = true;
  if (completed === "false") where.completed = false;
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' })
  }
  if (description && typeof description !== 'string') {
    return res.status(400).json({ error: 'description must be a string' })
  }
  let due: Date | null = null
  if (dueDate) {
    const d = new Date(dueDate)
    if (Number.isNaN(d.getTime())) return res.status(400).json({ error: 'dueDate must be a valid date' })
    due = d
  }
  const task = await prisma.task.create({ data: { title: title.trim(), description, dueDate: due } })
  // Return 201 with Location header pointing to the new resource
  res.status(201).location(`/tasks/${task.id}`).json(task);
});

app.get("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return res.status(404).json({ error: "not found" });
  res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, dueDate, completed } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
      },
    });
    res.json(task);
  } catch (e) {
    res.status(404).json({ error: "not found" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ error: "not found" });
  }
});

export default app;
