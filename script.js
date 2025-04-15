// بيانات المنتجات
const products = [
    {
        name: "Romance",
        price: "250 ج",
        image: "imagesm/Romance.jpg",
        alt: "Romance Perfume",
        category: "عطور"
    },
    {
        name: "Lete",
        price: "300 ج",
        image: "imagesm/lete.jpg",
        alt: "Lete Perfume",
        category: "عطور"
    },
    {
        name: "Magic Black",
        price: "350 ج",
        image: "imagesm/magic_black.jpg",
        alt: "Magic Black Perfume",
        category: "عطور"
    },
    {
        name: "Green",
        price: "200 ج",
        image: "imagesm/green.jpg",
        alt: "Green Detergent",
        category: "منظفات"
    },
    {
        name: "Tender",
        price: "210 ج",
        image: "imagesm/tender.jpg",
        alt: "Tender Detergent",
        category: "منظفات"
    },
    {
        name: "تندر",
        price: "210 ج",
        image: "imagesm/تندر.jpeg",
        alt: "تندر",
        category: "منظفات"
    },
    {
        name: "جميلة كريم ماء الورد",
        price: "150 ج",
        image: "imagesm/jameela.jpg",
        alt: "جميلة كريم ماء الورد",
        category: "عناية بالبشرة"
    },
    {
        name: "Glow",
        price: "400 ج",
        image: "imagesm/glow.jpg",
        alt: "Glow Perfume",
        category: "عطور"
    },
    {
        name: "Funny",
        price: "280 ج",
        image: "imagesm/funny.jpg",
        alt: "Funny Perfume",
        category: "عطور"
    },
    {
        name: "البحر الأحمر",
        price: "320 ج",
        image: "imagesm/cool_extreme.jpg",
        alt: "البحر الأحمر Perfume",
        category: "عطور"
    },
    {
        name: "أودو برفان زد (رجالي)",
        price: "280 ج",
        image: "imagesm/أودو برفان زد (رجالي).jpg",
        alt: "عطر رجالي",
        category: "عطور رجالية"
    },
    {
        name: "أودو برفان إكسبلوجن",
        price: "285 ج",
        image: "imagesm/أودو_برفان_إكسبلوجن.jpg",
        alt: "عطر رجالي",
        category: "عطور رجالية"
    },
    {
        name: "عبير الزهرة البرية",
        price: "260 ج",
        image: "imagesm/عبير_الزهرة_البرية.jpg",
        alt: "عطر نسائي",
        category: "عطور نسائية"
    },
    {
        name: "برفان",
        price: "270 ج",
        image: "imagesm/برفان.jpg",
        alt: "عطر",
        category: "عطور"
    },
    {
        name: "برفان مميز",
        price: "290 ج",
        image: "imagesm/برفان (4).jpg",
        alt: "عطر مميز",
        category: "عطور"
    },
    {
        name: "برفين",
        price: "275 ج",
        image: "imagesm/برفين.jpg",
        alt: "عطر فاخر",
        category: "عطور"
    },
    {
        name: "أودو برفان كافتيريا",
        price: "265 ج",
        image: "imagesm/أودو_برفان_كافتيريا.jpg",
        alt: "عطر مميز",
        category: "عطور"
    },
    {
        name: "اودو برفان بوم رجالي",
        price: "320 ج",
        image: "imagesm/اودو_برفان_بوم_رجالي.jpg",
        alt: "عطر رجالي",
        category: "عطور رجالية"
    },
    {
        name: "اوذوبرفان",
        price: "290 ج",
        image: "imagesm/اوذوبرفان.jpeg",
        alt: "عطر",
        category: "عطور"
    },
    {
        name: "Z Perfume",
        price: "330 ج",
        image: "imagesm/z_perfume.jpg",
        alt: "Z Perfume",
        category: "عطور"
    },
    {
        name: "شور العود",
        price: "350 ج",
        image: "imagesm/شور_العود.jpg",
        alt: "عطر العود",
        category: "عطور فاخرة"
    },
    {
        name: "Magic Care Oil",
        price: "180 ج",
        image: "imagesm/magic_care_oil.jpg",
        alt: "زيت العناية السحري",
        category: "زيوت طبيعية"
    },
    {
        name: "فيجي تار",
        price: "90 ج",
        image: "imagesm/فيجي_تار.jpg",
        alt: "فيجي تار",
        category: "أطعمة"
    },
    {
        name: "مافن",
        price: "60 ج",
        image: "imagesm/مافن.jpg",
        alt: "مافن",
        category: "حلويات"
    },
    {
        name: "فيجي تار حار",
        price: "90 ج",
        image: "imagesm/فيجي_تار_حار.jpg",
        alt: "فيجي تار حار",
        category: "أطعمة"
    },
    {
        name: "بسبوسه جوز هند",
        price: "45 ج",
        image: "imagesm/بسبوسه_جوز هند.jpg",
        alt: "بسبوسه بجوز الهند",
        category: "حلويات"
    },
    {
        name: "اللهلوبة",
        price: "80 ج",
        image: "imagesm/اللهلوبة.jpg",
        alt: "اللهلوبة",
        category: "أطعمة"
    },
    {
        name: "Lete Premium",
        price: "330 ج",
        image: "imagesm/letep.jpg",
        alt: "Lete Premium",
        category: "عطور"
    },
    {
        name: "كاسترد موز",
        price: "50 ج",
        image: "imagesm/كاسترد_موز.jpeg",
        alt: "كاسترد بنكهة الموز",
        category: "حلويات"
    },
    {
        name: "كاسترد شكولاته",
        price: "55 ج",
        image: "imagesm/كاسترد_شكولاته.jpeg",
        alt: "كاسترد بنكهة الشكولاته",
        category: "حلويات"
    },
    {
        name: "كاسترد عادي",
        price: "45 ج",
        image: "imagesm/كاسترد.jpeg",
        alt: "كاسترد",
        category: "حلويات"
    },
    {
        name: "أم علي",
        price: "65 ج",
        image: "imagesm/ام_علي.jpeg",
        alt: "أم علي",
        category: "حلويات شرقية"
    },
    {
        name: "بسبوسا",
        price: "40 ج",
        image: "imagesm/بسبوسا.jpeg",
        alt: "بسبوسا",
        category: "حلويات شرقية"
    },
    {
        name: "خلطة المحشي",
        price: "30 ج",
        image: "imagesm/خلطة المحشي.jpeg",
        alt: "خلطة المحشي",
        category: "توابل وبهارات"
    }
];

