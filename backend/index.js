require('dotenv').config() 
const express = require('express')

// CORS = Cross-Origin Resource Sharing
// Middleware que permite que o backend receba requisições
// vindas de outras origens (domínio/porta diferentes).
//
// Sem isso, o navegador bloqueia por padrão requisições feitas
// via JavaScript (fetch/axios) de um frontend (ex: localhost:3000)
// para um backend em outra porta (ex: localhost:5000),
// mesmo rodando na mesma máquina - são consideradas "origens" diferentes.
//
// Necessário para o frontend conseguir se comunicar com essa API.
const cors = require('cors')

const app = express()

require('./db/conn')
//config JSON response
app.use(express.json())

// Solve CORS
// Libera o backend para aceitar requisições de qualquer origem.
// Em produção, o ideal é restringir apenas para o domínio do seu frontend:
// app.use(cors({ origin: 'https://seusite.com' }))
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//Public folder for images
app.use(express.static('public'))

//routes

const UserRoutes = require('./routes/UserRoutes')
app.use('/users', UserRoutes)

app.listen(5000)