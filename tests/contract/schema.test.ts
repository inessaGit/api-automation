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