// دالة إنشاء بطاقات المنتجات
function createProductCards(productsArray, page = 1) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    const itemsPerPage = 16; // Updated to display 16 products per page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productsArray.slice(startIndex, endIndex);

    if (paginatedProducts.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><h4>لا توجد منتجات مطابقة للبحث</h4></div>';
        return;
    }

    paginatedProducts.forEach(product => {
        const card = `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4"> <!-- Adjusted column size -->
                <div class="card h-100">
                    <div class="card-img-wrapper">
                        <img src="${product.image}" class="card-img-top product-img" alt="${product.alt}" loading="lazy">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title h5">${product.name}</h3>
                        <p class="text-success"><strong>السعر:</strong> ${product.price}</p>
                        <button class="btn btn-primary btn-sm add-to-cart-btn" 
                            onclick="event.stopPropagation(); addToCart('${product.name}', '${product.price}', '${product.image}', '${product.alt}', '${product.category}')">
                            <i class="fas fa-cart-plus"></i> إضافة إلى السلة
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });

    // Add zoom effect event listeners
    const cards = container.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove 'zoomed' class from any other card that might be zoomed
            cards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('zoomed')) {
                    otherCard.classList.remove('zoomed');
                }
            });
            card.classList.toggle('zoomed');
        });
    });

    // Remove zoom on scroll
    window.addEventListener('scroll', () => {
        cards.forEach(card => {
            card.classList.remove('zoomed');
        });
    });

    createPagination(productsArray.length, itemsPerPage, page);
}

// دالة لإنشاء أزرار التصفح
function createPagination(totalItems, itemsPerPage, currentPage) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} mx-1`;
        button.textContent = i;
        button.addEventListener('click', () => createProductCards(products, i));
        paginationContainer.appendChild(button);
    }
}

