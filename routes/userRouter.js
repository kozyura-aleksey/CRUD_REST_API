const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleWare')
const userController = require('../controllers/userController')

/**
 * @swagger
 * /user/:
 *  get:
 *  content:
 *      application/json:
 *      description: Получить информацию о пользователе
 *      responses:
 *          '200':
 *              description: 
 *          '500':
 *              description: 
 */
router.get('/', authMiddleware, userController.getUser);
/**
 * @swagger
 * /user/:
 *  put:
 *      description: Обновить информацию о пользователе
 *      responses:
 *          '200':
 *              description: Вы обновили email
 *          '500':
 *              description: 
 */
router.put('/', authMiddleware, userController.updateUser);
/**
 * @swagger
 * /user/:
 *  delete:
 *      description: Удалить пользователя
 *      responses:
 *          '200':
 *              description: Пользователь удален
 *          '500':
 *              description: 
 */
router.delete('/', authMiddleware, userController.deleteUser);

/**
 * @swagger
 * /user/tag:
 *  post:
 *      description: Проверить наличие тэгов в базе и атомарно добавить их к пользователю
 *      responses:
 *          '200':
 *              description: 
 *          '500':
 *              description: 
 */
router.post('/tag', authMiddleware, userController.getUserTagsAndUpdate)
/**
 * @swagger
 * /user/tag/:id:
 *  delete:
 *      description: Удалить тэг
 *      responses:
 *          '200':
 *              description: 
 *          '500':
 *              description: 
 */
router.delete('/tag/:id', authMiddleware, userController.deleteTag)
/**
 * @swagger
 * /user/tag/my:
 *  get:
 *      description: Получить тэги данного польхователя
 *      responses:
 *          '200':
 *              description: 
 *          '500':
 *              description: 
 */
router.get('/tag/my', authMiddleware, userController.getMyTags)

module.exports = router;