import { Schema, model } from 'mongoose';


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
        conversation: [String],
        persona: {
            type: String,
            default: "You are a enthusiastic ai named hatbot!",
        },
    }
);

const User = model('User', userSchema);

export default User;