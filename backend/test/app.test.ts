import request from 'supertest'
import app from '../src/index'

describe('tasks API', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
  })

  it('POST /tasks validates input and creates a task', async () => {
    const resBad = await request(app).post('/tasks').send({})
    expect(resBad.status).toBe(400)

    const res = await request(app).post('/tasks').send({ title: 'Test task' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe('Test task')
  })
})
