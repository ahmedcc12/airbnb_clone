const app = require("../app");
//const request = supertest(app);
const request = require('supertest');
const mongoose = require('mongoose');

describe('Tests des endpoints de l\'API', () => {
  
    let server;

beforeAll(async () => {
  server = app.listen(3000);
  await new Promise(resolve => server.on('listening', resolve));
});

afterAll(async () => {
  if (server) {
    server.close();
  }
  });

  it('devrait renvoyer une réponse 200 pour /api/test', async () => {
    const response = await request(app).get('/api/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual('test ok');
  });

  it('devrait renvoyer une réponse 404 pour une route inexistante', async () => {
    const response = await request(app).get('/route/inexistante');
    expect(response.status).toBe(404);
  });

  it('devrait renvoyer une réponse 200 pour /register', async () => {
    const response = await request(app)
      .post('/register')
      .send({ name: 'John Doe', email: 'johnDoe@john.com', password: 'test' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
  });

  it('devrait renvoyer une réponse 200 pour /login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@test.com', password: 'test' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual('ok');
  });

  it('devrait renvoyer une réponse 200 pour /profile si l\'utilisateur est connecté', async () => {
    // Enregistrez un nouvel utilisateur pour effectuer le test
    const registerResponse = await request(app)
      .post('/register')
      .send({ name: 'John Doe', email: 'johnDoe@john.com', password: 'test' });

    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'johnDoe@john.com', password: 'test' });

    const token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

    expect(token).toBeTruthy();

    const response = await request(app)
      .get('/profile')
      .set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('name', 'John Doe');
    expect(response.body).toHaveProperty('email', 'johnDoe@john.com');
  });

  it('devrait renvoyer une réponse 422 pour /login avec des informations incorrectes', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@test.com', password: 'motdepasseincorrect' });
    expect(response.status).toBe(422);
    expect(response.body).toEqual('pass not ok');
  });
});
afterAll(async () => {
  await mongoose.disconnect();
});