import axios from "axios"
import { toaster } from "./ui"

const baseURL = 'http://localhost:8080' 
export const getData = async (path) => {
    try {
        const res = await axios.get(baseURL + path);
        return res;
    } catch (e) {
        toaster(e.message, 'error');
    }
};


export const fetchData = async (path) => {
    try {
        const res = await axios.get(baseURL + path)
        return res.data 
    } catch(e) {
        toaster(e.message, 'error')
    }
}
export async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response.json();
}


export const postDatat = async (path, body) => {
    try {
        const res = await axios.post(baseURL + path, body)
        return res.data 
    } catch(e) {
        toaster(e.message , 'error')
    }
}

export const getSymbols = async () => {
    const symbols = JSON.parse(localStorage.getItem('symbols'))
    if(symbols) {
        return symbols
    }
    try {
        const res = await axios.get('https://api.apilayer.com/fixer/symbols', {
            headers: {
                apikey: import.meta.env.VITE_API_KEY
            }
        })
        if(res.status === 200 || res.status === 201) {
            localStorage.setItem('symbols', JSON.stringify(res.data.symbols))
            return res.data.symbols
        }
    } catch(e) {
        toaster(e.message, 'error')
    }
}

export const patchData = async (path, body) => {
    try {
        console.log(`PATCH request to ${baseURL + path} with body:`, body);
        const res = await axios.patch(baseURL + path, body)
        console.log("PATCH response:", res);
        return res 
    } catch(e) {
        console.error("PATCH error:", e);
        toaster(e.message, 'error')
    }
}
