import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userType: { type: String, required: true },
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    birthDay: { type: String, required: true },
    gender: { type: String, required: true },
    telephone: { type: String },
    addedDate: { type: Date, default: Date.now },
    email: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    socials: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    adresse: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    profilePic: String,
    accountStatus: { type: String, default: 'active' },
    notifications: [{
        message: String,
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }],
    logginLogs: [{
        ip: String,
        date: { type: Date, default: Date.now },
        device: String
    }],
    lastLogin: Date,
    lastIp: String,
    creationDate: { type: Date, default: Date.now }
});

// Virtual for fullName
userSchema.virtual('fullName').get(function () {
    return `${this.fName} ${this.lName}`;
});

export default mongoose.model('User', userSchema);
