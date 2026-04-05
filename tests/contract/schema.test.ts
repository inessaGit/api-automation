import { postsClient } from '../../src/clients/postsClient';
import { usersClient } from '../../src/clients/usersClient';
import {
  postSchema,
  postArraySchema,
} from '../../src/schemas/post.schema';
import {
  userListResponseSchema,
  singleUserResponseSchema,
  loginResponseSchema,
  registerResponseSchema,
  authErrorSchema,
  reqResUserDataSchema,
} from '../../src/schemas/user.schema';
import { VALID_REQRES_CREDENTIALS } from '../../src/utils/dataFactory';

describe('Contract — Post Schema Validation', () => {
  it('GET /posts/1 response fully satisfies postSchema', async () => {
    const response = await postsClient.getById(1);
    const result = postSchema.safeParse(response.data);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(typeof result.data.id).toBe('number');
      expect(typeof result.data.userId).toBe('number');
      expect(typeof result.data.title).toBe('string');
      expect(typeof result.data.body).toBe('string');
    }
  });

  it('GET /posts response is an array and each item satisfies postSchema', async () => {
    const response = await postsClient.getAll();
    const arrayResult = postArraySchema.safeParse(response.data);

    expect(arrayResult.success).toBe(true);

    if (arrayResult.success) {
      for (const post of arrayResult.data) {
        const itemResult = postSchema.safeParse(post);
        expect(itemResult.success).toBe(true);
      }
    }
  });

  it('POST /posts response matches postSchema (all required fields present with correct types)', async () => {
    const payload = { userId: 1, title: 'Contract Test Post', body: 'Validating schema contract' };
    const response = await postsClient.create(payload);
    const result = postSchema.safeParse(response.data);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBeDefined();
      expect(result.data.userId).toBe(payload.userId);
      expect(result.data.title).toBe(payload.title);
      expect(result.data.body).toBe(payload.body);
    }
  });
});

describe('Contract — User Schema Validation', () => {
  it('GET /users response satisfies userListResponseSchema', async () => {
    const response = await usersClient.getAll();
    const result = userListResponseSchema.safeParse(response.data);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.page).toBeGreaterThan(0);
      expect(result.data.per_page).toBeGreaterThan(0);
      expect(result.data.total).toBeGreaterThan(0);
      expect(result.data.total_pages).toBeGreaterThan(0);
      expect(result.data.data.length).toBeGreaterThan(0);
    }
  });

  it('GET /users/2 response satisfies singleUserResponseSchema', async () => {
    const response = await usersClient.getById(2);
    const result = singleUserResponseSchema.safeParse(response.data);

    expect(result.success).toBe(true);

    if (result.success) {
      const user = result.data.data;
      expect(user.id).toBe(2);
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(user.first_name.length).toBeGreaterThan(0);
      expect(user.last_name.length).toBeGreaterThan(0);
      expect(user.avatar).toMatch(/^https?:\/\//);
    }
  });

  it('POST /login response satisfies loginResponseSchema', async () => {
    const { email, password } = VALID_REQRES_CREDENTIALS;
    const response = await usersClient.login(email, password);
    const result = loginResponseSchema.safeParse(response.data);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.token.length).toBeGreaterThan(0);
    }
  });

  it('Zod schema rejects invalid post data — missing required fields', () => {
    const invalidPost = { id: 1, userId: 1 };
    const result = postSchema.safeParse(invalidPost);
    expect(result.success).toBe(false);

    if (!result.success) {
      const missingFields = result.error.issues.map((i) => i.path[0]);
      expect(missingFields).toContain('title');
      expect(missingFields).toContain('body');
    }
  });

  it('Zod schema rejects invalid user data — wrong types', () => {
    const invalidUser = {
      id: 'not-a-number',
      email: 'not-an-email',
      first_name: '',
      last_name: 42,
      avatar: 'not-a-url',
    };
    const result = singleUserResponseSchema.safeParse({ data: invalidUser, support: { url: 'https://example.com', text: 'support' } });
    expect(result.success).toBe(false);
  });
});

describe('Contract — Schema Tests (Extended)', () => {
  it('POST /register response satisfies registerResponseSchema', async () => {
    // ReqRes pre-defined registerable user
    const response = await usersClient.register('eve.holt@reqres.in', 'pistol');
    const result = registerResponseSchema.safeParse(response.data);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(typeof result.data.id).toBe('number');
      expect(result.data.id).toBeGreaterThan(0);
      expect(typeof result.data.token).toBe('string');
      expect(result.data.token.length).toBeGreaterThan(0);
    }
  });

  it('POST /login with missing password returns authErrorSchema shape', async () => {
    // Axios throws on 4xx — catch and validate the error response body
    try {
      await usersClient.login('peter@klaven.com', undefined as unknown as string);
      fail('Expected request to throw on 400');
    } catch (err: unknown) {
      const axios = await import('axios');
      if (axios.default.isAxiosError(err) && err.response) {
        const result = authErrorSchema.safeParse(err.response.data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.error).toBe('Missing password');
        }
      } else {
        throw err;
      }
    }
  });

  it('GET /users page 2 — every user in data array satisfies reqResUserDataSchema', async () => {
    const response = await usersClient.getAll(2);
    const listResult = userListResponseSchema.safeParse(response.data);

    expect(listResult.success).toBe(true);

    if (listResult.success) {
      expect(listResult.data.page).toBe(2);
      for (const user of listResult.data.data) {
        const userResult = reqResUserDataSchema.safeParse(user);
        expect(userResult.success).toBe(true);
        if (userResult.success) {
          expect(userResult.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
          expect(userResult.data.avatar).toMatch(/^https?:\/\//);
        }
      }
    }
  });

  it('postSchema rejects non-positive id — boundary: id must be integer > 0', () => {
    const withZeroId = { id: 0, userId: 1, title: 'Test', body: 'Body' };
    const withNegativeId = { id: -5, userId: 1, title: 'Test', body: 'Body' };
    const withFloatId = { id: 1.5, userId: 1, title: 'Test', body: 'Body' };

    expect(postSchema.safeParse(withZeroId).success).toBe(false);
    expect(postSchema.safeParse(withNegativeId).success).toBe(false);
    expect(postSchema.safeParse(withFloatId).success).toBe(false);
  });

  it('GET /posts — every post in the full collection has non-empty title and body', async () => {
    const response = await postsClient.getAll();
    const result = postArraySchema.safeParse(response.data);

    expect(result.success).toBe(true);

    if (result.success) {
      const emptyTitles = result.data.filter((p) => p.title.trim().length === 0);
      const emptyBodies = result.data.filter((p) => p.body.trim().length === 0);

      expect(emptyTitles).toHaveLength(0);
      expect(emptyBodies).toHaveLength(0);
    }
  });
});
