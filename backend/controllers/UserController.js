const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController{
    static async register(req,res) {

        const  {name, email, phone, password, confirmpassword} = req.body

        if(!name){
            res.status(422).json({message:'O nome é obrigatório.'})
        }

        if(!email){
            res.status(422).json({message:'O e-mail é obrigatório.'})
        }

        if(!phone){
            res.status(422).json({message:'O telefone é obrigatório.'})
        }

        if(!password){
            res.status(422).json({message:'A senha é obrigatório.'})
        }

        if(!confirmpassword){
            res.status(422).json({message:'A confirmação de senha é obrigatório.'})
            return
        }
        if(password !== confirmpassword ){
            res.status(422).json({message: 'A senha e a confirmação precisam ser iguais.'})
            return
        }

       // check if user exist

    const userExists = await User.findOne({email: email})
        if(userExists){
            res.status(422).json({message: 'Por favor, utilize outro e-mail.'})
            return
        }
        //Create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try{
            const newUser = await user.save()
            await createUserToken(newUser, req, res)

        }catch(error){
            res.status(500).json({message: error})
        }
    }
    //system login function
    static async login(req,res){
        const {email, password} = req.body

         if(!email){
            res.status(422).json({message:'O e-mail é obrigatório.'})
            return
        }

         if(!password){
            res.status(422).json({message:'A senha é obrigatória.'})
            return
        }

         // check if user exist

    const user = await User.findOne({email: email})
        if(!user){
            res.status(422).json({message: 'Não há usuário cadastrado com esse e-mail.'})
            return
        }

        //check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: 'Senha inválida.'})
            return
        }
        await createUserToken(user, req, res)

    }
    //verifyToken

    // Rota que verifica se existe um usuário autenticado
    // baseado no token enviado no header Authorization.
    // Usada, por exemplo, quando o frontend recarrega a página
    // e precisa confirmar "esse token ainda é válido? quem está logado?" 
    static async checkUser(req,res){
        // Variável que vai guardar o usuário atual (ou null, se não tiver token)
        let currentUser
        
        
        if(req.headers.authorization){
            // Confere se o header Authorization foi enviado na requisição
            const token = getToken(req)

            // jwt.verify faz duas coisas:
            // 1) Confere se o token é válido/não foi adulterado, comparando
            //    com a mesma secret usada para criar ele (process.env.JWT_SECRET).
            //    Se for inválido, lança um erro automaticamente.
            // 2) Se for válido, decodifica o token e devolve o payload
            //    que foi gravado nele lá no login/registro (name, id, etc.)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Usa o id que veio decodificado do token para buscar
            // o usuário atualizado direto no banco de dados.
            // Isso garante que os dados estejam sempre corretos/atuais,
            // mesmo que o token tenha sido gerado há um tempo atrás.
            currentUser = await User.findById(decoded.id)

           // Remove o campo de senha (hash) do objeto antes de responder.
           // Por segurança, a senha (mesmo hasheada) nunca deve ser
           // devolvida nas respostas da API.
            currentUser.password = undefined

        }else{
            // Se não veio nenhum token no header, não há usuário autenticado
            currentUser = null
        }
        // Responde com os dados do usuário logado (ou null, se não estava logado)
        res.status(200).send(currentUser)
    }

    //Resgatando usuário por id
    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if(!user){
            
            res.status(422).json({message: 'Usuário não encontrado.'})
            return
        }
        res.status(200).json({ user })
    }

    static async editUser(req, res){
        const id = req.params.id

         //check is user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmpassword} = req.body

        let image = ' '
        // validadions

        if(!name){
            res.status(422).json({message:'O nome é obrigatório.'})
        }

        if(!email){
            res.status(422).json({message:'O e-mail é obrigatório.'})
        }

         const userExists = await User.findOne({email: email})
         //check if email has already taken 
        if(user.email !== email && userExists){
            res.status(422).json({message: 'Por favor, utilize outro email.'})
            return
        }  

        if(!phone){
            res.status(422).json({message:'O telefone é obrigatório.'})
        }

        if(!password){
            res.status(422).json({message:'A senha é obrigatório.'})
        }

        if(!confirmpassword){
            res.status(422).json({message:'A confirmação de senha é obrigatório.'})
            return
        }
        if(password !== confirmpassword ){
            res.status(422).json({message: 'A senha e a confirmação precisam ser iguais.'})
            return
        }
      
        
    }
}   