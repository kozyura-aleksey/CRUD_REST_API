const { Tag, User } = require('../models/models');
const jwt = require('jsonwebtoken');

class TagController {
    async create(req, res, next) {
        try {
            let { name } = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            var uid = decoded.id;
            const candidateTag = await Tag.findOne({ where: { name } });
            if (candidateTag) {
                return next(res.status(500).json('Такой тэг уже существует'));
            }
            if (name) {
                const tag = await Tag.create({ name, userUid: uid })
                return res.status(200).json(tag);
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const uid = decoded.id;
            const tag = await Tag.findOne(
                {
                    include: [
                        {
                            model: User,
                            attributes: ['uid', 'nickname'],
                            //where: {uid} 
                        }
                    ],
                    where: { id },
                    attributes: ['name', 'sortOrder'],
                }
            )
            tag !== null ? res.status(200).json(tag) : res.status(500).json('Такого тэга не существует')
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const candidateTag = await Tag.findOne({ where: { name } });
            if (candidateTag) {
                return next(res.status(500).json('Такой тэг уже существует'));
            }
            let tag = await Tag.update(req.body,
                {
                    include: [
                        {
                            model: User,
                            attributes: ['uid', 'nickname'],
                            //where: {uid} 
                        }
                    ],
                    where: { id },
                    attributes: ['name', 'sortOrder'],
                    returning: true,
                }
            )
            res.status(200).json(tag[1][0]);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            let tag = await Tag.destroy(
                {
                    where: { id }
                }
            )
            res.status(200).json("Тэг удален");
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async sort(req, res, next) {
        try {
            let { offset, limit } = req.query
            offset = offset || 1;
            const tag = await Tag.findAndCountAll({
                offset,
                limit,
                order: [
                    ['name', 'ASC'],
                    ['sortOrder', 'ASC'],
                ],
                include: [
                    {
                        model: User,
                        attributes: ['uid', 'nickname'],
                        //where: {uid} 
                    }
                ],             
            })
            const user = await User.findAndCountAll({
                attributes: ['uid', 'nickname'],
                include: [
                    {
                        model: Tag,
                        attributes: ['name', 'sortOrder'],
                        offset,
                        limit,
                        order: [
                            ['name', 'ASC'],
                            ['sortOrder', 'ASC'],
                        ],
                    }
                ],
            })
            return res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

module.exports = new TagController();