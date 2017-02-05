import jwt from 'jsonwebtoken';
import Account from '../../models/account';

exports.register = (req, res) => {
    const { id, pw, email } = req.body;
    let newUser = null;

    const create = (user) => {
        if(user){
            throw new Error('id exists');
        }else{
            return Account.create(id, pw, email);
        }
    };

    const respond = () => {
        res.json({
            message: 'registered successfully'
        });
    };

    const onError = (error) => {
        res.status(403).json({
            message: error.message
        });
    };

    Account.findOneById(id)
           .then(create)
           .then(respond)
           .catch(onError);
};

exports.login = (req, res) => {
    const { id, pw, email } = req.body;
    const secret = req.app.get('jwt-secret');

    const check = (user) => {
        if(!user){
            throw new Error('login failed');
        }else{
            if(user.verify(pw)){
                const p = new Promise((resolve, reject) => {
                    jwt.sign({
                        _id: user._id,
                        id: user.id
                    }, secret,{
                        expiresIn: '7d', //임시
                        issuer: 'heyfren', //임시
                        subject: 'userInfo' //임시
                    }, (err, token) => {
                        if(err) reject(err);
                        resolve(token);
                    });
                });

                return p;
            }else{
                throw new Error('login failed');
            }
        }
    };

    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        });
    };

    const onError = (error) => {
        res.status(403).json({
            message: error.message
        });
    };

    Account.findOneById(id)
           .then(check)
           .then(respond)
           .catch(onError);
};

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    });
};
