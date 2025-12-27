// ملف للتحقق من تسجيل دخول المديرين
// يتم استدعاؤه في الصفحات الإدارية فقط

(function() {
    'use strict';
    
    // قائمة الصفحات المحمية (الإدارية)
    const protectedPages = [
        'dashbord.html',
        'certificates.html'
    ];
    
    // الحصول على اسم الصفحة الحالية
    const currentPage = window.location.pathname.split('/').pop();
    
    // التحقق إذا كانت الصفحة الحالية محمية
    if (protectedPages.includes(currentPage)) {
        checkAuthentication();
    }
    
    function checkAuthentication() {
        // التحقق من وجود بيانات المستخدم في localStorage
        const currentUser = localStorage.getItem('currentUser');
        
        if (!currentUser) {
            // إذا لم يسجل دخول، نقله لصفحة تسجيل الدخول
            alert('⚠️ يجب تسجيل الدخول أولاً للوصول إلى هذه الصفحة');
            window.location.href = 'login-admin.html';
            return;
        }
        
        try {
            const user = JSON.parse(currentUser);
            
            // التحقق من صلاحيات المدير
            if (user.role !== 'admin') {
                alert('⚠️ ليس لديك صلاحيات للوصول إلى هذه الصفحة');
                window.location.href = 'index.html';
                return;
            }
            
            // عرض معلومات المستخدم في console
            console.log('✅ مصادقة ناجحة:', user.fullName);
            
        } catch (error) {
            // إذا كانت البيانات غير صحيحة
            console.error('❌ خطأ في بيانات المستخدم:', error);
            localStorage.removeItem('currentUser');
            window.location.href = 'login-admin.html';
        }
    }
    
    // دالة لتسجيل الخروج
    window.logout = function() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    };
    
})();

