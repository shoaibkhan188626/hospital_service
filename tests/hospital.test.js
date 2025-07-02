import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import Hospital from '../models/hospital.js';

const request = supertest(app);
let mongoServer;

const serviceKey = 'a7b9c2d8e4f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4';
const jwtSecret = 'your-secure-jwt-secret-32-chars';
const token = jwt.sign({ key: serviceKey }, jwtSecret, { expiresIn: '1h' });

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Hospital.deleteMany({});
});

describe('Hospital Service API', () => {
  describe('POST /api/hospitals', () => {
    it('should create a hospital with valid data', async () => {
      const hospitalData = {
        name: 'Apollo Hospital',
        address: {
          street: '123 MG Road',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
        },
        location: {
          coordinates: [77.2090, 28.6139],
        },
        contact: {
          phone: '9876543210',
          email: 'contact@apollo.com',
        },
      };

      const res = await request
        .post('/api/hospitals')
        .set('Authorization', `Bearer ${token}`)
        .send(hospitalData);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('externalId');
      expect(res.body.data.name).toBe('Apollo Hospital');
    });

    it('should fail with invalid data', async () => {
      const hospitalData = {
        name: '', // Invalid: empty name
      };

      const res = await request
        .post('/api/hospitals')
        .set('Authorization', `Bearer ${token}`)
        .send(hospitalData);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Hospital name is required');
    });
  });

  describe('GET /api/hospitals/:id', () => {
    it('should get a hospital by externalId', async () => {
      const hospital = new Hospital({
        name: 'Apollo Hospital',
        address: { street: '123 MG Road', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      });
      await hospital.save();

      const res = await request
        .get(`/api/hospitals/${hospital.externalId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('Apollo Hospital');
    });

    it('should return 404 for non-existent hospital', async () => {
      const res = await request
        .get('/api/hospitals/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Hospital not found');
    });
  });

  describe('PATCH /api/hospitals/:id', () => {
    it('should update a hospital', async () => {
      const hospital = new Hospital({
        name: 'Apollo Hospital',
        address: { street: '123 MG Road', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      });
      await hospital.save();

      const updateData = { name: 'Fortis Hospital' };

      const res = await request
        .patch(`/api/hospitals/${hospital.externalId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('Fortis Hospital');
    });

    it('should fail with no update fields', async () => {
      const hospital = new Hospital({ name: 'Apollo Hospital' });
      await hospital.save();

      const res = await request
        .patch(`/api/hospitals/${hospital.externalId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('At least one field must be provided for update');
    });
  });

  describe('DELETE /api/hospitals/:id', () => {
    it('should soft-delete a hospital', async () => {
      const hospital = new Hospital({ name: 'Apollo Hospital' });
      await hospital.save();

      const res = await request
        .delete(`/api/hospitals/${hospital.externalId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);

      const deletedHospital = await Hospital.findOne({ externalId: hospital.externalId });
      expect(deletedHospital.deleted).toBe(true);
    });
  });
});