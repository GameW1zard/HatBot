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
            default: "test",
        },
    }
);

const User = model('User', userSchema);

export default User;