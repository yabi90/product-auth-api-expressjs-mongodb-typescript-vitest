import supertest from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../src/app';
import mongoose from 'mongoose';
import { User } from '../src/models/userModel';

const request = supertest(app);
const DB_URI = process.env.DB_TEST_URI

if (!DB_URI) {
    console.error('Database URI is not defined in the environment variables.');
    process.exit(1); // Exit the process if DB_URI is not set
  }

describe('User Authentication and Product API Endpoints', () => {
    // Shared setup for connecting to MongoDB before all tests
    beforeAll(async () => {
      if (mongoose.connection.readyState === 0) { // Check if we're not already connected
        try {
          await mongoose.connect(DB_URI);
          console.log('Connected to MongoDB');
        } catch (error) {
          console.error('Error connecting to MongoDB:', error);
        }
      } else {
        console.log('Already connected to MongoDB');
      }
    });
  
    // Clean up after all tests
    afterAll(async () => {
      try {

        // Drop the databse to reset the state before the next run 
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
      } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
      }
    });
  
    describe('User Authentication', () => {
        it('should successfully register a new user', async () => {
          const user = {
            email: 'email@example.com',
            password: '12345678',
          };
      
          const res = await request.post('/api/auth/register').send(user);
          expect(res.status).toBe(201); // Expect HTTP status 201 for successful registration
          expect(res.body.token).toBeTruthy(); // Check if a token is returned after registration
        });
      
        it('should successfully log in an existing user', async () => {
          const user = {
            email: 'email@example.com',
            password: '12345678',
          };
      
          const res = await request.post('/api/auth/login').send(user);
          expect(res.status).toBe(200); // Expect HTTP status 200 for successful login
          expect(res.body.token).toBeTruthy(); // Check if a token is returned after login
        });
      });
      
  
    describe('Product API Endpoints', () => {
        let userToken;

        beforeAll(async () => {
            // Register a user and get the token for authentication
            const user = {
            email: 'email2@example.com',
            password: '12345678',
            };

            const res = await request.post('/api/auth/register').send(user);
            userToken = res.body.token;
        });
      
      it('should create a new product', async () => {
        const product = {
          name: 'Laptop',
          quantity: 10,
          price: 999.99,
        };
  
        const response = await request.post('/api/products')
          .set("Authorization", `Bearer ${userToken}`)
          .send(product);
  
        expect(response.status).toBe(201); // Expect HTTP status 200
        expect(response.body.name).toBe(product.name); // Check if the response contains correct product name
        expect(response.body.quantity).toBe(product.quantity); // Check if quantity is correct
      });

      it('should get all products', async () => {
        const response = await request.get('/api/products')
          .set("Authorization", `Bearer ${userToken}`);
  
        expect(response.status).toBe(200); // Expect HTTP status 200
        expect(Array.isArray(response.body)).toBe(true); // Check if the response is an array
      });

      it('should get product by name', async () => {
        const product = {
          name: 'Smartphone',
          quantity: 20,
          price: 699.99,
        };
  
        // Create the product first
        const createResponse = await request.post('/api/products')
          .set("Authorization", `Bearer ${userToken}`)
          .send(product);
  
        const response = await request.get(`/api/products/${product.name}`)
          .set("Authorization", `Bearer ${userToken}`);
  
        expect(response.status).toBe(200); // Expect HTTP status 200
        expect(response.body.name).toBe(product.name); // Check if the correct product is returned
        expect(response.body.quantity).toBe(product.quantity); // Check if quantity is correct
      });

      it('should return 404 for non-existent product', async () => {
        const response = await request.get('/api/products/nonexistentproduct')
          .set("Authorization", `Bearer ${userToken}`);
  
        expect(response.status).toBe(404); // Expect HTTP status 404
        expect(response.body.message).toBe('Product not found');
      });

      it('should not allow a non-admin user to update a product (403 Forbidden)', async () => {
        const product = {
          name: 'Headphones',
          quantity: 15,
          price: 199.99,
        };
      
        // Create product first
        const createResponse = await request.post('/api/products')
          .set("Authorization", `Bearer ${userToken}`)
          .send(product);
      
        const updatedProduct = {
          quantity: 30,
          price: 249.99,
        };
      
        // Try to update with non-admin user (should fail)
        const updateResponse = await request.put(`/api/products/${product.name}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send(updatedProduct);
      
        expect(updateResponse.status).toBe(403); // Expect HTTP status 403 (Forbidden)
        expect(updateResponse.body.message).toBe('Forbidden. You do not have access.'); // Check the error message
      });
        
      it('should allow an admin user to update a product (200 OK)', async () => {
        const product = {
          name: 'Headphones',
          quantity: 15,
          price: 199.99,
        };
      
        // Create product first
        const createResponse = await request.post('/api/products')
          .set("Authorization", `Bearer ${userToken}`)
          .send(product);
      
        // Create and login admin user
        const adminUser = {
          email: 'admin@example.com',
          password: 'admin12345',
        };
        const adminRes= await request.post('/api/auth/register').send(adminUser);
        const user = await User.findOneAndUpdate({email: adminUser.email}, {role: "admin"}, { new: true });
        const adminLoginResponse = await request.post('/api/auth/login').send(adminUser);
        const adminToken = adminLoginResponse.body.token;
      
        const updatedProduct = {
          quantity: 30,
          price: 249.99,
        };
      
        // Now try to update the product with admin rights
        const adminUpdateResponse = await request.put(`/api/products/${product.name}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send(updatedProduct);
      
        expect(adminUpdateResponse.status).toBe(200); // Expect HTTP status 200
        expect(adminUpdateResponse.body.quantity).toBe(updatedProduct.quantity); // Check updated quantity
        expect(adminUpdateResponse.body.price).toBe(updatedProduct.price); // Check updated price
      });
      
      it('should not allow a non-admin user to delete a product', async () => {
        const product = {
          name: 'Keyboard',
          quantity: 25,
          price: 59.99,
        };
      
        // Create product first
        const createResponse = await request.post('/api/products')
          .set("Authorization", `Bearer ${userToken}`)
          .send(product);
      
        // Try to delete with non-admin user (should fail)
        const deleteResponse = await request.delete(`/api/products/${product.name}`)
          .set("Authorization", `Bearer ${userToken}`);
      
        expect(deleteResponse.status).toBe(403); // Expect HTTP status 403 (Forbidden)
      });
      
      it('should allow an admin user to delete a product', async () => {
        const product = {
          name: 'Keyboard',
          quantity: 25,
          price: 59.99,
        };
      
        // Create a new admin user
        const adminUser = {
          email: 'admin@example.com',
          password: 'admin12345',
        };
        const adminRes = await request.post('/api/auth/register').send(adminUser);
        const user = await User.findOneAndUpdate({ email: adminUser.email }, { role: "admin" }, { new: true });
        const adminLoginResponse = await request.post('/api/auth/login').send(adminUser);
        const adminToken = adminLoginResponse.body.token;
      
        // Create product first
        const createResponse = await request.post('/api/products')
          .set("Authorization", `Bearer ${adminToken}`)
          .send(product);
      
        // Now try to delete the product with admin rights
        const adminDeleteResponse = await request.delete(`/api/products/${product.name}`)
          .set("Authorization", `Bearer ${adminToken}`);
      
        expect(adminDeleteResponse.status).toBe(200); // Expect HTTP status 200
        expect(adminDeleteResponse.body.name).toBe(product.name); // Check if the deleted product name matches
      });
    
    });
});

