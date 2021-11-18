const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Tag } = require('../models/models')
const uuid = require('uuid');
const sequelize = require('../db')

const expire = '30m';

const userOnline = []

const generatejwt = (id, email, nickname) => {
    return jwt.sign(
        { id, email, nickname },
        process.env.SECRET_KEY,
        { expiresIn: expire }
    )
}

const destroyjwt = (token) => {
    return jwt.destroy(token)
}

class UserController {
    async singin(req, res, next) {
        try {
            const { email, password, nickname } = req.body;
            const uid = uuid.v4();
            if (!email || !password) {
                return next(res.status(404).json('Некорректный email или password'));
            }
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(res.status(404).json('Пользователь с таким email уже существует'));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ uid: uid, email, password: hashPassword, nickname });
            const token = generatejwt(user.uid, user.email, user.nickname);
            const info = {
                token, expire
            }
            return res.status(200).json(info);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(res.status(500).json('Пользователь не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(res.status(500).json('Указан неверный пароль'));
            }
            const token = generatejwt(user.uid, user.email, user.nickname);
            const info = {
                token, expire
            }
            userOnline.push(user);
            return res.status(200).json(info);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const uid = decoded.id;
            const user = await User.findOne(
                {
                    include: [
                        {
                            model: Tag,
                            attributes: ['id', 'name', 'sortOrder'],
                        }
                    ],
                    where: { uid },
                    attributes: ['email', 'nickname'],
                }
            )
            return res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const { email, password, nickname } = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const uid = decoded.id
            const hashPassword = await bcrypt.hash(password, 5);

            const candidateE = await User.findOne({ where: { email } });
            if (candidateE) {
                //res.status(404).json('Пользователь с таким email уже существует');
                const user = await User.update(
                    {
                        nickname: nickname,
                        password: hashPassword
                    },
                    {
                        where: { uid },
                        returning: true,
                    }
                )
                res.status(200).json(`Вы обновили nickname: ${nickname}`);
            }
            const candidateN = await User.findOne({ where: { nickname } });
            if (candidateN) {
                //res.status(404).json('Пользователь с таким nickname уже существует');
                const user = await User.update(
                    {
                        email: email,
                        password: hashPassword
                    },
                    {
                        where: { uid },
                        returning: true,
                    }
                )
                res.status(200).json(`Вы обновили email: ${email}`);
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { email } = req.body;
            userOnline.pop();
            let user = await User.destroy(
                {
                    where: { email }
                }
            )
            res.status(200).json(`Пользователь ${email} удален`);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async logout(req, res, next) {
        const token = req.headers.authorization.split(' ')[1];
        //destroyjwt(token);
        userOnline.pop();
        res.status(200).json('Вы вышли из системы');
        res.redirect('/');
    }

    async getUserTagsAndUpdate(req, res, next) {
        try {
            const { tags } = req.body;
            const id = tags;
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const uid = decoded.id;
            let tag = await Tag.findAll(
                {
                    where: { id }
                }
            )
            if (tag.length === id.length) {
                let updateTag = await Tag.update(
                    {
                        userUid: uid,
                    },
                    {
                        where: { id },
                        returning: true,
                    }
                )
                return res.status(200).json(updateTag)
            } else {
                return res.status(500).json('Какой-либо из тэгов отсутствует в базе')
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async deleteTag(req, res, next) {
        try {
            const { id } = req.params;
            let tag = await Tag.destroy(
                {
                    where: { id },
                    returning: true
                }
            )
            return res.status(200).json(tag);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getMyTags(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const userUid = decoded.id
            const tags = Tag.findAll(
                {
                    where: { userUid },
                    attributes: ['id', 'name', 'sortOrder'],
                    returning: true
                },
                {
                    returning: true
                }
            ).then(function (tags) {
                return res.status(200).json(tags);
            })
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

module.exports = new UserController();