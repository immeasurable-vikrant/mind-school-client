import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LectureSchema = new Schema({
    no: {type: Number, unique: true},
    _course: {type: ObjectId, ref: 'Course'},
    total: {
        lectures: {type: Number, default: 0},
        time: {type: String, default: ''}
    },
    header: [{
        no: {type: Number, default: 0},
        title: {type: String, default: ''},
        lectures: {type: Number, default: 0},
        body: [{
            sub_no: {type: Number, default: 0},
            content: {type: String, default: ''},
            preview: {type: Boolean, default: false},
            time: {type: String, default: ''}
        }]
    }]
});

export default mongoose.model('Lecture', LectureSchema, 'lectures');
