import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

export const counter = mongoose.model('counter', CounterSchema);

export const Sequence = function() {
    const user_counter = () => {
        return new Promise((resolve, reject) => {
            counter.collection.insert({
                _id: "user_counter",
                seq: 1
            }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    setTimeout(resolve, 10);
                }
            });
        });
    };

    const comment_counter = () => {
        return new Promise((resolve, reject) => {
            counter.collection.insert({
                _id: "comment_counter",
                seq: 1
            }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    setTimeout(resolve, 10);
                }
            });
        });
    };

    return Promise.race([
        user_counter(),
        comment_counter()
    ])
};
