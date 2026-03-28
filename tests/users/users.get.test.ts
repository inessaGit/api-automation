import { usersClient } from '../../src/clients/usersClient';
import {
  userListResponseSchema,
  singleUserResponseSchema,
} from '../../src/schemas/user.schema';

describe('GET /users', () => {
  it('getAll — returns HTTP 200 and valid user list response', async () => {
    const response = await usersClient.getAll();
    expect(response.status).toBe(200);

    const result = userListResponseSchema.safeParse(response.data);
    expect(result.success).toBe(true);

    const data = response.data;
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    expect(typeof data.total).toBe('number');
    expect(data.total).toBeGreaterThan(0);
  });

  it('getPage2 — page 2 returns different users than page 1', async () => {
    const [page1Response, page2Response] = await Promise.all([
      usersClient.getAll(1),
      usersClient.getAll(2),
    ]);

    expect(page1Response.status).toBe(200);
    expect(page2Response.status).toBe(200);

    expect(page1Response.data.page).toBe(1);
    expect(page2Response.data.page).toBe(2);

    const page1Ids = page1Response.data.data.map((u) => u.id);
    const page2Ids = page2Response.data.data.map((u) => u.id);
    const overlap = page1Ids.filter((id) => page2Ids.includes(id));
    expect(overlap).toHaveLength(0);

    const page2Result = userListResponseSchema.safeParse(page2Response.data);
    expect(page2Result.success).toBe(true);
  });

  it('getSingle — GET /users/2 returns HTTP 200 and valid single user schema', async () => {
    const response = await usersClient.getById(2);
    expect(response.status).toBe(200);

    const result = singleUserResponseSchema.safeParse(response.data);
    expect(result.success).toBe(true);

    const user = response.data.data;
    expect(user.id).toBe(2);
    expect(typeof user.email).toBe('string');
    expect(user.email).toContain('@');
    expect(typeof user.first_name).toBe('string');
    expect(typeof user.last_name).toBe('string');
    expect(typeof user.avatar).toBe('string');
    expect(user.avatar).toMatch(/^https?:\/\//);
  });
});
