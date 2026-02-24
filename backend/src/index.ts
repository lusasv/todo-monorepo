import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.get('/tasks', async (req, res) => {
  const { completed } = req.query
  const where: any = {}
  if (completed === 'true') where.completed = true
  if (completed === 'false') where.completed = false
  const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json(tasks)
})

app.post('/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title is required' })
  const task = await prisma.task.create({ data: { title, description, dueDate: dueDate ? new Date(dueDate) : null } })
  res.status(201).json(task)
})

app.get('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id)
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) return res.status(404).json({ error: 'not found' })
  res.json(task)
})

app.put('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { title, description, dueDate, completed } = req.body
  try {
    const task = await prisma.task.update({ where: { id }, data: { title, description, dueDate: dueDate ? new Date(dueDate) : null, completed } })
    res.json(task)
  } catch (e) {
    res.status(404).json({ error: 'not found' })
  }
})

app.delete('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    await prisma.task.delete({ where: { id } })
    res.status(204).send()
  } catch (e) {
    res.status(404).json({ error: 'not found' })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server listening on ${port}`))
