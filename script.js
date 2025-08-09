// ================================
//      أسواق الشادر - سكريبت رئيسي
// ================================

// ================================
// 1. تعريف المتغيرات وعناصر الـ DOM
// ================================
const productContainer = document.getElementById('product-container');
const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('search-products');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout');
const closeBtn = document.querySelector('.close');

// عناصر قائمة الجوال
const menuToggle = document.querySelector('.main-menu-toggle');
const mainMenu = document.querySelector('.main-menu');
const menuItems = document.querySelectorAll('#main-menu li a');

// ================================
// 2. متغيرات السلة والمنتجات
// ================================
let cart = [];
// استرجاع السلة من localStorage إذا وجدت
if (localStorage.getItem('cart')) {
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) {
    cart = [];
  }
}
let products = [];
let currentPage = 1;
const productsPerPage = 15;
let totalPages = 1;
let currentProducts = [];

// ================================
// 3. متغيرات التحديث التلقائي
// ================================
let autoUpdateInterval;
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 دقائق

// ================================
// 4. متغيرات الهيدر
// ================================
let lastScrollTop = 0;
const header = document.querySelector('header');
const headerHeight = header.offsetHeight;
const scrollThreshold = 50;

// ================================
// 5. الفئات (من الإعدادات)
// ================================
const categories = (() => {
  const fromSettings = (window.APP_SETTINGS && Array.isArray(window.APP_SETTINGS.CATEGORIES))
    ? window.APP_SETTINGS.CATEGORIES.map(c => ({ value: String(c.key), label: String(c.label) }))
    : [
        { value: "fruits", label: "قسم الفواكه" },
        { value: "vegetables", label: "قسم الخضراوات" },
        { value: "packaged", label: "قسم الخضار المتوضب" }
      ];
  return [{ value: 'all', label: 'جميع المنتجات' }, ...fromSettings];
})();

// ================================
// 6. أحداث تحميل الصفحة
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // إضافة كلاس للجسم إذا كان الجهاز يدعم اللمس
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
    // تحميل المنتجات
    loadProducts();
    // تعبئة الفئات
    populateCategoryFilter();
    // تفعيل الأحداث
    setupEventListeners();
    handleMobileMenu();
    setActiveNavItem();
    // تحميل الصور ببطء
    lazyLoadImages();
    // تحديث التخطيط عند تغيير الاتجاه
    window.addEventListener('orientationchange', () => {
        setTimeout(() => { updateLayoutOnOrientationChange(); }, 200);
    });
    // مراقبة التمرير للهيدر
    window.addEventListener('scroll', debounce(handleHeaderOnScroll, 10));
    window.addEventListener('resize', debounce(handleHeaderOnScroll, 100));
    handleHeaderOnScroll();
    // منع تأخير اللمس
    document.addEventListener('touchstart', function() {}, {passive: true});
    // بدء التحديث التلقائي
    startAutoUpdate();
    // تحميل العروض اليومية
    setTimeout(renderDailyOffers, 1000);
});

// ================================
// 7. جلب وعرض العروض اليومية
// ================================
// جلب العروض اليومية من Google Sheets
async function fetchDailyOffersFromSheet() {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSIZwSkyV0UN7M8KtUa6Mp-K9eeAU-wR_O0A2dPkDZx4ahcII7wBR_mXR5Lwxq5J96QccBmnW-LTRcc/pub?output=csv';
    const res = await fetch(url);
    const csv = await res.text();
    const lines = csv.split('\n').filter(line => line.trim().length > 0);
    const header = lines[0].split(',');
    const data = lines.slice(1).map(line => line.split(','));
    // تحويل البيانات لكائنات عروض
    return data.map(cols => {
        while (cols.length > header.length) {
            cols[header.length - 1] += ',' + cols.pop();
        }
        const [id, name, image, price, weight] = cols;
        return {
            id: id ? Number(id) : undefined,
            name: name || '',
            image: image && image.startsWith('http') ? image : '',
            price: price ? Number(price) : '',
            weight: weight || ''
        };
    }).filter(offer => offer.name);
}

