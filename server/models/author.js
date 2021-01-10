import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    no: {type: Number, unique: true},
    name: {type: String, default: ''},
    author: [{type: Number, default: 0}],
    avatar: {type: String, default: ''},
    average: {type: Number, default: 0},
    reviews: {type: Number, default: 0},
    students: {type: Number, default: 0},
    courses: {type: Number, default: 0},
    description: {type: String, default: ''}
});

export default mongoose.model('Author', AuthorSchema, 'authors');
