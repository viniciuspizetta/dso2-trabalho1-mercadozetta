const bcrypt = require('bcryptjs');
const User = require('../model/User');

module.exports = {
    async register(req, res) {
        const { email } = req.body;

        try {
            if (await User.findOne({ email }))
                return res.status(400).send({ error: 'User already exists' });
            const newUser = await User.create(req.body);
            newUser.password = undefined;
            return res.status(200).send({ newUser });
        } catch (err) {
            return res.status(400).send({ error: 'Registration failed' });
        }
    },

    async authenticate(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('password');
        if (!user)
            return res.status(400).send({ error: 'User not found' })

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Invalid password' })

        user.password = undefined;
        res.send({ user });
    },
};