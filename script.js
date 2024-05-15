// Get elements
const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const searchInput = document.querySelector('.search');

let items = [
    {
        id: 1,
        name: 'Apple',
        price: 0.99,
    },
    {
        id: 2,
        name: 'Banana',
        price: 10,
    },
    {
        id: 3, 
        name: 'Lemon',
        price: 4.49,
    },
    {
        id: 4, 
        name: 'Orange',
        price: 2.89,
    },
    {
        id: 5,
        name: 'Lime',
        price: 0.99,
    }
];

let cart = [];
let filteredItems = items;

// An example function that creates HTML elements using the DOM.
function fillItemsGrid(filteredItems) {
    itemsGrid.innerHTML = '';
    for (const item of filteredItems) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="${getImageForItem(item.name)}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
        `;
        itemsGrid.appendChild(itemElement);

        const addToCartButton = itemElement.querySelector('.add-to-cart-btn');
        const itemId = parseInt(addToCartButton.getAttribute('data-id'))
        addToCartButton.addEventListener('click', () => addToCart(itemId));
    }
}

function getImageForItem(itemName) {
    if (itemName.toLowerCase() === 'banana') {
        return 'images/banana.jpg';
    } else if (itemName.toLowerCase() === 'lemon') {
        return 'images/lemon.jpg';
    } else if (itemName.toLowerCase() === 'apple') {
        return 'images/apple.jpg';
    } else {
        return 'https://picsum.photos/200/300?random=${itemName}';
    }
}

function addToCart(itemId){
    const item = items.find(item => item.id === itemId);
    const cartItem = cart.find(cartItem => cartItem.id === itemId)

    if (item) {
        if(cartItem){
            cartItem.quantity++
        }
        else{
            const addItem = {id: item.id, name: item.name, price: item.price, quantity: 1}
            cart.push(addItem)
        }
        updateCartBadge();
    }
}

function updateCartBadge(){
    cartBadge.textContent = cart.length
}



// Adding the .show-modal class to an element will make it visible
// because it has the CSS property display: block; (which overrides display: none;)
// See the CSS file for more details.
function toggleModal() {
    modal.classList.toggle('show-modal');
    showCart()
}

function showCart(){
    cartItemsList.innerHTML = '';

    cart.forEach(item => {
        const cartItemElement = document.createElement('li');
        cartItemElement.innerHTML = `
            <span>${item.name} - Quantity: ${item.quantity} - Price: $${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>`;
        cartItemsList.appendChild(cartItemElement);

        const removeFromCartButton = cartItemElement.querySelector('.remove-from-cart-btn');
        const itemId = parseInt(removeFromCartButton.getAttribute('data-id'))
        removeFromCartButton.addEventListener('click', () => removeFromCart(itemId));
    });

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}


function removeFromCart(itemId){
    cart = cart.filter(item => item.id !== itemId);
    showCart()
    updateCartBadge()
}

function showPurchaseMessage(emptyCart){
    const purchase = document.createElement('p');
    purchase.classList.add('purchase');
    if(emptyCart == false)
        purchase.textContent = 'Your purchase was successful!';
    else
        purchase.textContent = 'Your cart is empty.'

    const modalContent = document.querySelector('.modal-content');
    modalContent.appendChild(purchase);

    modalClose.addEventListener('click', () => {
        if(modalContent.contains(purchase))
            modalContent.removeChild(purchase);
    })
    
}

function purchaseItems(){
    let emptyCart = true
    if(cart.length != 0){
        emptyCart = false
        cart = [];
        showCart();
        updateCartBadge();
    }
        
    showPurchaseMessage(emptyCart);
    
}

// Call fillItemsGrid function when page loads
fillItemsGrid(filteredItems);

function searchItem(){
    filteredItems = [];
    const searchTerm = searchInput.value.toLowerCase();
    filteredItems = items.filter(item => item.name.toLowerCase().startsWith(searchTerm));
    fillItemsGrid(filteredItems);
    
}

// Example of DOM methods for adding event handling
cartButton.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);

buyButton.addEventListener('click', purchaseItems);
searchInput.addEventListener('input', searchItem);