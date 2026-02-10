// State Management
let cart = JSON.parse(localStorage.getItem('kamfish_cart')) || [];
const WA_NUMBER = "6285850312500"; 

// Formatting Utils
const formatCurrency = (amount) => {
    // Check if amount is a range string (e.g. "100000-500000")
    if (typeof amount === 'string' && amount.includes('-')) {
        const [min, max] = amount.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });
            return `${formatter.format(min)} - ${formatter.format(max)}`;
        }
        return amount; // Return as is if parsing fails
    }
    
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Cart Functions
const saveCart = () => {
    localStorage.setItem('kamfish_cart', JSON.stringify(cart));
};

const addToCart = (productId, redirect = false) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    
    if (redirect) {
        window.location.href = 'cart.html';
    } else {
         window.location.href = 'cart.html'; 
    }
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
};

// UI Functions
const renderProductCard = (product) => {
    return `
        <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'" style="cursor: pointer;">
            <div class="product-badges">
                ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
                <span class="badge" style="background: var(--accent); color: white;">Ready</span>
            </div>
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-category">${product.category} - ${product.subcategory || ''}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${formatCurrency(product.price)}</div>
                
                <div style="display: flex; gap: 5px; margin-bottom: 15px; flex-wrap: wrap;">
                    <span class="badge" style="background: rgba(255,255,255,0.1); font-size: 0.7rem;">${product.age}</span>
                    <span class="badge" style="background: rgba(255,255,255,0.1); font-size: 0.7rem;">Size: ${product.size}</span>
                </div>

                <div class="product-actions">
                    <button class="btn-add-cart" onclick="event.stopPropagation(); window.open('https://wa.me/6285850312500?text=Halo admin, saya tertarik dengan ${encodeURIComponent(product.name)}', '_blank')">
                        Hubungi Sekarang 💬
                    </button>
                </div>
            </div>
        </div>
    `;
};

const renderFeaturedProducts = () => {
    const container = document.getElementById('featured-products');
    if (!container) return;
    const featured = products.slice(0, 4);
    container.innerHTML = featured.map(p => renderProductCard(p)).join('');
};

const renderCatalog = () => {
    const container = document.getElementById('catalog-grid');
    if (!container) return;
    
    // Bento Grid Layout: 
    // Item 1 | Banner (Span 3) | Item 2
    // Item 3 ...
    
    // We need to render:
    // 1. Product[0]
    // 2. Banner
    // 3. Product[1]
    // 4. Product[2]...[26]

    if (products.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Belum ada produk.</p>';
        return;
    }

    let html = '';
    
    // 1. First Product
    if (products[0]) html += createShopCard(products[0]);
    
    // 2. Banner
    html += `
        <div class="promo-banner">
            <div class="promo-content">
                <div class="promo-title">Premium</div>
                <div class="promo-subtitle">Selection</div>
                <button class="btn-gold" onclick="window.location.reload()">View All ✨</button>
            </div>
        </div>
    `;
    
    // 3. Remaining Products
    // We want to skip product[0] since we rendered it.
    // We also used "Item 2" as visual flanker. So technically product[1] is the right flanker.
    
    for (let i = 1; i < products.length; i++) {
        html += createShopCard(products[i]);
    }

    container.innerHTML = html;
};

const createShopCard = (product) => {
    return `
        <div class="shop-card" onclick="window.location.href='product.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" class="shop-card-img" loading="lazy">
            <div class="shop-card-body">
                <h3 class="shop-card-title">${product.name}</h3>
                <div class="shop-card-sub">${product.category}</div>
            </div>
        </div>
    `;
};

const renderProductDetail = () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = products.find(p => p.id === id);
    
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    if (!product) {
        container.innerHTML = '<h2>Product not found</h2>';
        return;
    }

    document.title = `${product.name} - Kamfish Betta`;
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; align-items: start;">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div>
                <span style="color: var(--primary); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">${product.category}</span>
                <h1 style="color: #fff; font-size: 2.5rem; margin: 10px 0;">${product.name}</h1>
                <div style="font-size: 2rem; color: var(--primary); font-weight: 700; margin-bottom: 20px;">${formatCurrency(product.price)}</div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <div><strong>Usia:</strong> ${product.age}</div>
                    <div><strong>Ukuran:</strong> ${product.size}</div>
                    <div><strong>Warna:</strong> ${product.color}</div>
                    <div><strong>Subkategori:</strong> ${product.subcategory || '-'}</div>
                </div>

                <p style="color: var(--text-muted); margin-bottom: 30px; line-height: 1.8;">${product.description}</p>
                
                <div style="display: flex; gap: 15px;">
                    <a href="https://wa.me/${WA_NUMBER}?text=Halo, saya mau tanya tentang ${product.name}..." target="_blank" class="btn btn-outline" style="flex: 1; text-align: center; justify-content: center;">Tanya via WA 💬</a>
                </div>
            </div>
        </div>
    `;
};

const renderCartItems = () => {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container || !totalEl) return;
    
    // Apply White Background Mode to Body if on Cart Page
    document.body.classList.add('checkout-page');

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 40px;">Keranjang belanja kosong.</p>';
        totalEl.textContent = formatCurrency(0);
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div style="display: flex; gap: 15px; align-items: center; background: #fff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="color: #1F2933; margin-bottom: 5px;">${item.name}</h4>
                    <div style="color: var(--primary); font-size: 0.9rem;">${formatCurrency(item.price)} x ${item.quantity}</div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff4444; cursor: pointer;">🗑️</button>
            </div>
        `;
    }).join('');
    
    // Calculate total including simple logic if needed, here just product sum
    totalEl.textContent = formatCurrency(total);
    totalEl.style.color = '#1F2933';
};

