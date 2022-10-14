import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const asyncRandomBytes = promisify(randomBytes);

export default asyncRandomBytes;
