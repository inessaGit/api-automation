import { postsClient } from '../../src/clients/postsClient';
import { postSchema } from '../../src/schemas/post.schema';
import { generatePostPayload } from '../../src/utils/dataFactory';

describe('POST /posts', () => {
  it('create returns 201 — POST /posts responds with HTTP 201', async () => {
    const payload = generatePostPayload();
    const response = await postsClient.create(payload);
    expect(response.status).toBe(201);
  });

  it('body echoed — response body contains the submitted payload fields', async () => {
    const payload = generatePostPayload();
    const response = await postsClient.create(payload);
    const data = response.data;

    expect(data.title).toBe(payload.title);
    expect(data.body).toBe(payload.body);
    expect(data.userId).toBe(payload.userId);
    expect(response.data).toMatchObject({
      title: payload.title,
      body: payload.body,
      userId: payload.userId,
    });
  });

  it('id is number — created post response includes a numeric id', async () => {
    const payload = generatePostPayload();
    const response = await postsClient.create(payload);

    expect(typeof response.data.id).toBe('number');
    expect(response.data.id).toBeGreaterThan(0);

    const result = postSchema.safeParse(response.data);
    expect(result.success).toBe(true);
  });
});
