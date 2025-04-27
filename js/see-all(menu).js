document.addEventListener('DOMContentLoaded', function() {
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Toggle menu and hamburger icon active state when clicked
    hamburgerIcon.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnHamburger = hamburgerIcon.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburgerIcon.classList.remove('active');
        }
    });
    
    // Close menu when clicking on a menu item
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            hamburgerIcon.classList.remove('active');
        });
    });
});



// Shopping Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartToggle = document.querySelector('.cart-toggle');
    const cartContainer = document.querySelector('.cart-container');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartBadge = document.querySelector('.cart-badge');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const orderForm = document.querySelector('.order-form');
    const closeForm = document.querySelector('.close-form');
    const summaryItems = document.querySelector('.summary-items');
    const summaryTotalAmount = document.querySelector('.summary-total-amount');
    const checkoutForm = document.getElementById('checkout-form');
                
    let cart = [];
    
    // Open/Close Cart
    cartToggle.addEventListener('click', function() {
        cartContainer.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartContainer.classList.remove('active');
    });
    
    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item is already in cart
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Animation feedback
            this.textContent = 'Added!';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 1000);
        });
    });
                
    // Update cart display
    function updateCart() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            cartTotal.textContent = 'Total: ₱ 0.00';
            cartBadge.textContent = '0';
            return;
        }
        
        let totalAmount = 0;
        let totalItems = 0;
        cartItems.innerHTML = '';
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            totalItems += item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
            <div class="cart-item-details">
                <div>${item.name}</div>
                <div>₱ ${item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="decrease-quantity" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">×</button>
            `;
            cartItems.appendChild(itemElement);
        });
        
        cartTotal.textContent = `Total: ₱ ${totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        cartBadge.textContent = totalItems;
        
        // Add event listeners for quantity buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
                    
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCart();
            });
        });
            
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
        
    // Checkout functionality
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checkout.');
            return;
        }
        
        // Update order summary
        let totalAmount = 0;
        summaryItems.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>₱ ${itemTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            `;
            summaryItems.appendChild(itemElement);
        });
        
        summaryTotalAmount.textContent = `₱ ${totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Display order form
        orderForm.style.display = 'flex';
    });
        
    // Close order form
    closeForm.addEventListener('click', function() {
        orderForm.style.display = 'none';
    });
    
    // Submit order
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Normally this would send the order to a server
        // For demo purposes, we'll just show a confirmation
        alert('Thank you for your order! Your food will be delivered soon.');
        
        // Clear cart and close forms
        cart = [];
        updateCart();
        orderForm.style.display = 'none';
        cartContainer.classList.remove('active');
    });
});
