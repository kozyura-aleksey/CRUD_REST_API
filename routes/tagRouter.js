const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleWare')
const tagController = require('../controllers/tagController')

/**
 * @swagger
 * /tag:
 *  post:
 *      description: Создать тэг
 *      responses:
 *          '200':
 *              description: 
 *          '500':
 *              description: 
 */
router.post('/', authMiddleware, tagController.create);
/**
 * @swagger
 * /tag:
 *  get:
 *      description: Сортировать тэги
 *      responses:
 *          '200':
 *              description: 
 *          '500':
 *              description: 
 */
router.get('/', authMiddleware, tagController.sort);
/**
 * @swagger
 * /tag:id:
 *  get:
 *      description: Получить тэг по id
 *      responses:
 *          '200':
 *              description: 
 *          '500':
 *              description: Такого тэга не существует
 */
router.get('/:id', authMiddleware, tagController.getOne);
/**
 * @swagger
 * /tag:id:
 *  put:
 *      description: Обновить тэг
 *      responses:
 *          '200':
 *              description: 
 *          '500':
 *              description: Такой тэг уже существует
 */
router.put('/:id', authMiddleware, tagController.update);
/**
 * @swagger
 * /tag:id:
 *  delete:
 *      description: Удалить тэг
 *      responses:
 *          '200':
 *              description: Тэг удален
 *          '500':
 *              description: 
 */
router.delete('/:id', authMiddleware, tagController.delete);

module.exports = router;