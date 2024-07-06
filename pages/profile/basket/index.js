import { createheader } from '../../../modules/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    const headerContainer = document.querySelector('.container');
    const header = createheader();

    headerContainer.prepend(header);

    const user = JSON.parse(localStorage.getItem('user'));
    const profile = header.querySelector('.signin');
    profile.innerHTML = `${user.name}`;
    profile.href = "../..//profile/settings/";
    const izb = header.querySelector('.izb');
    izb.href = "../../profile/saved/";
    const bas = document.querySelector('.bas');
    bas.href = "../../profile/basket/";
    const searchInput = header.querySelector(".search_input");
    const searchButton = header.querySelector(".search_button");
    const openModalBtn = header.querySelector('.cate');
    const modal = document.getElementById('modal');
    const h1Element = document.querySelector('.sidebar');

    document.getElementById('forhomee').addEventListener('click', () => {
        const filteredGoods = products.goods.filter(item => ['kitchen', 'tv', 'PC'].includes(item.type));
        localStorage.setItem('filteredGoods', JSON.stringify(filteredGoods));
        window.location.href = '../../search/';
    });

    document.getElementById('furnituree').addEventListener('click', () => {
        const filteredGoods = products.goods.filter(item => ['tv', 'kitchen'].includes(item.type));
        localStorage.setItem('filteredGoods', JSON.stringify(filteredGoods));
        window.location.href = '../../search/';
    });

    document.getElementById('salee').addEventListener('click', () => {
        const filteredGoods = products.goods.filter(item => item.salePercentage > 0);
        localStorage.setItem('filteredGoods', JSON.stringify(filteredGoods));
        window.location.href = '../../search/';
    });

    openModalBtn.addEventListener('click', () => {
        if (modal.style.display === "none") {
            openModalBtn.innerHTML = "✕ Каталог";
            modal.style.display = 'block';
        } else {
            openModalBtn.innerHTML = "Каталог";
            modal.style.display = "none";
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    h1Element.onclick = () => {
        modal.style.display = 'none';
    };

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        localStorage.setItem('searchTerm', searchTerm);
        window.location.href = '../../search/';
    });

    const products = await fetchhData('../../../db.json');
    const basketItemsContainer = document.getElementById('basket-items');
    const itemCountElement = document.getElementById('item-count');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    const finalPriceElement = document.getElementById('final-price');
    const savingsElement = document.getElementById('savings');

    let basketItems = [];

    async function fetchhData(url) {
        const response = await fetch(url);
        return await response.json();
    }

    const fetchData = async (path) => {
        const response = await fetch(`http://localhost:8080${path}`);
        return response.json();
    };

    const updateBasketDisplay = () => {
        basketItemsContainer.innerHTML = '';

        let totalItems = 0;
        let totalPrice = 0;
        let savings = 0;

        basketItems.forEach((item) => {
            const product = item.product;
            const price = product.isBlackFriday ? product.price * (1 - product.salePercentage / 100) : product.price;
            const itemQuantity = item.quantity || 1;

            totalItems += itemQuantity;
            totalPrice += product.price * itemQuantity;
            savings += (product.price - price) * itemQuantity;
          
            const basketItemHTML = `
                <div class="basket-item" data-id="${item.id}">
                    <input type="checkbox" checked />
                    <img src="${product.media[0]}" alt="${product.title}" />
                    <div>
                        <h2>${product.title}</h2>
                        <p>Продавец: World of stationery</p>
                        <div class="button-group">
                            <button class="decrease-quantity">-</button>
                            <span class="quantity">${itemQuantity}</span>
                            <button class="increase-quantity">+</button>
                        </div>
                    </div>
                    <p class="price">${price * itemQuantity} сум</p>
                    <span class="remove-button"><svg data-v-1a3a46a8="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon  filled">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.75 3.5C9.33579 3.5 9 3.83579 9 4.25V5H15V4.25C15 3.83579 14.6642 3.5 14.25 3.5H9.75ZM7.5 4.25V5H3.75C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H4.30005L5.62088 19.9681C5.73386 21.1202 6.70255 21.9985 7.86014 21.9985H16.1399C17.2975 21.9985 18.2661 21.1202 18.3791 19.9681L19.7 6.5H20.25C20.6642 6.5 21 6.16421 21 5.75C21 5.33579 20.6642 5 20.25 5H16.5V4.25C16.5 3.00736 15.4926 2 14.25 2H9.75C8.50736 2 7.5 3.00736 7.5 4.25ZM11 9.75C11 9.33579 10.6642 9 10.25 9C9.83579 9 9.5 9.33579 9.5 9.75V17.25C9.5 17.6642 9.83579 18 10.25 18C10.6642 18 11 17.6642 11 17.25V9.75ZM14.5 9.75C14.5 9.33579 14.1642 9 13.75 9C13.3358 9 13 9.33579 13 9.75V17.25C13 17.6642 13.3358 18 13.75 18C14.1642 18 14.5 17.6642 14.5 17.25V9.75Z" fill="black"></path>
</svg></span>
                </div>
            `;
            
          
            basketItemsContainer.insertAdjacentHTML('beforeend', basketItemHTML);
        });


        itemCountElement.textContent = `${totalItems} товар${totalItems > 1 ? 'а' : ''}`;
        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = `${totalPrice} сум`;
        finalPriceElement.textContent = `${totalPrice - savings} сум`;
        savingsElement.textContent = `${savings} сум`;

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', handleIncreaseQuantity);
        });

        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', handleDecreaseQuantity);
        });

        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    };

    const handleIncreaseQuantity = async (event) => {
        const basketItemElement = event.target.closest('.basket-item');
        const id = basketItemElement.dataset.id;
        const quantityElement = basketItemElement.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);
        quantity += 1;
        quantityElement.textContent = quantity;

        await updateItemQuantity(id, quantity);
        updateBasketDisplay();
    };

    const handleDecreaseQuantity = async (event) => {
        const basketItemElement = event.target.closest('.basket-item');
        const id = basketItemElement.dataset.id;
        const quantityElement = basketItemElement.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 1) {
            quantity -= 1;
            quantityElement.textContent = quantity;

            await updateItemQuantity(id, quantity);
            updateBasketDisplay();
        }
    };

    const handleRemoveItem = async (event) => {
        const basketItemElement = event.target.closest('.basket-item');
        const id = basketItemElement.dataset.id;

        await removeItem(id);
        basketItems = basketItems.filter(item => item.id !== id);
        updateBasketDisplay();
    };

    const updateItemQuantity = async (id, quantity) => {
        const item = basketItems.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;

            try {
                await fetch(`http://localhost:8080/basket/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity }),
                });
            } catch (error) {
                console.error('Error updating item quantity:', error);
            }
        }
    };

    const removeItem = async (id) => {
        try {
            await fetch(`http://localhost:8080/basket/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    basketItems = (await fetchData('/basket')).filter(item => item.userId === user.id);
    updateBasketDisplay();
});
