import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "secret-key-change-in-production";
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    res.status(400).json({ error: "email already exists" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "invalid password" });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

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

// --- US-9: Figma MCP Integration ---

// Validates a Figma file key (alphanumeric, hyphens, underscores)
function isValidFigmaFileKey(key: string): boolean {
  return typeof key === "string" && /^[a-zA-Z0-9_-]+$/.test(key);
}

app.get("/api/figma/:fileKey", async (req, res) => {
  const { fileKey } = req.params;

  // 400 — invalid fileKey
  if (!isValidFigmaFileKey(fileKey)) {
    return res.status(400).json({ error: "fileKey inválido ou ausente" });
  }

  const figmaToken = process.env.FIGMA_TOKEN;

  // 401 — MCP Figma not authenticated
  if (!figmaToken) {
    return res.status(401).json({ error: "MCP Figma não autenticado" });
  }

  console.debug(`[figma] Fetching file nodes for fileKey: ${fileKey}`);

  try {
    // Fetch file nodes via Figma REST API (mcp__figma__get_file equivalent)
    const fileRes = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: { "X-Figma-Token": figmaToken },
    });

    console.debug(`[figma] get_file response status: ${fileRes.status}`);

    if (fileRes.status === 403 || fileRes.status === 401) {
      return res.status(401).json({ error: "MCP Figma não autenticado" });
    }
    if (fileRes.status === 404) {
      return res.status(404).json({ error: "Arquivo Figma não encontrado" });
    }
    if (!fileRes.ok) {
      throw new Error(`Figma API error: ${fileRes.status}`);
    }

    const fileData: any = await fileRes.json();
    const documentNodeId: string = fileData.document?.id ?? "0:1";

    console.debug(`[figma] Fetching preview image for node: ${documentNodeId}`);

    // Fetch preview image URL via Figma REST API (mcp__figma__get_image equivalent)
    const imageRes = await fetch(
      `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(documentNodeId)}&format=png`,
      { headers: { "X-Figma-Token": figmaToken } }
    );

    console.debug(`[figma] get_image response status: ${imageRes.status}`);

    let previewUrl = "";
    if (imageRes.ok) {
      const imageData: any = await imageRes.json();
      previewUrl = imageData?.images?.[documentNodeId] ?? "";
      console.debug(`[figma] Preview URL: ${previewUrl}`);
    } else {
      console.debug(`[figma] Could not fetch preview image, status: ${imageRes.status}`);
    }

    return res.json({
      previewUrl,
      nodes: {
        document: fileData.document ?? null,
        components: fileData.components ?? {},
        styles: fileData.styles ?? {},
      },
    });
  } catch (e: any) {
    console.error("[figma] Unexpected error:", e?.message ?? e);
    return res.status(500).json({ error: "Erro interno ao consultar o Figma" });
  }
});

export default app;
