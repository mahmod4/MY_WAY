// ================================
// ملف التكوين - مفاتيح Firebase
// ================================
// ⚠️ تحذير أمني مهم:
// في الإنتاج، يجب نقل هذه المفاتيح إلى متغيرات بيئية
// أو استخدام قيود على النطاق في Firebase Console
// لا تشارك هذه المفاتيح علناً أو تضعها في مستودعات عامة
// 
// للتأمين:
// 1. إضافة قيود النطاق في Firebase Console
// 2. استخدام متغيرات بيئية (.env)
// 3. إضافة ملف config.js إلى .gitignore
// 4. استخدام Firebase App Check

const firebaseConfig = {
    apiKey: "AIzaSyBBo0T68WHTINwU8VET_Zm1Nc6eLGSd1u0",
    authDomain: "my-cat-store.firebaseapp.com",
    projectId: "my-cat-store",
    storageBucket: "my-cat-store.firebasestorage.app",
    messagingSenderId: "472278929296",
    appId: "1:472278929296:web:f32db52f737216da856d15"
};

// إعدادات إضافية للموقع
const siteConfig = {
    name: "أسواق الشادر",
    phone: "01013449050",
    whatsapp: "201013449050",
    facebook: "https://www.facebook.com/share/1CizJTdEEc/",
    addresses: [
        "بني سويف - الشرطه العسكريه بجوار مدرسة متولي الشعراوي",
        "بني سويف - شارع بني سويف الجديده - بجوار محل تاون تيم",
        "بني سويف - حي الزهور - بجوار كافيه استكانة"
    ]
};

// تصدير التكوين للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, siteConfig };
} else {
    window.firebaseConfig = firebaseConfig;
    window.siteConfig = siteConfig;
} 