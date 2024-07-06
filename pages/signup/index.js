import axios from 'axios'
import { getData, postDatat } from '../../modules/https'
import { toaster } from '../../modules/ui'

const form = document.forms.namedItem('signup')
const inps_req = document.querySelectorAll('.request')

inps_req.forEach((inp) => {
    inp.onkeyup = () => {
        if (/^[a-z ,.'-]+$/i.test(inp.value)) {
            inp.style.border = "1px solid black"
            inp.style.outlineColor = "#0047ff"
        } else {
            inp.style.border = "1px solid red"
            inp.style.outlineColor = "red"
        }
    }
})

form.onsubmit = (e) => {
    e.preventDefault()

    const user = {}
    const fm = new FormData(e.target)

    fm.forEach((val, key) => user[key] = val)

    const {email, name, surname, password} = user

    if(email && name && surname && password) {
        getData('/users?email=' + email)
            .then(res => {
                if(res.data.length > 0) {
                    toaster('Аккаунт уже существует', 'error')
                    return
                }

                // Генерация токена
                const token = generateToken()
                user.token = token

                postDatat('/users', user)
                    .then(res => {
                        if(res.status === 200 || res.status === 201) {
                            // Сохранение токена в локальное хранилище
                            localStorage.setItem('token', token)
                            localStorage.setItem('username', name)
                            location.assign('/pages/signin/')
                        }
                    })
                    .catch(error => console.error(error))
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
