import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    bunnyVideoId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'uploading' // uploading, processing, ready, failed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Video', videoSchema);