// عرض العروض اليومية
async function renderDailyOffers() {
    const dailyOffersContainer = document.getElementById('daily-offers-container');
    if (!dailyOffersContainer) return;
    
    // إنشاء عنصر التحميل بشكل آمن
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-spinner';
    const spinnerIcon = document.createElement('i');
    spinnerIcon.className = 'fas fa-spinner fa-spin';
    const loadingText = document.createElement('span');
    loadingText.textContent = 'جاري تحميل العروض اليومية...';
    loadingDiv.appendChild(spinnerIcon);
    loadingDiv.appendChild(loadingText);
    
    dailyOffersContainer.innerHTML = '';
    dailyOffersContainer.appendChild(loadingDiv);
    
    try {
        const dailyOffers = await fetchDailyOffersFromSheet();
        dailyOffersContainer.innerHTML = '';
        
        if (dailyOffers.length === 0) {
            const noOffersText = document.createElement('p');
            noOffersText.className = 'no-products';
            noOffersText.textContent = 'لا توجد عروض يومية حالياً';
            dailyOffersContainer.appendChild(noOffersText);
            return;
        }
        
        dailyOffers.forEach(offer => {
            const offerDiv = document.createElement('div');
            offerDiv.className = 'daily-offer';
            
            // تحقق من وجود خيارات وزن
            const hasWeightOptions = offer.weight && (
                offer.weight.trim() === '✓' ||
                offer.weight.trim() === 'صح' ||
                offer.weight.trim() === '1' ||
                offer.weight.trim().toLowerCase() === 'true'
            );
            
            // إضافة الصورة إذا وجدت
            if (offer.image) {
                const img = document.createElement('img');
                img.src = offer.image;
                img.alt = offer.name;
                offerDiv.appendChild(img);
            }
            
            // إضافة العنوان
            const titleDiv = document.createElement('div');
            titleDiv.className = 'daily-offer-title';
            titleDiv.textContent = offer.name;
            offerDiv.appendChild(titleDiv);
            
            // إضافة خيارات الوزن أو السعر
            if (hasWeightOptions && offer.price) {
                const weightSelect = document.createElement('select');
                weightSelect.className = 'weight-select';
                weightSelect.setAttribute('data-id', `daily-${offer.id}`);
                weightSelect.setAttribute('aria-label', 'اختار الوزن');
                
                for (let w = 0.5; w <= 5; w += 0.5) {
                    const price = (offer.price * w).toFixed(2);
                    const option = document.createElement('option');
                    option.value = w;
                    option.setAttribute('data-price', price);
                    option.textContent = `${w} كجم - ${price} ج.م`;
                    weightSelect.appendChild(option);
                }
                offerDiv.appendChild(weightSelect);
            } else {
                const priceDiv = document.createElement('div');
                priceDiv.className = 'daily-offer-price';
                priceDiv.textContent = offer.price ? `${offer.price} ج.م` : '';
                offerDiv.appendChild(priceDiv);
            }
            
            // إضافة زر الإضافة للسلة
            const addButton = document.createElement('button');
            addButton.className = 'add-to-cart';
            addButton.setAttribute('data-id', `daily-${offer.id}`);
            addButton.setAttribute('data-offer', 'true');
            addButton.textContent = 'إضافة للسلة';
            offerDiv.appendChild(addButton);
            
            dailyOffersContainer.appendChild(offerDiv);
        });
        
        // ربط زر الإضافة للسلة
        dailyOffersContainer.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                addDailyOfferToCart(e, dailyOffers);
            });
        });
    } catch (err) {
        const errorText = document.createElement('p');
        errorText.className = 'no-products';
        errorText.textContent = 'حدث خطأ أثناء تحميل العروض اليومية.';
        dailyOffersContainer.innerHTML = '';
        dailyOffersContainer.appendChild(errorText);
        console.error('فشل تحميل العروض اليومية:', err);
    }
}

