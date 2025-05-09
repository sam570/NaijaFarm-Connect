
// Product Database
const PRODUCTS = [
  { id: 1, name: 'Fresh Tomatoes', price: 1500, image: 'https://zeemart.shop/wp-content/uploads/2021/04/tomatoes-grade-B-600x600.jpg', category: 'vegetables' },
  { id: 2, name: 'Sweet Potatoes', price: 1100, image: 'https://gazettengr.com/wp-content/uploads/Sweet-potatoes.png', category: 'tubers' },
  { id: 3, name: 'Fresh Peppers (1 cup)', price: 650, image: 'https://duudafricanfoods.com/wp-content/uploads/2021/11/252544233_4402146329881711_7896566210039951318_n.jpg', category: 'vegetables' },
  { id: 4, name: 'Yam (1 tuber)', price: 1300, image: 'https://veggiegrow.ng/wp-content/uploads/2023/08/Yam-farming-in-Nigeria.jpeg', category: 'tubers' },
  { id: 5, name: 'Ogbono (1 rubber)', price: 3800, image: 'https://naijapackage.com/wp-content/uploads/2023/08/IMG_20230724_102809_856-jpg.webp', category: 'grains' },
  { id: 6, name: 'Palm Oil (1L)', price: 1200, image: 'https://img.tradeford.com/pimages/l/4/1022044.jpg', category: 'oils' },
  { id: 7, name: 'Oranges (1 dozen)', price: 2500, image: 'https://i.pinimg.com/736x/8c/d1/f2/8cd1f22c7cafbd84bad5a890cc371954.jpg', category: 'fruits' },
  { id: 8, name: 'Bananas (1 bunch)', price: 1800, image: 'https://thecounter.org/wp-content/uploads/2022/01/plantains-for-sale-in-Lagos-Nigeria-January-2022-1.jpg', category: 'fruits' },
  { id: 9, name: 'Beans (1kg)', price: 2200, image: 'https://i0.wp.com/www.africopanigeria.com/wp-content/uploads/2021/02/Copa-Agro-White-Beans-1.png?fit=600%2C600&ssl=1', category: 'grains' },
  { id: 10, name: 'Plantain (1 bunch)', price: 2000, image: 'https://24hoursmarket.com/wp-content/uploads/2020/06/1717914489588.jpg', category: 'fruits' },
  { id: 11, name: 'Onions (1kg)', price: 900, image: 'https://thumbs.dreamstime.com/b/close-up-onions-laid-out-roadside-kiosk-red-important-nutritious-vegetable-common-nigeria-lekki-lagos-west-africa-150856068.jpg', category: 'vegetables' },
  { id: 12, name: 'Groundnut Oil (1L)', price: 1500, image: 'https://gazettengr.com/wp-content/uploads/Cooking-Oil.png', category: 'oils' },
  { id: 13, name: 'Egusi (1kg)', price: 2800, image: 'https://wigmorewholesale.com/image/cache/wkseller/5767/Screenshot%202024-04-12%20173018-637x430.png', category: 'grains' },
  { id: 14, name: 'Olive Oil (1L)', price: 3500, image: 'https://www.interflon-tradingcompanyllc.com/upload/category/1595342691Olive-Oil.webp', category: 'oils' },
  { id: 15, name: 'Irish Potatoes (1kg)', price: 1700, image: 'https://media.premiumtimesng.com/wp-content/files/2014/08/Potatoes.jpg', category: 'tubers' }
];

// DOM Elements
const elements = {
  categoryTabs: document.querySelectorAll('.category-tab'),
  categorySections: document.querySelectorAll('.category-section'),
  cartBtn: document.getElementById('cart-btn'),
  cartModal: document.getElementById('cart-modal'),
  closeCartBtn: document.querySelector('.close-cart'),
  cartItemsContainer: document.querySelector('.cart-items'),
  cartCount: document.getElementById('cart-count'),
  cartTotal: document.getElementById('cart-total'),
  checkoutBtn: document.getElementById('checkout-btn'),
  featuredProductsContainer: document.querySelector('.featured-products-container'),
  productsGrid: document.querySelector('.products-grid')
};