// تحسين دالة البحث
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    updateURL(searchTerm);

    const filtered = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category.toLowerCase().includes(searchTerm);
        return nameMatch || categoryMatch;
    });

    createProductCards(filtered);
});

// تحديث عنوان URL
function updateURL(searchTerm) {
    const state = { search: searchTerm };
    const title = searchTerm ? `نتائج البحث عن: ${searchTerm} - MY WAY` : "MY WAY - متجر الأسماك والجمبري الطازج";
    const url = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : window.location.pathname;
    
    history.pushState(state, title, url);
    document.title = title;
}

// دالة لإنشاء دلافين إضافية بشكل عشوائي
function createRandomDolphins() {
    const waterSurface = document.querySelector('.water-surface');
    const dolphinCount = Math.floor(Math.random() * 2) + 1; // 1-2 دلافين إضافية
    
    for(let i = 0; i < dolphinCount; i++) {
        const dolphin = document.createElement('div');
        const delay = Math.random() * 5;
        const left = Math.random() * 70 + 10;
        
        dolphin.className = 'dolphin';
        dolphin.style.left = `${left}%`;
        dolphin.style.animationDelay = `${delay}s`;
        
        waterSurface.appendChild(dolphin);
        
        // إزالة الدلفين بعد انتهاء الحركة
        setTimeout(() => {
            dolphin.remove();
        }, 8000 + (delay * 1000));
    }
    
    setTimeout(createRandomDolphins, 10000);
}

// دالة لإنشاء خلفية الأسماك المتحركة
function initFishBackground() {
    const fishContainer = document.getElementById('fishContainer');
    const fishTypes = ['fish-1', 'fish-2', 'fish-3', 'shark'];
    
    // إنشاء الأسماك
    for (let i = 0; i < 8; i++) {
        createFish();
    }
    
    // إنشاء الفقاعات
    setInterval(createBubble, 800);
    
    function createFish() {
        const fish = document.createElement('div');
        const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        const size = Math.random() * 0.7 + 0.5;
        const duration = Math.random() * 40 + 30;
        const delay = Math.random() * 30;
        const top = Math.random() * 80 + 10;
        
        fish.className = `fish ${fishType}`;
        fish.style.top = `${top}%`;
        fish.style.left = `${Math.random() * 100}%`;
        fish.style.transform = `scale(${size})`;
        fish.style.animationName = Math.random() > 0.5 ? 'swim' : 'swim-reverse';
        fish.style.animationDuration = `${duration}s`;
        fish.style.animationDelay = `-${delay}s`;
        
        fishContainer.appendChild(fish);
    }
    
    function createBubble() {
        const bubble = document.createElement('div');
        const left = Math.random() * 100;
        const size = Math.random() * 10 + 5;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        bubble.className = 'bubble';
        bubble.style.left = `${left}%`;
        bubble.style.bottom = '0';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `-${delay}s`;
        
        fishContainer.appendChild(bubble);
        
        // إزالة الفقاعة بعد انتهاء الحركة
        setTimeout(() => {
            bubble.remove();
        }, duration * 1000);
    }
}

// تهيئة أولية
document.addEventListener('DOMContentLoaded', function() {
    // عرض المنتجات
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
        document.getElementById('searchInput').value = searchParam;
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
            product.category.toLowerCase().includes(searchParam.toLowerCase())
        );
        createProductCards(filtered);
    } else {
        createProductCards(products);
    }
    
    // تحديث سنة حقوق النشر
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // بدء خلفية الأسماك المتحركة
    initFishBackground();
    
    // بدء حركة الدلافين بعد تأخير
    setTimeout(createRandomDolphins, 5000);
});

const cart = [];

function addToCart(name, price, image, alt, category) {
    const product = {
        name: name,
        price: price,
        image: image,
        alt: alt,
        category: category
    };
    
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ 
            ...product, 
            quantity: 1 
        });
    }
    updateCartUI();
    showAddToCartAnimation(image);
    showNotification(name, price, image);
}

