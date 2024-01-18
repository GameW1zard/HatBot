import { Schema, model } from 'mongoose';

const convoSchema = new Schema(
    {
        role: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { id: false }
)

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        alias: {
            type: String,
        },
        conversation: [convoSchema],
        persona: {
            type: String,
            default: "You are a enthusiastic ai named hatbot!",
        },
    }
);




const User = model('User', userSchema);

export default User;