// Shopping Cart State
let cart = {};

/**
 * Cart Management Functions
 */
const cartManager = {
  init() {
    this.loadCart();
    this.updateCartCount();
  },

  loadCart() {
    try {
      const storedCart = localStorage.getItem('naijafarm_cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Validate and clean cart data
        cart = {};
        Object.entries(parsedCart).forEach(([id, item]) => {
          const product = PRODUCTS.find(p => p.id == id);
          if (product && item.quantity > 0) {
            cart[id] = {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: Math.min(item.quantity, 10) // Limit quantity
            };
          }
        });
        this.saveCart(); // Save cleaned cart
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      cart = {};
      localStorage.removeItem('naijafarm_cart');
    }
  },

  saveCart() {
    try {
      localStorage.setItem('naijafarm_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  updateCartCount() {
    const count = Object.values(cart).reduce((acc, item) => acc + (item.quantity || 0), 0);
    if (elements.cartCount) {
      elements.cartCount.textContent = count;
    }
    if (elements.checkoutBtn) {
      elements.checkoutBtn.disabled = count === 0;
    }
  },

  calculateTotal() {
    return Object.values(cart).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  renderCart() {
    if (!elements.cartItemsContainer) return;
    
    elements.cartItemsContainer.innerHTML = '';
    
    if (Object.keys(cart).length === 0) {
      elements.cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      if (elements.cartTotal) elements.cartTotal.textContent = '0';
      if (elements.checkoutBtn) elements.checkoutBtn.disabled = true;
      return;
    }

    let total = 0;
    let hasValidItems = false;
    
    Object.entries(cart).forEach(([id, item]) => {
      // Only render valid items with all required properties
      if (item && item.id && item.name && item.price && item.quantity > 0) {
        total += item.price * item.quantity;
        hasValidItems = true;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.setAttribute('role', 'listitem');
        itemDiv.innerHTML = `
          <span>${item.name} × ${item.quantity}</span>
          <span>₦${(item.price * item.quantity).toLocaleString()}</span>
          <button class="btn-remove" aria-label="Remove ${item.name} from cart" data-id="${id}">&times;</button>
        `;
        elements.cartItemsContainer.appendChild(itemDiv);
      } else {
        // Remove invalid items
        delete cart[id];
      }
    });

    if (!hasValidItems) {
      this.clearCart();
      return;
    }
    
    if (elements.cartTotal) elements.cartTotal.textContent = total.toLocaleString();
    if (elements.checkoutBtn) elements.checkoutBtn.disabled = false;
  },

  addToCart(id) {
    const product = PRODUCTS.find(p => p.id == id);
    if (!product) {
      console.error('Product not found:', id);
      return;
    }

    if (cart[id]) {
      cart[id].quantity += 1;
    } else {
      cart[id] = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      };
    }
    
    this.saveCart();
    this.updateCartCount();
    this.showNotification(`${product.name} added to cart`);
  },

  removeFromCart(id) {
    if (cart[id]) {
      delete cart[id];
      this.saveCart();
      this.updateCartCount();
      this.renderCart();
    }
  },

  clearCart() {
    cart = {};
    this.saveCart();
    this.updateCartCount();
    this.renderCart();
  },

  showNotification(message) {
    // Remove any existing notifications first
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  }
};

/**
 * Product Display Functions
 */
const productDisplay = {
  init() {
    this.renderFeaturedProducts();
    if (elements.categoryTabs.length > 0) {
      this.renderProductsByCategory();
      this.setupCategoryTabs();
    }
  },

  createProductCard(product, isFeatured = false) {
    const card = document.createElement('article');
    card.className = isFeatured ? 'featured-product-card' : 'product-card';
    card.setAttribute('tabindex', '0');
    
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="${isFeatured ? 'featured-product-image' : 'product-image'}" loading="lazy" />
      <div class="${isFeatured ? 'featured-product-info' : 'product-info'}">
        <h4 class="${isFeatured ? '' : 'product-name'}">${product.name}</h4>
        <div class="${isFeatured ? 'featured-product-price' : 'product-price'}">₦${product.price.toLocaleString()}</div>
        <button class="btn-buy" aria-label="Add ${product.name} to cart" 
                data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
    return card;
  },

  renderFeaturedProducts() {
    if (!elements.featuredProductsContainer) return;
    
    // Display first 3 products as featured
    const featuredProducts = PRODUCTS.slice(0, 3);
    elements.featuredProductsContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
      const card = this.createProductCard(product, true);
      elements.featuredProductsContainer.appendChild(card);
    });
  },

  renderProductsByCategory() {
    const grids = {
      all: document.querySelector('#all-products .products-grid'),
      vegetables: document.querySelector('#vegetables .products-grid'),
      fruits: document.querySelector('#fruits .products-grid'),
      tubers: document.querySelector('#tubers .products-grid'),
      grains: document.querySelector('#grains .products-grid'),
      oils: document.querySelector('#oils .products-grid')
    };
    
    // Clear all grids
    Object.values(grids).forEach(grid => grid && (grid.innerHTML = ''));
    
    // Render products in their respective categories
    PRODUCTS.forEach(product => {
      const card = this.createProductCard(product);
      if (grids.all) grids.all.appendChild(card.cloneNode(true));
      if (grids[product.category]) grids[product.category].appendChild(card);
    });
  },

  switchCategory(category) {
    elements.categoryTabs.forEach(tab => {
      const isActive = tab.dataset.category === category;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });
    
    elements.categorySections.forEach(section => {
      const shouldShow = section.id === category || (category === 'all' && section.id === 'all-products');
      section.classList.toggle('active', shouldShow);
      section.hidden = !shouldShow;
    });
  },

  setupCategoryTabs() {
    elements.categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchCategory(tab.dataset.category));
    });
  }
};

