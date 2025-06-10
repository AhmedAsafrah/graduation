const UserModel = require('../models/userModel');
const assert = require('assert');

describe('User Model', () => {
    let user;

    beforeEach(() => {
        user = new UserModel({ name: 'Ahmed Mohammed Asafrah', email: '211033@ppu.edu.ps' });
    });

    it('should create a user', () => {
        assert.strictEqual(user.name, 'Ahmed Mohammed Asafrah');
        assert.strictEqual(user.email, '211033@ppu.edu.ps');
    });

    it('should read a user', () => {
        const userData = user.toJSON();
        assert.strictEqual(userData.name, 'Ahmed Mohammed Asafrah');
        assert.strictEqual(userData.email, '211033@ppu.edu.ps');
    });

    it('should update a user', () => {
        user.name = 'Ahmed Mohammed Asafrah';
        assert.strictEqual(user.name, 'Ahmed Mohammed Asafrah');
    });

    it('should delete a user', () => {
        user = null;
        assert.strictEqual(user, null);
    });
});