// إضافة عرض يومي للسلة
function addDailyOfferToCart(e, dailyOffers) {
    const btn = e.target;
    const offerId = btn.getAttribute('data-id');
    const idNum = offerId.replace('daily-', '');
    const offer = dailyOffers.find(o => String(o.id) === idNum);
    if (!offer) return;
    let selectedWeight = 1;
    let selectedPrice = offer.price;
    const offerDiv = btn.closest('.daily-offer');
    const weightSelect = offerDiv ? offerDiv.querySelector('.weight-select') : null;
    if (weightSelect) {
        selectedWeight = parseFloat(weightSelect.value);
        selectedPrice = (offer.price * selectedWeight).toFixed(2);
    }
    // تحقق من وجود العنصر في السلة
    const existingItem = cart.find(item => String(item.id) === offerId && Number(item.selectedWeight) === Number(selectedWeight));
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: offerId,
            name: offer.name,
            price: Number(selectedPrice),
            image: offer.image,
            quantity: 1,
            selectedWeight: selectedWeight
        });
    }
    updateCart();
    // إشعار إضافة
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = `تمت إضافة ${offer.name}${selectedWeight ? ' (' + selectedWeight + ' كجم)' : ''} إلى السلة`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.add('show'); }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => { document.body.removeChild(notification); }, 300);
    }, 2000);
}

// ================================
// 8. إعداد الأحداث الرئيسية
// ================================
function setupEventListeners() {
    // فلترة المنتجات حسب الفئة
    categoryFilter.addEventListener('change', filterProducts);
    // البحث
    searchInput.addEventListener('input', filterProducts);
    // فتح السلة عبر المودال فقط إذا كان الرابط '#'
    const cartIconDesktop = document.getElementById('cart-icon-desktop');
    const cartIconMobile = document.getElementById('cart-icon-mobile');
    if (cartIconDesktop && cartIconDesktop.getAttribute('href') === '#') {
        cartIconDesktop.addEventListener('click', (e) => { e.preventDefault(); openCartModal(); });
    }
    if (cartIconMobile && cartIconMobile.getAttribute('href') === '#') {
        cartIconMobile.addEventListener('click', (e) => { e.preventDefault(); openCartModal(); });
    }
    // إغلاق السلة
    closeBtn.addEventListener('click', () => { cartModal.style.display = 'none'; });
    // إغلاق السلة عند الضغط خارجها
    window.addEventListener('click', (e) => { if (e.target === cartModal) { cartModal.style.display = 'none'; } });
    // إتمام الشراء
    checkoutBtn.addEventListener('click', () => { if (cart.length > 0) { sendOrderToWhatsApp(); } else { alert('سلة التسوق فارغة!'); } });
    // إرسال نموذج التواصل
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('input[placeholder="الاسم"]').value.trim();
            const email = contactForm.querySelector('input[placeholder="البريد الإلكتروني"]').value.trim();
            const message = contactForm.querySelector('textarea[placeholder="رسالتك"]').value.trim();
            let text = 'رسالة دعم/مشكلة من الموقع:';
            if (name) text += `\nالاسم: ${name}`;
            if (email) text += `\nالبريد: ${email}`;
            if (message) text += `\nالرسالة: ${message}`;
            const encoded = encodeURIComponent(text);
            const phone = (window.APP_SETTINGS && window.APP_SETTINGS.WHATSAPP_PHONE) || '201013449050';
            const wa = `https://wa.me/${phone}?text=${encoded}`;
            const win = window.open(wa, '_blank', 'noopener');
            if (win) { win.opener = null; }
            contactForm.reset();
        });
    }

    // توليد هواتف الفوتر من الإعدادات (إن وجدت)
    try {
        const footerPhones = document.getElementById('footer-phones');
        const S = window.APP_SETTINGS || {};
        const numbers = Array.isArray(S.CONTACT_PHONES) ? S.CONTACT_PHONES : [];
        const whatsapp = S.WHATSAPP_PHONE || '201013449050';
        if (footerPhones && numbers.length) {
            footerPhones.innerHTML = '';
            numbers.forEach((num) => {
                const p = document.createElement('p');
                const icon = document.createElement('i');
                icon.setAttribute('data-lucide', 'phone');
                p.appendChild(icon);
                p.appendChild(document.createTextNode(' '));
                const a = document.createElement('a');
                a.href = `https://wa.me/${whatsapp}`;
                a.target = '_blank';
                a.rel = 'noopener';
                a.className = 'phone-link';
                a.textContent = num;
                p.appendChild(a);
                footerPhones.appendChild(p);
            });
            if (window.lucide) { lucide.createIcons(); }
        }
    } catch (e) { /* noop */ }
    // تمرير ناعم للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            if (mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                const backdrop = document.querySelector('.backdrop');
                if (backdrop) {
                    backdrop.classList.remove('active');
                    backdrop.style.opacity = '0';
                    setTimeout(() => { backdrop.style.display = 'none'; }, 300);
                }
            }
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({ top: targetElement.offsetTop - 70, behavior: 'smooth' });
                    document.querySelectorAll('.main-menu a').forEach(item => { item.classList.remove('active'); });
                    this.classList.add('active');
                }
            }
        });
    });
    // تحديث العنصر النشط في القائمة عند التمرير
    window.addEventListener('scroll', debounce(setActiveNavItem, 200));
}