/**
 * Event Handlers
 */
const eventHandlers = {
  setup() {
    // Add to cart buttons (using event delegation)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-buy')) {
        const id = e.target.dataset.id;
        cartManager.addToCart(id);
      }
      
      if (e.target.classList.contains('btn-remove')) {
        cartManager.removeFromCart(e.target.dataset.id);
      }
    });
    
    // Cart modal
    if (elements.cartBtn) {
      elements.cartBtn.addEventListener('click', () => {
        cartManager.renderCart();
        elements.cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
    
    if (elements.closeCartBtn) {
      elements.closeCartBtn.addEventListener('click', () => {
        elements.cartModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Checkout
    if (elements.checkoutBtn) {
      elements.checkoutBtn.addEventListener('click', () => {
        // Validate cart before checkout
        const validCart = {};
        Object.entries(cart).forEach(([id, item]) => {
          if (item && item.id && item.name && item.price && item.quantity > 0) {
            validCart[id] = item;
          }
        });
        
        if (Object.keys(validCart).length === 0) {
          cartManager.showNotification('Your cart is empty');
          return;
        }
        
        const total = cartManager.calculateTotal();
        localStorage.setItem('checkout_items', JSON.stringify(validCart));
        localStorage.setItem('checkout_total', total);
        window.location.href = 'checkout.html';
      });
    }
    
    // Close modal when clicking outside
    if (elements.cartModal) {
      elements.cartModal.addEventListener('click', (e) => {
        if (e.target === elements.cartModal) {
          elements.cartModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.cartModal && elements.cartModal.classList.contains('active')) {
        elements.cartModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
};

/**
 * Initialize Application
 */
function init() {
  // Clear any corrupted cart data first
  if (localStorage.getItem('naijafarm_cart')) {
    try {
      JSON.parse(localStorage.getItem('naijafarm_cart'));
    } catch (e) {
      localStorage.removeItem('naijafarm_cart');
    }
  }
  
  cartManager.init();
  productDisplay.init();
  eventHandlers.setup();
}

document.addEventListener('DOMContentLoaded', init);