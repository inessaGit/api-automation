import { PostPayload } from '../clients/postsClient';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
  'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
  'et', 'dolore', 'magna', 'aliqua', 'enim', 'minim', 'veniam', 'quis',
  'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
];

const ADJECTIVES = [
  'Quick', 'Automated', 'Dynamic', 'Verified', 'Synthetic', 'Generated',
  'Sample', 'Test', 'Random', 'Unique',
];

const NOUNS = [
  'Post', 'Entry', 'Record', 'Article', 'Item', 'Update', 'Note', 'Log',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomWords(count: number): string {
  return Array.from({ length: count }, () => randomElement(LOREM_WORDS)).join(' ');
}

export function generatePostPayload(): PostPayload {
  const adj = randomElement(ADJECTIVES);
  const noun = randomElement(NOUNS);
  const suffix = Math.floor(Math.random() * 10000);

  return {
    userId: randomInt(1, 10),
    title: `${adj} ${noun} #${suffix}`,
    body: randomWords(randomInt(8, 20)),
  };
}

export function generateUpdatedPostPayload(): PostPayload {
  const adj = randomElement(ADJECTIVES);
  const suffix = Math.floor(Math.random() * 10000);

  return {
    userId: randomInt(1, 10),
    title: `Updated: ${adj} Title #${suffix}`,
    body: `Updated body content: ${randomWords(randomInt(6, 15))}`,
  };
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export const VALID_REQRES_CREDENTIALS: AuthCredentials = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

export const VALID_REQRES_REGISTER_CREDENTIALS: AuthCredentials = {
  email: 'eve.holt@reqres.in',
  password: 'pistol',
};

export const UNDEFINED_USER_CREDENTIALS: AuthCredentials = {
  email: `nonexistent_${Math.floor(Math.random() * 100000)}@example.com`,
  password: 'somepassword',
};

export function generateRandomEmail(): string {
  const suffix = Math.floor(Math.random() * 1_000_000);
  return `testuser_${suffix}@example.com`;
}

export function generateRandomPassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: randomInt(8, 16) },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}