// ================================
// 9. قائمة الجوال (الهامبرجر)
// ================================
function handleMobileMenu() {
    const menuToggle = document.querySelector('.main-menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    const backdrop = document.querySelector('.backdrop') || createBackdrop();
    if (!menuToggle || !mainMenu) { console.error('Mobile menu elements not found'); return; }
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        mainMenu.classList.toggle('active');
        backdrop.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        if (backdrop.classList.contains('active')) {
            backdrop.style.display = 'block'; backdrop.offsetHeight; backdrop.style.opacity = '1';
        } else {
            backdrop.style.opacity = '0';
            setTimeout(() => { if (!backdrop.classList.contains('active')) { backdrop.style.display = 'none'; } }, 300);
        }
    });
    backdrop.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        mainMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
        backdrop.style.opacity = '0';
        setTimeout(() => { backdrop.style.display = 'none'; }, 300);
    });
    // إغلاق القائمة عند الضغط على الروابط
    const menuLinks = document.querySelectorAll('.main-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainMenu.classList.remove('active');
            backdrop.classList.remove('active');
            document.body.classList.remove('menu-open');
            backdrop.style.opacity = '0';
            setTimeout(() => { backdrop.style.display = 'none'; }, 300);
        });
    });
}

function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    document.body.appendChild(backdrop);
    return backdrop;
}

// ================================
// 10. تفعيل العنصر النشط في القائمة
// ================================
function setActiveNavItem() {
    const scrollPosition = window.scrollY + 80;
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.main-menu a').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
    if (scrollPosition < 100) {
        document.querySelectorAll('.main-menu a').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#home') {
                item.classList.add('active');
            }
        });
    }
}

// ================================
// 11. دالة Debounce
// ================================
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => { func.apply(context, args); }, wait);
    };
}

