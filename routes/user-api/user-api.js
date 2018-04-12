const express = require('express');
const router = express.Router();
const apiClient = require('../../okta-client/okta-client-config');
const authenticationRequired = require('../../middleware/authentication-required');
/**
 * Register a new User.
 */
router.post('/', (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }
    const newUser = {
        profile: {
            firstName: req.body.profile.firstName,
            lastName: req.body.profile.lastName,
            email: req.body.profile.email,
            login: req.body.profile.email
        },
        credentials: {
            password: {
                value: req.body.password
            }
        }
    };
    let queryParameters = { activate : 'true' };
    apiClient.createUser( newUser, queryParameters ).then(user => {
        console.log('Created user id : ', user.id);
        res.status(201);
        res.send(user);
    }).catch(err => {
        res.status(400);
        res.send(err.errorCauses);
    });
});
/**
 * Change user password.
 */
router.post('/change_password', authenticationRequired, (req, res) => {
    if (!req.body.newPassword && !req.body.oldPassword && !req.body.userId) {
        return res.sendStatus(400);
    }
    const userId = req.body.userId;
    const changePasswordCredentials = {
        oldPassword: { value: req.body.oldPassword },
        newPassword: { value: req.body.newPassword }
    };
    apiClient.changePassword(userId, changePasswordCredentials)
        .then(pass => {
            console.log('Password changed for user id : ', userId);
            res.status(200);
            res.send(pass);
        })
        .catch(err => {
            res.status(400);
            res.send(err);
        });
});

module.exports = router;