import { postsClient } from '../../src/clients/postsClient';

describe('DELETE /posts/:id', () => {
  const TARGET_POST_ID = 1;

  it('delete returns 200 — DELETE /posts/1 responds with HTTP 200', async () => {
    const response = await postsClient.remove(TARGET_POST_ID);
    expect(response.status).toBe(200);
  });

  it('empty body — DELETE /posts/1 response body is an empty object', async () => {
    const response = await postsClient.remove(TARGET_POST_ID);
    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe('object');
    expect(Object.keys(response.data)).toHaveLength(0);
  });
});
