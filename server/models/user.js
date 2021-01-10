import mongoose from 'mongoose';
import { counter } from './sequence';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  no: Number,
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, default: '' },
  profile: {
    name: { type: String, default: '' },
    picture: { type: String, default: '' },
    instructor: { type: Boolean, default: false },
  },
  courses: [
    {
      ref: { type: ObjectId, ref: 'Course' },
      no: { type: Number, default: 0 },
      learn: { type: Boolean, default: false },
    },
  ],
  google: {
    type: Object,
  },
  facebook: {
    type: Object,
  },
  twitter: {
    type: Object,
  },
});

UserSchema.pre('save', function (next) {
  const doc = this;

  const name = 'user_counter';

  counter.findByIdAndUpdate({ _id: name }, { $inc: { seq: 1 } }, function (
    err,
    result,
  ) {
    if (err) {
      return next(err);
    }

    doc.no = result ? result.seq : null;
    // console.log('{User}:save => [' + doc.no + ']');
    next();
  });
});

export default mongoose.model('User', UserSchema, 'users');
