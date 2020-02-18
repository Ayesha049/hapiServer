const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    user_email: {
        type: String
    },
    user_password: {
        type: String
    }
});

module.exports = User = mongoose.model('users', UserSchema);