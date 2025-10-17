import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('API (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should login with valid credentials', () => {
      return request(server)
        .post('/api/auth/login')
        .send({
          email: 'admin@rotasystem.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.token).toBeDefined();
          expect(res.body.data.user.email).toBe('admin@rotasystem.com');
        });
    });

    it('should reject login with invalid credentials', () => {
      return request(server)
        .post('/api/auth/login')
        .send({
          email: 'admin@rotasystem.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should reject access to protected endpoints without token', () => {
      return request(server)
        .get('/api/users')
        .expect(401);
    });

    it('should reject access to protected endpoints with invalid token', () => {
      return request(server)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Role-based Access Control', () => {
    let adminToken: string;
    let staffToken: string;

    beforeAll(async () => {
      // Login as admin
      const adminLogin = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'admin@rotasystem.com',
          password: 'password123',
        });
      
      adminToken = adminLogin.body.data.token;

      // Login as staff
      const staffLogin = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@rotasystem.com',
          password: 'password123',
        });
      
      staffToken = staffLogin.body.data.token;
    });

    it('should allow admin to access users endpoint', () => {
      return request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should reject staff from accessing users endpoint', () => {
      return request(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(403);
    });

    it('should allow staff to access their own profile', () => {
      return request(server)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(200);
    });
  });
});