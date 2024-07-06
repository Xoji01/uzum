 import { getSymbols, patchData } from "../../../modules/https.js"

        const form = document.forms.update_userForm


        getSymbols().then((symbols) => {
            console.log('Symbols loaded:', symbols);
            for(let key in symbols) {
                let opt = new Option(`${key} - ${symbols[key]}`, key)
                select.append(opt)
            }
        })

        let user = JSON.parse(localStorage.getItem('user'));
        const h = document.querySelector('.h')
        h.innerHTML = `${user.name}`
  
        if (user) {
            form.email.value = user.email;
            form.name.value = user.name;
            form.surname.value = user.surname;
        } else {
            alert('No current user data found');
        }

        form.onsubmit = async (e) => {
            e.preventDefault()

            let fm = new FormData(e.target)
            let updatedUser = {
                id: user.id,  
                email: fm.get('email'),
                name: fm.get('name'),
                surname: fm.get('surname'),
                password: fm.get('password')
            }

            console.log("Updated User Data:", updatedUser);

            if(updatedUser.id && updatedUser.email && updatedUser.name && updatedUser.surname && updatedUser.password) {
                try {
                    console.log("Sending PATCH request with data:", updatedUser);
                    const res = await patchData(`/users/${updatedUser.id}`, updatedUser)
                    if (res && (res.status === 200 || res.status === 201)) {
                        alert('User updated successfully')
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        location.assign('../../../')
                    } else {
                        alert('User not found or error updating user')
                    }
                } catch (error) {
                    console.error("Error during PATCH request:", error)
                    alert('An error occurred while updating the user')
                }
            } else {
                alert('Please fill in all fields')
            }
        }
        const icon = document.querySelector('.quit')
        icon.onclick = () => {
            localStorage.removeItem('user')
            location.assign('/pages/signin/')
        }