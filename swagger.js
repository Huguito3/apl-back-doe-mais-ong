const swaggerAutogen = require('swagger-autogen')()




const outputFile = './swagger-output.json'
const endpointsFiles = ['./routes/usuarios-routes.js','./routes/auth-routes.js','./routes/upload-routes.js','./routes/ong-routes.js']

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index')           // Your project's root file
})
