const User = require('../models/User')
const bcrypt = require('bcrypt')

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
            res.status(201).json({message: 'Usuário criado.',  newUser,})

        }catch(error){
            res.status(500).json({message: error})
        }
    }
    
}