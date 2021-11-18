require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;
const cors = require('cors')
const sequelize = require('./db')
const router = require('./routes/index')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router)

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'CRUD REST API',
            description: 'CRUD REST API documentation',
            version: "1.0.0",
            servers: [`http://${HOST}:${PORT}`],
        }
    },
    // ['./routes*.js']
    apis: ['./routes/**.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();