// ================================
// 12. عرض المنتجات مع الصفحات
// ================================
function displayProducts(productsArray) {
    currentProducts = productsArray;
    totalPages = Math.ceil(productsArray.length / productsPerPage);
    if (currentPage > totalPages) { currentPage = totalPages || 1; }
    productContainer.innerHTML = '';
    
    if (productsArray.length === 0) {
        const noProductsText = document.createElement('p');
        noProductsText.className = 'no-products';
        noProductsText.textContent = 'لا توجد منتجات متطابقة مع البحث';
        productContainer.appendChild(noProductsText);
        return;
    }
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, productsArray.length);
    const currentPageProducts = productsArray.slice(startIndex, endIndex);
    const fragment = document.createDocumentFragment();
    
    currentPageProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        
        // إنشاء الصورة
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.loading = 'lazy';
        img.width = 200;
        img.height = 200;
        productElement.appendChild(img);
        
        // إنشاء معلومات المنتج
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        
        // عنوان المنتج
        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.name;
        productInfo.appendChild(title);

        // سطر فرعي (مثلاً الوزن/القطعة)
        if (product.weight) {
            const subtitle = document.createElement('p');
            subtitle.className = 'product-subtitle';
            subtitle.textContent = product.weight;
            productInfo.appendChild(subtitle);
        }

        // عناصر الفوتر (السعر + زر الإضافة)
        const footer = document.createElement('div');
        footer.className = 'product-footer';

        const priceEl = document.createElement('p');
        priceEl.className = 'product-price';

        // زر الإضافة للسلة (على شكل دائرة +)
        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart';
        addButton.setAttribute('data-id', product.id);
        addButton.textContent = '+';

        // خيارات الوزن إن وجدت
        if (product.hasWeightOptions && product.price) {
            const weightSelect = document.createElement('select');
            weightSelect.className = 'weight-select';
            weightSelect.setAttribute('data-id', product.id);
            weightSelect.setAttribute('aria-label', 'اختار الوزن');
            
            for (let w = 0.5; w <= 5; w += 0.5) {
                const price = (product.price * w).toFixed(2);
                const option = document.createElement('option');
                option.value = w;
                option.setAttribute('data-price', price);
                option.textContent = `${w} كجم - ${price} ج.م`;
                weightSelect.appendChild(option);
            }
            productInfo.appendChild(weightSelect);
            // سعر افتراضي حسب أول خيار
            const firstOption = weightSelect.options[0];
            priceEl.textContent = `${firstOption ? firstOption.getAttribute('data-price') : product.price} ج.م`;
            // حدث لتحديث السعر عند تغيير الوزن
            weightSelect.addEventListener('change', () => {
                const selected = weightSelect.selectedOptions[0];
                const p = selected ? selected.getAttribute('data-price') : product.price;
                priceEl.textContent = `${p} ج.م`;
            });
        } else {
            priceEl.textContent = `${product.price} ج.م`;
        }

        footer.appendChild(priceEl);
        footer.appendChild(addButton);
        productElement.appendChild(productInfo);
        productElement.appendChild(footer);
        fragment.appendChild(productElement);
    });
    
    productContainer.appendChild(fragment);
    createPaginationControls();
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// ================================
// 13. تحكم الصفحات
// ================================
function createPaginationControls() {
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) { existingPagination.remove(); }
    if (totalPages <= 1) { return; }
    
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    // زر السابق
    const prevButton = document.createElement('button');
    const prevIcon = document.createElement('i');
    prevIcon.className = 'fas fa-chevron-right';
    prevButton.appendChild(prevIcon);
    prevButton.classList.add('pagination-btn', 'prev');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(currentProducts);
            window.scrollTo({ top: document.getElementById('products').offsetTop - 80, behavior: 'smooth' });
        }
    });
    
    // زر التالي
    const nextButton = document.createElement('button');
    const nextIcon = document.createElement('i');
    nextIcon.className = 'fas fa-chevron-left';
    nextButton.appendChild(nextIcon);
    nextButton.classList.add('pagination-btn', 'next');
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts(currentProducts);
            window.scrollTo({ top: document.getElementById('products').offsetTop - 80, behavior: 'smooth' });
        }
    });
    
    // مؤشر الصفحات
    const pageIndicator = document.createElement('span');
    pageIndicator.textContent = `${currentPage} / ${totalPages}`;
    pageIndicator.className = 'page-indicator';
    
    pagination.appendChild(prevButton);
    pagination.appendChild(pageIndicator);
    pagination.appendChild(nextButton);
    productContainer.after(pagination);
}

// ================================
// 14. فلترة المنتجات
// ================================
function filterProducts() {
    const category = categoryFilter.value.trim().toLowerCase();
    const searchTerm = searchInput.value.trim().toLowerCase();
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category && product.category.trim() === category.trim());
    }
    if (searchTerm !== '') {
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchTerm));
    }
    currentPage = 1;
    displayProducts(filteredProducts);
}

// ================================
// 15. إضافة منتج للسلة
// ================================
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    let selectedWeight = 1;
    let selectedPrice = product.price;
    // ابحث عن اختيار الوزن داخل بطاقة المنتج كاملة
    const card = e.target.closest('.product');
    const weightSelect = card ? card.querySelector('.weight-select') : null;
    if (weightSelect) {
        selectedWeight = parseFloat(weightSelect.value);
        selectedPrice = (product.price * selectedWeight).toFixed(2);
    }
    const existingItem = cart.find(item => String(item.id) === String(productId) && Number(item.selectedWeight) === Number(selectedWeight));
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(selectedPrice),
            image: product.image,
            quantity: 1,
            selectedWeight: selectedWeight 
        });
    }
    updateCart();
    // إشعار إضافة
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = `تمت إضافة ${product.name} (${selectedWeight} كجم) إلى السلة`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.add('show'); }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => { document.body.removeChild(notification); }, 300);
    }, 2000);
}

