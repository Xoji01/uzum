import { patchData } from './https';

async function addToFavorites(userId, productId) {
    try {
        let user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            throw new Error('User not found in localStorage');
        }

        // Проверяем, есть ли у пользователя массив избранных товаров, иначе создаем его
        if (!user.favorites) {
            user.favorites = [];
        }

        // Проверяем, содержится ли productId в массиве избранных товаров пользователя
        if (user.favorites.includes(productId)) {
            // Если содержится, удаляем productId из избранных
            user.favorites = user.favorites.filter(id => id !== productId);
            console.log(`Товар с ID ${productId} удален из избранного`);

            // Обновляем данные пользователя в localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Отправляем PATCH запрос для обновления данных в db.json
            await patchFavorites(userId, user.favorites);

        } else {
            // Если не содержится, добавляем productId в избранные
            user.favorites.push(productId);
            console.log(`Товар с ID ${productId} добавлен в избранное`);

            // Обновляем данные пользователя в localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Отправляем PATCH запрос для обновления данных в db.json
            await patchFavorites(userId, user.favorites);
        }

    } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
    }
}

async function patchFavorites(userId, favorites) {
    try {
        // Формируем тело запроса для обновления избранных товаров пользователя
        const body = { favorites };

        // Отправляем PATCH запрос на сервер
        const response = await patchData(`/users/${userId}`, body);
        console.log('Ответ сервера на PATCH запрос:', response.data);
    } catch (error) {
        console.error('Ошибка при PATCH запросе:', error);
    }
}

export { addToFavorites };
