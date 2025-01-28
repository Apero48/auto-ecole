let cart = [];

class CartItem {
    constructor(id, name, price, quantity = 1, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
    }
}

function toggleCart() {
    const cartPanel = document.querySelector('.cart-panel');
    const overlay = document.querySelector('.cart-overlay');
    
    if (!cartPanel.classList.contains('active')) {
        cartPanel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartPanel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(new CartItem(id, name, price, 1, image));
    }
    
    updateCart();
    showNotification('Produit ajouté au panier');
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        const itemElement = document.querySelector(`[data-cart-item="${id}"]`);
        itemElement.classList.add('remove-animation');
        
        setTimeout(() => {
            cart.splice(index, 1);
            updateCart();
        }, 300);
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
                <button class="btn continue-shopping" onclick="toggleCart()">
                    Continuer vos achats
                </button>
            </div>
        `;
        checkoutBtn.style.display = 'none';
    } else {
        checkoutBtn.style.display = 'block';
        
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.dataset.cartItem = item.id;
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">${item.price}€</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <p class="subtotal">Sous-total: ${subtotal}€</p>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(itemElement);
        });
    }
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.innerHTML = `
        <div class="cart-summary">
            <div class="summary-line">
                <span>Sous-total:</span>
                <span>${total}€</span>
            </div>
            <div class="summary-line">
                <span>Livraison:</span>
                <span>${total >= 500 ? 'Gratuite' : '30€'}</span>
            </div>
            <div class="summary-line total">
                <span>Total:</span>
                <span>${total >= 500 ? total : total + 30}€</span>
            </div>
        </div>
    `;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide');
        return;
    }
    
    // Simulation de paiement
    showNotification('Redirection vers le paiement...');
    // Ici, vous ajouteriez la logique de paiement réelle
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', toggleCart);
    
    // Ajout des écouteurs d'événements aux boutons
    const buttons = document.querySelectorAll('.btn:not(.checkout-btn):not(.continue-shopping)');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = button.closest('.product-card, .promo-card');
            const id = card.dataset.productId || Math.random().toString(36).substr(2, 9);
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('p:last-of-type').textContent || 
                            card.querySelector('.promo-price').textContent;
            const price = parseFloat(priceText.match(/\d+/)[0]);
            const image = card.querySelector('img').src;
            
            addToCart(id, name, price, image);
        });
    });
});

