const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../server');

describe('Token Generation', () => {
  it('should generate a token with correct user details and expiry time', async () => {
    const user = { userId: '123', email: 'test@example.com' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).to.equal(user.userId);
    expect(decoded.email).to.equal(user.email);
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    expect(decoded.exp).to.be.above(currentTimestamp);
    expect(decoded.exp).to.be.below(currentTimestamp + 3601);
  });
});

