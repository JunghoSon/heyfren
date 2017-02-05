import mongoose from 'mongoose';
import crypto from 'crypto';
import config from '../../config';

const Schema = mongoose.Schema;

const Account = new Schema({
    id: String,
    pw: String,
    email: String,
    lastLogin: {type:Date, default:Date.now},
    profile: {
        gender: String,
        birth: Date,
        nationality: String,
        live: String,
        city: String,
        job: String,
        religion: String,
        purpose: String,
        introduction: String,
        lastUpdate: {type:Date, default:Date.now}
    }
});

Account.statics.create = (id, pw, email) => {
    const encrypted = crypto.createHmac('sha1', config.secret)
                            .update(pw)
                            .digest('base64');

    const account = new this({
        id,
        pw: encrypted,
        email
    });

    return account.save();
};

Account.statics.findOneById = (id) => {
    return this.findOnd({
        id
    }).exec();
};

Account.methods.verify = (pw) => {
    const encrypted = crypto.createHmac('sha1', config.secret)
                            .update(pw)
                            .digest('base64');

    return this.pw === encrypted;
};

export default mongoose.model('Account', Account);