// ================================
// 16. تحديث السلة
// ================================
function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountDesktop = document.getElementById('cart-count-desktop');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    if (cartCountDesktop) cartCountDesktop.textContent = totalItems;
    if (cartCountMobile) cartCountMobile.textContent = totalItems;
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        // إنشاء الصورة
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.width = 70;
        img.height = 70;
        cartItem.appendChild(img);
        
        // معلومات المنتج
        const cartItemInfo = document.createElement('div');
        cartItemInfo.className = 'cart-item-info';
        
        const title = document.createElement('h4');
        title.className = 'cart-item-title';
        title.textContent = `${item.name} (${item.selectedWeight} كجم)`;
        cartItemInfo.appendChild(title);
        
        const price = document.createElement('p');
        price.className = 'cart-item-price';
        price.textContent = `${item.price} ج.م`;
        cartItemInfo.appendChild(price);
        
        cartItem.appendChild(cartItemInfo);
        
        // أزرار الكمية
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'cart-item-quantity';
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'quantity-btn decrease';
        decreaseBtn.setAttribute('data-id', item.id);
        decreaseBtn.setAttribute('data-weight', item.selectedWeight);
        decreaseBtn.textContent = '-';
        quantityDiv.appendChild(decreaseBtn);
        
        const quantitySpan = document.createElement('span');
        quantitySpan.textContent = item.quantity;
        quantityDiv.appendChild(quantitySpan);
        
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'quantity-btn increase';
        increaseBtn.setAttribute('data-id', item.id);
        increaseBtn.setAttribute('data-weight', item.selectedWeight);
        increaseBtn.textContent = '+';
        quantityDiv.appendChild(increaseBtn);
        
        cartItem.appendChild(quantityDiv);
        
        // زر الحذف
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item';
        removeBtn.setAttribute('data-id', item.id);
        removeBtn.setAttribute('data-weight', item.selectedWeight);
        removeBtn.textContent = '×';
        cartItem.appendChild(removeBtn);
        
        cartItems.appendChild(cartItem);
    });
    
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => { button.addEventListener('click', decreaseQuantity); });
    document.querySelectorAll('.quantity-btn.increase').forEach(button => { button.addEventListener('click', increaseQuantity); });
    document.querySelectorAll('.remove-item').forEach(button => { button.addEventListener('click', removeItem); });
    
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPrice.textContent = total;
    // حفظ السلة في localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ================================
// 17. فتح نافذة السلة
// ================================
function openCartModal() {
    updateCart();
    cartModal.style.display = 'block';
}

// ================================
// 18. تحكم الكمية في السلة
// ================================
function increaseQuantity(e) {
    const productId = e.target.getAttribute('data-id');
    const selectedWeight = parseFloat(e.target.getAttribute('data-weight'));
    const item = cart.find(item => String(item.id) === String(productId) && Number(item.selectedWeight) === Number(selectedWeight));
    if (item) { item.quantity++; updateCart(); }
}
function decreaseQuantity(e) {
    const productId = e.target.getAttribute('data-id');
    const selectedWeight = parseFloat(e.target.getAttribute('data-weight'));
    const item = cart.find(item => String(item.id) === String(productId) && Number(item.selectedWeight) === Number(selectedWeight));
    if (item) {
        item.quantity--;
        if (item.quantity === 0) {
            cart = cart.filter(item => !(String(item.id) === String(productId) && Number(item.selectedWeight) === Number(selectedWeight)));
        }
        updateCart();
    }
}
function removeItem(e) {
    const productId = e.target.getAttribute('data-id');
    const selectedWeight = parseFloat(e.target.getAttribute('data-weight'));
    cart = cart.filter(item => !(String(item.id) === String(productId) && Number(item.selectedWeight) === Number(selectedWeight)));
    updateCart();
}

// ================================
// 19. تحميل الصور ببطء
// ================================
function lazyLoadImages() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img').forEach(img => { img.loading = 'lazy'; });
    } else {
        const lazyImages = document.querySelectorAll('img:not([loading])');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src || image.src;
                        observer.unobserve(image);
                    }
                });
            });
            lazyImages.forEach(image => {
                if (!image.src && image.dataset.src) {
                    image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                }
                imageObserver.observe(image);
            });
        }
    }
}

