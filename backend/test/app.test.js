"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
describe('tasks API', () => {
    it('GET /health returns ok', async () => {
        const res = await (0, supertest_1.default)(index_1.default).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });
    it('POST /tasks validates input and creates a task', async () => {
        const resBad = await (0, supertest_1.default)(index_1.default).post('/tasks').send({});
        expect(resBad.status).toBe(400);
        const res = await (0, supertest_1.default)(index_1.default).post('/tasks').send({ title: 'Test task' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test task');
    });
});
describe('auth API', () => {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    it('POST /auth/register should create a user and return a token', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/auth/register')
            .send({ email: testEmail, password: testPassword, name: 'Test User' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toMatchObject({ email: testEmail, name: 'Test User' });
    });
    it('POST /auth/register should return 400 when email or password is missing', async () => {
        const res = await (0, supertest_1.default)(index_1.default).post('/auth/register').send({ email: testEmail });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'email and password are required');
    });
    it('POST /auth/register should return 400 when email already exists', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/auth/register')
            .send({ email: testEmail, password: testPassword });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'email already exists');
    });
    it('POST /auth/login should return 400 when email or password is missing', async () => {
        const res = await (0, supertest_1.default)(index_1.default).post('/auth/login').send({ email: testEmail });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'email and password are required');
    });
    it('POST /auth/login should return 401 with "user not found" for unknown email', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/auth/login')
            .send({ email: 'nobody@example.com', password: 'whatever' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'user not found');
    });
    it('POST /auth/login should return 401 with "invalid password" for wrong password', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/auth/login')
            .send({ email: testEmail, password: 'wrongpassword' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'invalid password');
    });
    it('POST /auth/login should return 200 with token on valid credentials', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/auth/login')
            .send({ email: testEmail, password: testPassword });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toMatchObject({ email: testEmail });
    });
});
