import axios from 'axios';
import jwt from 'jsonwebtoken';

const hospitalServiceUrl = 'http://localhost:8082';
const userServiceUrl = 'http://localhost:5001';
const jwtSecret = 'your-secure-jwt-secret-32-chars'; // Match .env JWT_SECRET
const serviceKey = 'a7b9c2d8e4f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4'; // Match .env SERVICE_KEY

async function runIntegrationTest() {
  try {
    // Generate SERVICE_KEY JWT
    const token = jwt.sign({ key: serviceKey }, jwtSecret, { expiresIn: '1h' });

    // Create a hospital
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

    console.log('Creating hospital...');
    const hospitalResponse = await axios.post(`${hospitalServiceUrl}/api/hospitals`, hospitalData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const hospitalId = hospitalResponse.data.data.externalId;
    console.log(`Hospital created with externalId: ${hospitalId}`);

    // Register a doctor with hospitalId
    const userData = {
      name: 'Dr. Priya',
      email: `priya${Date.now()}@example.com`, // Unique email
      phone: '9876543210',
      password: 'Secure@123',
      role: 'doctor',
      hospitalId,
    };

    console.log('Registering doctor...');
    const userResponse = await axios.post(`${userServiceUrl}/api/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Doctor registered:', userResponse.data);

    console.log('Integration test successful!');
  } catch (err) {
    console.error('Integration test failed:', err.response?.data || err.message);
  }
}

runIntegrationTest();