// ================================
// 20. تحديث التخطيط عند تغيير الاتجاه
// ================================
function updateLayoutOnOrientationChange() {
    setActiveNavItem();
    if (window.innerWidth <= 768) {
        const productContainer = document.getElementById('product-container');
        if (productContainer) {
            const products = productContainer.querySelectorAll('.product');
            products.forEach(product => {
                product.style.opacity = '0';
                setTimeout(() => { product.style.opacity = '1'; }, 100);
            });
        }
    }
}

// ================================
// 21. إرسال الطلب إلى واتساب
// ================================
function sendOrderToWhatsApp() {
    const deliveryFee = (window.APP_SETTINGS && Number(window.APP_SETTINGS.DELIVERY_FEE)) || 20;
    let orderText = "🛒 *طلب جديد* 🛒\n\n";
    orderText += "📋 *تفاصيل الطلب:*\n";
    cart.forEach((item, index) => {
        orderText += `${index + 1}. ${item.name} (${item.selectedWeight} كجم) - ${item.price} ج.م × ${item.quantity} = ${item.price * item.quantity} ج.م\n`;
    });
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotal = subtotal + deliveryFee;
    orderText += `\n💰 *المجموع:* ${subtotal} ج.م`;
    orderText += `\n🚚 *التوصيل:* ${deliveryFee} ج.م`;
    orderText += `\n📦 *الإجمالي:* ${grandTotal} ج.م\n\n`;
    orderText += "🙏 يرجى تأكيد الطلب بإرسال عنوان التوصيل ورقم الهاتف";
    const encodedText = encodeURIComponent(orderText);
    const phoneNumber = (window.APP_SETTINGS && window.APP_SETTINGS.WHATSAPP_PHONE) || "201013449050";
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    const win = window.open(whatsappLink, '_blank', 'noopener');
    if (win) { win.opener = null; }
    cart = [];
    updateCart();
    if (cartModal) { cartModal.style.display = 'none'; }
    alert('تم إرسال طلبك إلى واتساب. شكراً لتسوقك معنا!');
}

// ================================
// 22. تحكم الهيدر عند التمرير
// ================================
function handleHeaderOnScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = (currentScroll <= 0) ? 0 : currentScroll;
}

// ================================
// 23. جلب المنتجات من Google Sheets
// ================================
async function fetchProductsFromSheet() {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQW97GGGDtnnWSUBrlpg6Keds0Mg8XTlCa4eGc7ZrodALIluRjJXMA_DjZr5gZ5J822wZ4pbrFf12iF/pub?output=csv';
    const res = await fetch(url);
    const csv = await res.text();
    const lines = csv.split('\n').filter(line => line.trim().length > 0);
    const header = lines[0].split(',');
    const data = lines.slice(1).map(line => line.split(','));
    const productsMap = {};
    data.forEach(cols => {
        while (cols.length > header.length) {
            cols[header.length - 1] += ',' + cols.pop();
        }
        const [id, name, category, image, weight, price, hasWeightOptions] = cols;
        if (!id || !name) return;
        if (!productsMap[id]) {
            productsMap[id] = {
                id: Number(id),
                name: name,
                category: category,
                image: image,
                price: Number(price),
                hasWeightOptions: false
            };
        }
        if ((hasWeightOptions && (hasWeightOptions.includes('TRUE') || hasWeightOptions.includes('true') || hasWeightOptions.includes('1')))
            || (weight && (weight.includes('✓') || weight.includes('صح') || weight.includes('true') || weight.includes('1')))) {
            productsMap[id].hasWeightOptions = true;
        }
    });
    return Object.values(productsMap);
}

// ================================
// 24. تعبئة الفئات في الفلتر
// ================================
function populateCategoryFilter() {
  categoryFilter.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.value;
    option.textContent = cat.label;
    categoryFilter.appendChild(option);
  });
}

