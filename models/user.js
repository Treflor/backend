const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//scheme can be add more options also
const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
    },
    password: {
        type: String,
        select: false
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
    local: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (!user.isModified('password')) {
            next();
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await User.findById(this._id).select('+password').exec().then(async user => {
            return await bcrypt.compare(newPassword, user.password);
        });
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model('user', userSchema);

//Export the user model
module.exports = User;