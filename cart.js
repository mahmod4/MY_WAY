// ================================
//  صفحة السلة - أسواق الشادر
// ================================

(function () {
  const DELIVERY_FEE = (window.APP_SETTINGS && Number(window.APP_SETTINGS.DELIVERY_FEE)) || 20;

  /**
   * قراءة السلة من localStorage
   */
  function readCart() {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * حفظ السلة في localStorage
   */
  function writeCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  /**
   * تنسيق إنشاء عنصر السلة
   */
  function createCartItemElement(item) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cart-item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.width = 70;
    img.height = 70;
    wrapper.appendChild(img);

    const info = document.createElement('div');
    info.className = 'cart-item-info';

    const title = document.createElement('h4');
    title.className = 'cart-item-title';
    title.textContent = `${item.name} (${item.selectedWeight} كجم)`;
    info.appendChild(title);

    const price = document.createElement('p');
    price.className = 'cart-item-price';
    price.textContent = `${item.price} ج.م`;
    info.appendChild(price);

    wrapper.appendChild(info);

    const qtyDiv = document.createElement('div');
    qtyDiv.className = 'cart-item-quantity';

    const decBtn = document.createElement('button');
    decBtn.className = 'quantity-btn decrease';
    decBtn.textContent = '-';
    decBtn.addEventListener('click', () => changeQty(item, -1));
    qtyDiv.appendChild(decBtn);

    const qtySpan = document.createElement('span');
    qtySpan.textContent = item.quantity;
    qtyDiv.appendChild(qtySpan);

    const incBtn = document.createElement('button');
    incBtn.className = 'quantity-btn increase';
    incBtn.textContent = '+';
    incBtn.addEventListener('click', () => changeQty(item, +1));
    qtyDiv.appendChild(incBtn);

    wrapper.appendChild(qtyDiv);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-item';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => removeItem(item));
    wrapper.appendChild(removeBtn);

    return wrapper;
  }

  /**
   * إعادة العرض
   */
  function render() {
    const cart = readCart();
    const list = document.getElementById('cart-page-items');
    const subtotalEl = document.getElementById('subtotal-amount');
    const deliveryEl = document.getElementById('delivery-fee');
    const grandEl = document.getElementById('grand-total');
    const badgeDesktop = document.getElementById('cart-count-desktop');

    if (!list) return;
    list.innerHTML = '';

    if (cart.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'no-products';
      empty.textContent = 'السلة فارغة';
      list.appendChild(empty);
    } else {
      const fragment = document.createDocumentFragment();
      cart.forEach((item) => fragment.appendChild(createCartItemElement(item)));
      list.appendChild(fragment);
    }

    const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const grand = subtotal + DELIVERY_FEE;

    if (subtotalEl) subtotalEl.textContent = String(subtotal);
    if (deliveryEl) deliveryEl.textContent = String(DELIVERY_FEE);
    if (grandEl) grandEl.textContent = String(grand);

    const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
    if (badgeDesktop) badgeDesktop.textContent = String(totalItems);
  }

  /**
   * تغيير الكمية
   */
  function changeQty(targetItem, delta) {
    const cart = readCart();
    const idx = cart.findIndex(
      (i) => String(i.id) === String(targetItem.id) && Number(i.selectedWeight) === Number(targetItem.selectedWeight)
    );
    if (idx === -1) return;
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    writeCart(cart);
    render();
  }

  /**
   * إزالة عنصر
   */
  function removeItem(targetItem) {
    let cart = readCart();
    cart = cart.filter(
      (i) => !(String(i.id) === String(targetItem.id) && Number(i.selectedWeight) === Number(targetItem.selectedWeight))
    );
    writeCart(cart);
    render();
  }

  /**
   * إرسال الطلب إلى واتساب مع رسوم التوصيل
   */
  function sendOrder() {
    const cart = readCart();
    if (!cart.length) {
      alert('السلة فارغة!');
      return;
    }
    let text = '🛒 *طلب جديد* 🛒\n\n';
    text += '📋 *تفاصيل الطلب:*\n';
    cart.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} (${item.selectedWeight} كجم) - ${item.price} ج.م × ${item.quantity} = ${item.price * item.quantity} ج.م\n`;
    });
    const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);
    const grand = subtotal + DELIVERY_FEE;
    text += `\n💰 *المجموع:* ${subtotal} ج.م`;
    text += `\n🚚 *التوصيل:* ${DELIVERY_FEE} ج.م`;
    text += `\n📦 *الإجمالي:* ${grand} ج.م\n\n`;
    text += '🙏 يرجى تأكيد الطلب بإرسال عنوان التوصيل ورقم الهاتف';

    const phone = (window.APP_SETTINGS && window.APP_SETTINGS.WHATSAPP_PHONE) || '201013449050';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    const win = window.open(url, '_blank', 'noopener');
    if (win) { win.opener = null; }

    // تفريغ السلة بعد الإرسال
    writeCart([]);
    render();
  }

  // ربط الأحداث
  document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', sendOrder);
    render();
  });
})();


