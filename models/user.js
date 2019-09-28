const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//scheme can be add more options also
const userSchema = new mongoose.Schema({
    methods: {
        type: [String],
        enum: ['google', 'local'],
        required: true
    },
    google: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
        },
        family_name: {
            type: String
        },
        given_name: {
            type: String
        },
        photo: {
            type: String
        }
    },
    local: {
        email: {
            type: String,
            lowercase: true,
        },
        password: {
            type: String,
        },
        family_name: {
            type: String
        },
        given_name: {
            type: String
        },
        photo: {
            type: String
        },
        gender: {
            type: String
        },
        birthday: {
            type: Number
        },
    },
});

userSchema.pre('save', async function (next) {
    try {
        if (!this.methods.includes('local')) {
            next();
        }

        const user = this;

        if (!user.isModified('local.password')) {
            next();
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model('user', userSchema);

//Export the user model
module.exports = User;