// ================================
// 25. فلترة المنتجات بالضغط على القسم
// ================================
function filterByCategory(category) {
    categoryFilter.value = category;
    filterProducts();
    const productsSection = document.getElementById('products');
    if (productsSection) {
        window.scrollTo({ top: productsSection.offsetTop - 80, behavior: 'smooth' });
    }
    document.querySelectorAll('.category').forEach(cat => { cat.classList.remove('selected'); });
    const selectedCategory = document.querySelector(`.category[onclick*="${category}"]`);
    if (selectedCategory) {
        selectedCategory.classList.add('selected');
        setTimeout(() => { selectedCategory.classList.remove('selected'); }, 2000);
    }
}

// ================================
// 26. تحميل المنتجات
// ================================
async function loadProducts() {
    try {
        showLoadingSpinner();
        // تسريع التحميل: استخدم cache من localStorage إذا كان حديثاً
        const cacheKey = 'products_cache';
        const cacheTimeKey = 'products_cache_time';
        const cacheDuration = 10 * 60 * 1000; // 10 دقائق
        let fetchedProducts = null;
        const now = Date.now();
        if (localStorage.getItem(cacheKey) && localStorage.getItem(cacheTimeKey)) {
            const cachedTime = parseInt(localStorage.getItem(cacheTimeKey));
            if (now - cachedTime < cacheDuration) {
                try {
                    fetchedProducts = JSON.parse(localStorage.getItem(cacheKey));
                } catch (e) { fetchedProducts = null; }
            }
        }
        if (!fetchedProducts) {
            fetchedProducts = await fetchProductsFromSheet();
            localStorage.setItem(cacheKey, JSON.stringify(fetchedProducts));
            localStorage.setItem(cacheTimeKey, now.toString());
        }
        products = fetchedProducts;
        displayProducts(products);
        renderDailyOffers();
        hideLoadingSpinner();
        showUpdateNotification('تم تحديث المنتجات بنجاح', 'success');
    } catch (err) {
        hideLoadingSpinner();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = 'حدث خطأ أثناء تحميل المنتجات. حاول لاحقاً.';
        productContainer.innerHTML = '';
        productContainer.appendChild(errorDiv);
        console.error('فشل تحميل المنتجات:', err);
        showUpdateNotification('فشل في تحديث المنتجات', 'error');
    }
}

// ================================
// 27. التحديث التلقائي للمنتجات
// ================================
function startAutoUpdate() {
    if (autoUpdateInterval) { clearInterval(autoUpdateInterval); }
    autoUpdateInterval = setInterval(() => { loadProducts(); }, UPDATE_INTERVAL);
    console.log('تم بدء التحديث التلقائي للمنتجات كل 5 دقائق');
}
function stopAutoUpdate() {
    if (autoUpdateInterval) { clearInterval(autoUpdateInterval); autoUpdateInterval = null; console.log('تم إيقاف التحديث التلقائي'); }
}

// ================================
// 28. مؤشر التحميل
// ================================
function showLoadingSpinner() {
    const existingSpinner = document.getElementById('loading-spinner');
    if (!existingSpinner) {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.className = 'loading-spinner';
        
        const spinnerIcon = document.createElement('i');
        spinnerIcon.className = 'fas fa-spinner fa-spin';
        spinner.appendChild(spinnerIcon);
        
        const spinnerText = document.createElement('span');
        spinnerText.textContent = 'جاري تحديث المنتجات...';
        spinner.appendChild(spinnerText);
        
        productContainer.appendChild(spinner);
    }
}
function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) { spinner.remove(); }
}

// ================================
// 29. إشعار التحديث
// ================================
function showUpdateNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('update-notification', type);
    
    // إنشاء الأيقونة
    const icon = document.createElement('i');
    const iconClass = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    icon.className = `fas ${iconClass}`;
    notification.appendChild(icon);
    
    // إنشاء النص
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    notification.appendChild(textSpan);
    
    // إنشاء زر الإغلاق
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-notification';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', function() {
        this.parentElement.remove();
    });
    notification.appendChild(closeBtn);
    
    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.add('show'); }, 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => { if (notification.parentElement) { notification.remove(); } }, 300);
    }, 5000);
}

// ================================
// 30. التحديث اليدوي
// ================================
function manualUpdate() {
    // حذف الكاش قبل التحديث
    localStorage.removeItem('products_cache');
    localStorage.removeItem('products_cache_time');
    showUpdateNotification('جاري تحديث المنتجات...', 'info');
    loadProducts();
}

