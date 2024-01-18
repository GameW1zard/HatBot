import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://GameW1zard:loyariven13@cluster0.i4sxasf.mongodb.net/Hatbot?retryWrites=true&w=majority');

export default mongoose.connection;
