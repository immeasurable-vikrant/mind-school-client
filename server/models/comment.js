import mongoose from 'mongoose';
import {counter} from './sequence';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
    no: Number,
    course: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    name: {type: String, default: ''},
    _user: {type: ObjectId, ref: 'User'},
    content: {type: String, default: ''},
    rating: {type: Number, default: 0},
    helpful: {type: Boolean, default: false},
    indent: {type: Number, default: 0},
    origin: {type: String, default: ''},
    _reply: {type: ObjectId, ref: 'Comment'}
});

CommentSchema.pre('save', function(next) {
    const doc = this;

    const name = 'comment_counter';

    counter.findByIdAndUpdate({_id: name}, {$inc: { seq: 1} }, function(err, result) {
        if(err) {
            return next(err);
        }

        doc.no = result.seq;
        // console.log('{Comment}:save => ['+doc.no+']');
        next();
    });
});

export default mongoose.model('Comment', CommentSchema, 'comments');
