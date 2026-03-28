import { postsClient } from '../../src/clients/postsClient';
import { postSchema } from '../../src/schemas/post.schema';
import { generateUpdatedPostPayload } from '../../src/utils/dataFactory';

describe('PUT /posts/:id', () => {
  const TARGET_POST_ID = 1;

  it('full update returns 200 — PUT /posts/1 responds with HTTP 200', async () => {
    const payload = generateUpdatedPostPayload();
    const response = await postsClient.update(TARGET_POST_ID, payload);
    expect(response.status).toBe(200);
  });

  it('fields updated — response body reflects the PUT payload', async () => {
    const payload = generateUpdatedPostPayload();
    const response = await postsClient.update(TARGET_POST_ID, payload);
    const data = response.data;

    expect(data.title).toBe(payload.title);
    expect(data.body).toBe(payload.body);
    expect(data.userId).toBe(payload.userId);
    expect(data.id).toBe(TARGET_POST_ID);

    const result = postSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
