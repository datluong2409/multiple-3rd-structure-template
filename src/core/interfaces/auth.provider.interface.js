/**
 * Authentication Provider Interface
 */
class IAuthProvider {
  async authenticate() {
    throw new Error('Method "authenticate()" must be implemented');
  }

  async refreshToken() {
    throw new Error('Method "refreshToken()" must be implemented');
  }

  async validateToken(token) {
    throw new Error('Method "validateToken()" must be implemented');
  }
}

module.exports = IAuthProvider;