function updateCartUI() {
    const cartContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="text-center p-4">سلة المشتريات فارغة</div>';
    } else {
        const cartItems = cart.map(item => createCartItemHTML(item)).join('');
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(' ج', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        cartContainer.innerHTML = `
            ${cartItems}
            <div class="cart-total">
                <span>الإجمالي:</span>
                <span>${total.toFixed(2)} ج</span>
            </div>
        `;
    }
    
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function createCartItemHTML(item) {
    return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.alt}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <textarea class="form-control" placeholder="أضف ملاحظاتك..." rows="2" 
                    oninput="updateNotes('${item.name}', this.value)">${item.note || ''}</textarea>
                <button class="btn btn-sm btn-danger mt-2" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash-alt"></i> إزالة
                </button>
            </div>
        </div>
    `;
}

function updateQuantity(productName, change) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity = Math.max(1, product.quantity + change);
        updateCartUI();
    }
}

function removeFromCart(productName) {
    const productIndex = cart.findIndex(item => item.name === productName);
    if (productIndex !== -1) {
        cart.splice(productIndex, 1); // إزالة المنتج من السلة
    }
    updateCartUI(); // تحديث واجهة المستخدم بعد الإزالة
}

function updateNotes(productName, note) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.note = note;
    }
}

function showAddToCartAnimation(imageSrc) {
    const animationElement = document.createElement('img');
    animationElement.src = imageSrc;
    animationElement.className = 'add-to-cart-animation';

    // Use event parameter explicitly
    document.addEventListener('click', (event) => {
        animationElement.style.top = `${event.clientY}px`;
        animationElement.style.left = `${event.clientX}px`;
    });

    document.body.appendChild(animationElement);

    animationElement.addEventListener('animationend', () => {
        animationElement.remove();
    });
}

function toggleCart() {
    const cartContainer = document.getElementById('cartContainer');
    cartContainer.style.display = cartContainer.style.display === 'none' || cartContainer.style.display === '' ? 'block' : 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('سلة المشتريات فارغة!');
        return;
    }

    let message = 'مرحباً، أريد إتمام الطلب التالي:\n';
    cart.forEach(item => {
        message += `- ${item.name} (الكمية: ${item.quantity})\n`;
        if (item.note) {
            message += `  ملاحظة: ${item.note}\n`;
        }
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/201158084424?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// دالة إظهار إشعار عند إضافة منتج للسلة
function showNotification(productName, price, image) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    
    // إضافة محتوى الإشعار
    notification.innerHTML = `
        <div class="notification-content">
            <img src="${image}" alt="${productName}" class="notification-image">
            <div class="notification-text">
                <div class="notification-title">تمت الإضافة إلى السلة</div>
                <div class="notification-product">${productName}</div>
                <div class="notification-price">${price}</div>
            </div>
            <button class="notification-close" onclick="this.parentNode.parentNode.remove();">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // إضافة أنماط CSS للإشعار إذا لم تكن موجودة
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .cart-notification {
                position: fixed;
                top: 20px;
                left: 20px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                max-width: 350px;
                overflow: hidden;
                animation: slide-in 0.3s ease-out forwards, fade-out 0.3s ease-in forwards 5s;
            }
            
            .notification-content {
                display: flex;
                padding: 15px;
                align-items: center;
            }
            
            .notification-image {
                width: 50px;
                height: 50px;
                object-fit: cover;
                border-radius: 4px;
                margin-left: 10px;
            }
            
            .notification-text {
                flex-grow: 1;
                margin: 0 10px;
            }
            
            .notification-title {
                font-weight: bold;
                color: #28a745;
                margin-bottom: 3px;
            }
            
            .notification-product {
                font-size: 0.9rem;
            }
            
            .notification-price {
                font-weight: bold;
                color: #495057;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #6c757d;
                padding: 5px;
                font-size: 1rem;
            }
            
            .notification-close:hover {
                color: #dc3545;
            }
            
            @keyframes slide-in {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes fade-out {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // إزالة الإشعار بعد 5 ثوانٍ
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.addEventListener('animationend', function(e) {
                if (e.animationName === 'fade-out') {
                    notification.remove();
                }
            });
        }
    }, 5000);
} 