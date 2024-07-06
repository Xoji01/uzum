import { createheader } from "../../modules/ui.js";

document.addEventListener('DOMContentLoaded', async () => { // Добавлено async
    const headerContainer = document.querySelector('.container');

    const header = createheader();
    headerContainer.prepend(header);
    const searchInput = header.querySelector(".search_input");
    const searchButton = header.querySelector(".search_button");
    const openModalBtn = header.querySelector('.cate');
    const modal = document.getElementById('modal');
    const h1Element = document.querySelector('.sidebar');
    
    const products = await fetchData('../../db.json'); // Перемещено внутрь асинхронной функции
    
    document.getElementById('forhomee').addEventListener('click', () => {
        const filteredGoods = products.goods.filter(item => ['kitchen', 'tv', 'PC'].includes(item.type));
        localStorage.setItem('filteredGoods', JSON.stringify(filteredGoods));
        window.location.href = '../search/';
    });

    document.getElementById('furnituree').addEventListener('click', () => {
        const filteredGoods = products.goods.filter(item => ['tv', 'kitchen'].includes(item.type));
        localStorage.setItem('filteredGoods', JSON.stringify(filteredGoods));
        window.location.href = '../search/';
    });

    document.getElementById('salee').addEventListener('click', () => {
        const filteredGoods = products.goods.filter(item => item.salePercentage > 0);
        localStorage.setItem('filteredGoods', JSON.stringify(filteredGoods));
        window.location.href = '../search/';
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
        window.location.href = '../search/';
    });

    createheader();
});

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError(`Expected JSON, but received ${contentType}`);
    }
    return await response.json();
}

function displayProductDetails(product) {
    const titleElement = document.getElementById('product-title');
    const ratingElement = document.getElementById('product-rating');
    const priceElement = document.getElementById('product-price');
    const oldPriceElement = document.getElementById('product-old-price');
    const sizesElement = document.getElementById('product-sizes');
    const stockElement = document.getElementById('product-stock');
    const descriptionElement = document.getElementById('product-description');
    const swiperWrapper = document.getElementById('swiper-wrapper');
    const mainImage = document.getElementById('main-image');

    if (titleElement && ratingElement && priceElement && oldPriceElement && sizesElement && stockElement && descriptionElement && swiperWrapper && mainImage) {
        titleElement.innerText = product.title;
        ratingElement.innerHTML = `<span>⭐ ${product.rating}</span> <span>${product.reviews} отзывов</span>`;
        priceElement.innerText = `${product.price.toLocaleString()} сум`;
        oldPriceElement.innerText = product.oldPrice ? `${product.oldPrice.toLocaleString()} сум` : '';

        stockElement.innerText = product.stock;
        descriptionElement.innerText = product.description;
        mainImage.src = product.media[0]; 

        product.media.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<img class=""idg src="${image}" alt="${product.title}" data-index="${index}">`;
            swiperWrapper.appendChild(slide);
        });
       
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 4,
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });

        document.querySelectorAll('.swiper-slide img').forEach(img => {
            img.addEventListener('click', function() {
                mainImage.src = this.src;
            });
        });
    } else {
        console.error('Не удалось найти один или несколько элементов на странице.');
    }
}

function updatePrice(product, quantity) {
    const priceElement = document.getElementById('product-price');
    if (priceElement) {
        const totalPrice = product.price * quantity;
        priceElement.innerText = `${totalPrice.toLocaleString()} сум`;
    }
}

function setupQuantityControls(product) {
    const decreaseButton = document.querySelector('.decrease');
    const increaseButton = document.querySelector('.increase');
    const quantityInput = document.getElementById('quantity-input');

    if (decreaseButton && increaseButton && quantityInput) {
        decreaseButton.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
                updatePrice(product, quantity);
            }
        });

        increaseButton.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value);
            quantity++;
            quantityInput.value = quantity;
            updatePrice(product, quantity);
        });

        quantityInput.addEventListener('input', () => {
            let quantity = parseInt(quantityInput.value);
            if (quantity < 1) quantity = 1;
            quantityInput.value = quantity;
            updatePrice(product, quantity);
        });
    }
}

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (productId) {
    fetchData('../../db.json').then(data => {
        const product = data.goods.find(item => item.id == productId);
        if (product) {
            displayProductDetails(product);
            setupQuantityControls(product);
        } else {
            console.error('Товар не найден.');
        }
    }).catch(error => {
        console.error('Ошибка загрузки данных:', error);
    });
} else {
    console.error('ID товара не указан в URL.');
}
