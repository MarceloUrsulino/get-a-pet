// Função helper responsável por extrair apenas o token puro
// de dentro do header "Authorization" da requisição.
// É usada em qualquer rota protegida que precise validar o usuário logado.

const getToken = (req) =>{
    // O header Authorization chega no formato: "Bearer eyJhbGciOiJIUzI1Ni..."
    // ou seja, a palavra "Bearer", um espaço, e depois o token JWT
    const authHeader = req.headers.authorization
     // .split(" ") quebra a string em um array usando o espaço como separador:
    // ["Bearer", "eyJhbGciOiJIUzI1Ni..."]
    // [1] pega o segundo item do array (índice 1) - ou seja, só o token,
    // sem a palavra "Bearer" junto
    const token = authHeader.split(" ")[1]
    return token
}

module.exports = getToken