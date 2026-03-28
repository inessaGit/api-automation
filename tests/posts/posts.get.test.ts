import axios from 'axios';
import { postsClient } from '../../src/clients/postsClient';
import { postSchema, postArraySchema } from '../../src/schemas/post.schema';

describe('GET /posts', () => {
  it('getAllPosts200 — returns HTTP 200', async () => {
    const response = await postsClient.getAll();
    expect(response.status).toBe(200);
  });

  it('getAllPostsLength100 — returns exactly 100 posts', async () => {
    const response = await postsClient.getAll();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toHaveLength(100);
  });

  it('getSinglePost200Schema — GET /posts/1 returns 200 and valid schema', async () => {
    const response = await postsClient.getById(1);
    expect(response.status).toBe(200);
    const result = postSchema.safeParse(response.data);
    expect(result.success).toBe(true);
  });

  it('getSinglePostFields — GET /posts/1 contains expected field values', async () => {
    const response = await postsClient.getById(1);
    const post = response.data;

    expect(post.id).toBe(1);
    expect(typeof post.userId).toBe('number');
    expect(post.userId).toBeGreaterThan(0);
    expect(typeof post.title).toBe('string');
    expect(post.title.length).toBeGreaterThan(0);
    expect(typeof post.body).toBe('string');
    expect(post.body.length).toBeGreaterThan(0);

    const allPostsResult = postArraySchema.safeParse(
      (await postsClient.getAll()).data
    );
    expect(allPostsResult.success).toBe(true);
  });

  it('getNonExistent404 — GET /posts/999 returns 404', async () => {
    try {
      await postsClient.getById(999);
      fail('Expected request to throw a 404 error');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(404);
      } else {
        throw error;
      }
    }
  });
});
