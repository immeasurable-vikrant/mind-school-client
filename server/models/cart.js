import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CartSchema = new Schema({
    user: { type: ObjectId, ref: 'User'},
    courses: [{
        ref: { type: ObjectId, ref: 'Course'},
        no: { type: Number, default: 0}
    }]
});

export default mongoose.model('Cart', CartSchema, 'carts');
