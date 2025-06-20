import { randomBytes } from 'crypto';

export default () => {
  return randomBytes(4).toString('hex');
};
