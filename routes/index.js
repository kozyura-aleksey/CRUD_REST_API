const Router = require('express')
const router = new Router()
const tagRouter = require('./tagRouter')
const userRouter = require('./userRouter')
const userController = require('../controllers/userController')


router.use('/tag', tagRouter);
router.use('/user', userRouter);

/**
 * @swagger
 * /:
 *  get:
 *      description: Название приложения
 */
router.get('/', (req, res) => {
    res.send('CRUD API');
})

/**
 * @swagger
 * /singin:
 *  post:
 *      description: Регистрация в системе
 *      responses:
 *          '200':
 *              description: Вы зарегистрированы в системе
 *          '404':
 *              description: Некорректный email или password или Пользователь с таким email уже существует
 */
router.post('/singin', userController.singin)
/**
 * @swagger
 * /login:
 *  post:
 *      description: Войти в систему
 *      responses:
 *          '200':
 *              description: Вы вошли в систему
 *          '500':
 *              description: Пользователь не найден или Указан неверный пароль
 */
router.post('/login', userController.login)
/**
 * @swagger
 * /logout:
 *  post:
 *      description: Выйти из системы
 *      responses:
 *          '200':
 *              description: Вы вышли из системы
 */
router.post('/logout', userController.logout)

module.exports = router;