// Checkout Logic
const checkout = () => {
    if (cart.length === 0) {
        alert("Keranjang kosong!");
        return;
    }

    let message = "Halo Admin Kamfish Betta, saya ingin order:\n\n";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        message += `- ${item.name} (${item.quantity}x) = ${formatCurrency(subtotal)}\n`;
        total += subtotal;
    });

    message += `\nTotal: ${formatCurrency(total)}\n\nMohon info ongkir dan nomor rekening. Terima kasih!`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// Gallery Functions
const renderGallerySection = () => {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    // Specific Gallery Items (6 Images + 4 Videos)
    const galleryItems = [
        { type: 'image', src: 'images/g1.jpeg', caption: 'Premium Collection 1' },
        { type: 'image', src: 'images/g2.jpeg', caption: 'Premium Collection 2' },
        { type: 'image', src: 'images/g3.jpeg', caption: 'Premium Collection 3' },
        { type: 'image', src: 'images/g4.jpeg', caption: 'Premium Collection 4' },
        { type: 'image', src: 'images/g5.jpeg', caption: 'Premium Collection 5' },
        { type: 'image', src: 'images/g6.jpeg', caption: 'Premium Collection 6' },
        { type: 'video', src: 'images/g7.mp4', caption: 'Premium Showcase 1' },
        { type: 'video', src: 'images/g8.mp4', caption: 'Premium Showcase 2' },
        { type: 'video', src: 'images/g9.mp4', caption: 'Premium Showcase 3' },
        { type: 'video', src: 'images/g10.mp4', caption: 'Premium Showcase 4' }
    ];

    container.innerHTML = galleryItems.map(item => {
        if (item.type === 'video') {
            return `
                <div class="masonry-item" onclick="openLightbox('${item.type}', '${item.src}', '${item.caption}')">
                    <video src="${item.src}" autoplay muted loop playsinline style="width: 100%; border-radius: 12px; display: block;"></video>
                    <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.5); color: #fff; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem;">
                        ▶ Video
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="masonry-item" onclick="openLightbox('${item.type}', '${item.src}', '${item.caption}')">
                    <img src="${item.src}" alt="${item.caption}" loading="lazy">
                </div>
            `;
        }
    }).join('');
};

const openLightbox = (type, src, caption) => {
    const modal = document.getElementById('lightbox');
    const modalImg = document.getElementById('lightbox-img');
    const modalVideo = document.getElementById('lightbox-video');
    const captionText = document.getElementById('lightbox-caption');
    
    if (modal && captionText) {
        modal.style.display = "flex";
        captionText.innerHTML = caption;
        
        if (type === 'video' && modalVideo) {
            modalImg.style.display = "none";
            modalVideo.style.display = "block";
            modalVideo.src = src;
            modalVideo.play();
        } else if (modalImg) {
            modalVideo.style.display = "none";
            modalImg.style.display = "block";
            modalImg.src = src;
            // Pause video just in case
            modalVideo.pause();
        }
    }
};

const closeLightbox = () => {
    const modal = document.getElementById('lightbox');
    const modalVideo = document.getElementById('lightbox-video');
    
    if (modal) {
        modal.style.display = "none";
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
    }
};

// Close lightbox when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('lightbox');
    const modalVideo = document.getElementById('lightbox-video');
    if (event.target == modal) {
        modal.style.display = "none";
        if (modalVideo) {
            modalVideo.pause();
        }
    }
}

// Make functions available globally for inline onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.renderGallerySection = renderGallerySection;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    
    // Page routing simple check
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('kamfish%20betta/')) {
        renderFeaturedProducts();
        renderGallerySection();
    } else if (window.location.pathname.includes('shop.html')) {
        renderCatalog();
        

    } else if (window.location.pathname.includes('product.html')) {
        renderProductDetail();
    } else if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
    
    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
