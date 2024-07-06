import { getData } from '../../modules/https.js'
import { toaster } from '../../modules/ui'

const form = document.forms.namedItem('signin')

form.onsubmit = (e) => {
    e.preventDefault()

    const user = {}
    
    const fm = new FormData(e.target)
    
    fm.forEach((val, key) => user[key] = val)

    const {email, password} = user

    if(email && password) {
        getData('/users?email=' + email)
            .then((res) => {
                const [res_user] = res.data

                if(!res_user) {
                    toaster('Такого пользователя не существует', 'error')    
                    return
                }
                if(res_user.password !== password) {
                    toaster('Не верный пароль!', 'error')    
                    return
                }
                
                delete res_user.password

                // Генерация токена
                const token = generateToken()
                res_user.token = token

                // Сохранение токена и пользователя в localStorage
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(res_user))
                
                location.assign('/')
            })
            .catch(error => console.error(error))
    }
}

function generateToken() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let token = ""

    for (let i = 0; i < 10; i++) {
        let rnd = Math.floor(Math.random() * characters.length)
        token += characters[rnd]
    }

    return token
}
