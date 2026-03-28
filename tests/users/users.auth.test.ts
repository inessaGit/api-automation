import axios from 'axios';
import { usersClient } from '../../src/clients/usersClient';
import {
  loginResponseSchema,
  registerResponseSchema,
  authErrorSchema,
} from '../../src/schemas/user.schema';
import {
  VALID_REQRES_CREDENTIALS,
  VALID_REQRES_REGISTER_CREDENTIALS,
  UNDEFINED_USER_CREDENTIALS,
} from '../../src/utils/dataFactory';

describe('POST /login', () => {
  it('login success token — valid credentials return 200 with a token', async () => {
    const { email, password } = VALID_REQRES_CREDENTIALS;
    const response = await usersClient.login(email, password);

    expect(response.status).toBe(200);

    const result = loginResponseSchema.safeParse(response.data);
    expect(result.success).toBe(true);

    expect(typeof response.data.token).toBe('string');
    expect(response.data.token.length).toBeGreaterThan(0);
  });

  it('login missing password 400 — omitting password returns 400 with error', async () => {
    try {
      await usersClient.login(VALID_REQRES_CREDENTIALS.email, '');
      fail('Expected request to throw a 400 error');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(400);

        const result = authErrorSchema.safeParse(error.response?.data);
        expect(result.success).toBe(true);
        expect(error.response?.data.error).toBeTruthy();
      } else {
        throw error;
      }
    }
  });
});

describe('POST /register', () => {
  it('register success — valid credentials return 200 with id and token', async () => {
    const { email, password } = VALID_REQRES_REGISTER_CREDENTIALS;
    const response = await usersClient.register(email, password);

    expect(response.status).toBe(200);

    const result = registerResponseSchema.safeParse(response.data);
    expect(result.success).toBe(true);

    expect(typeof response.data.id).toBe('number');
    expect(response.data.id).toBeGreaterThan(0);
    expect(typeof response.data.token).toBe('string');
    expect(response.data.token.length).toBeGreaterThan(0);
  });

  it('register undefined user 400 — unknown email returns 400 with error', async () => {
    try {
      await usersClient.register(
        UNDEFINED_USER_CREDENTIALS.email,
        UNDEFINED_USER_CREDENTIALS.password
      );
      fail('Expected request to throw a 400 error');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(400);

        const result = authErrorSchema.safeParse(error.response?.data);
        expect(result.success).toBe(true);
        expect(error.response?.data.error).toBeTruthy();
      } else {
        throw error;
      }
    }
  });
});
