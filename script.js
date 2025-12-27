// Global Variables
let currentUser = null;
let courses = [];
let registrations = [];

// Check if API client is available
const isApiAvailable = typeof window.apiClient !== 'undefined';

// Course Data - جميع الدورات المذكورة
const defaultCourses = [
    {
        id: 1,
        name: "مهارات السكرتارية وإدارة المكاتب",
        description: "تعلم مهارات تنظيم وإدارة المكاتب والسكرتارية بفعالية.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 2,
        name: "هيئة وتطوير القيادات الإدارية",
        description: "تطوير مهارات القيادة والإدارة الحديثة لتحسين الأداء المؤسسي.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 3,
        name: "مهارات المساعدة الإدارية",
        description: "اكتساب المهارات اللازمة لدعم الإدارة وتنظيم المهام بكفاءة.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 4,
        name: "التميز في اختبار القدرات",
        description: "استراتيجيات وأساليب للتحضير والنجاح في اختبار القدرات بكفاءة.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 5,
        name: "كيفية إعداد السيرة الذاتية",
        description: "تعلم طرق إعداد سيرة ذاتية احترافية تجذب انتباه أصحاب العمل.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 6,
        name: "التميز المؤسسي حسب معايير EFQM",
        description: "معايير التميز المؤسسي وكيفية تطبيقها لرفع جودة الأداء المؤسسي.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 7,
        name: "مؤشرات قياس الأداء KPI",
        description: "كيفية تحديد وقياس مؤشرات الأداء الرئيسية لتحقيق الأهداف.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 8,
        name: "أساسيات إدارة التغيير",
        description: "تعلم أساسيات ومراحل إدارة التغيير بفعالية في المؤسسات.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 9,
        name: "مهارات تقدير الذات وتوكيدها",
        description: "تعزيز الثقة بالنفس وتقدير الذات في بيئة العمل والحياة اليومية.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 10,
        name: "إعداد الحقائب التدريبية",
        description: "كيفية تصميم وتحضير مواد تدريبية فعالة ومؤثرة.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 11,
        name: "مهارات التسويق الذكي",
        description: "استراتيجيات التسويق الحديثة لتحقيق نجاح الأعمال.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 12,
        name: "أساسيات التصميم الجرافيكي",
        description: "مبادئ التصميم وأساسيات الجرافيك لاستخدامها في المشاريع.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 13,
        name: "مهارات الاتصال والتفاوض وتطوير الذات القيادية",
        description: "تعلم مهارات التواصل الفعّال والتفاوض لتطوير الذات والقيادة.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 14,
        name: "مهارات التوجيه والتحفيز الإبداعي",
        description: "أساليب التوجيه والتحفيز لتعزيز الإبداع والابتكار.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 15,
        name: "مهارات الكتابة الإدارية وإعداد التقارير",
        description: "تعلم كتابة التقارير والوثائق الإدارية بشكل احترافي.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 16,
        name: "إدارة الموارد البشرية",
        description: "مبادئ إدارة الموارد البشرية وتنمية الكفاءات.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 17,
        name: "التميز في خدمة العملاء",
        description: "استراتيجيات تقديم خدمة عملاء ممتازة لبناء علاقات طويلة الأمد.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 18,
        name: "الإبداع الإداري",
        description: "تنمية التفكير الإبداعي لتطوير الأداء الإداري.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 19,
        name: "مهارات العمل التطوعي",
        description: "تعزيز مهارات التطوع والمشاركة المجتمعية.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 20,
        name: "التهيئة لسوق العمل",
        description: "تحضير المتدربين لدخول سوق العمل بمهارات مهنية.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 21,
        name: "بناء فريق العمل",
        description: "تطوير مهارات بناء فرق عمل فعالة ومتعاونة.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 22,
        name: "قوة الشخصية والثقة بالنفس",
        description: "تنمية الثقة بالنفس وقوة الشخصية لتحقيق النجاح.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 23,
        name: "تدريب المدربين في الحوار الرياضي",
        description: "مهارات تدريب المدربين على الحوار الرياضي الفعّال.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 24,
        name: "تدريب المدربين في الحوار مع الطفل",
        description: "تطوير مهارات تدريب الحوار مع الأطفال بطريقة علمية.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 25,
        name: "الحوار الأسري",
        description: "تعزيز مهارات الحوار والتواصل داخل الأسرة.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 26,
        name: "الحوار في بيئة العمل",
        description: "تنمية مهارات التواصل والحوار في بيئة العمل المهنية.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 27,
        name: "التخطيط التشغيلي وإعداد خطط العمل",
        description: "كيفية إعداد وتنفيذ الخطط التشغيلية بفعالية.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 28,
        name: "أساسيات المحاسبة المالية في القطاع غير الربحي",
        description: "مبادئ المحاسبة المالية والرقابة في المنظمات غير الربحية.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 29,
        name: "تدريب المدربين TOT",
        description: "برنامج تدريبي متخصص لتأهيل المدربين.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    },
    {
        id: 30,
        name: "مهارات القيادة الإدارية",
        description: "تطوير مهارات القيادة والإدارة لتحسين الأداء المؤسسي.",
        trainingHall: "القاعه التدريبية",
        status: "active",
        registrations: 0
    }
];

// حسابات المدراء فقط (تعديل كلمات المرور يتم من قبلك)
const adminUsers = [
    {
        username: "admin-m",
        password: "mohmd77",
        role: "admin",
        fullName: "مدير المركز",
        email: "admin@training.gov.sa"
    },
    {
        username: "vol-ahood",
        password: "ahood7",
        role: "admin",
        fullName: "مسؤولة التطوع",
        email: "volunteer@training.gov.sa"
    },
    {
        username: "dev-sheikha",
        password: "sheikha8",
        role: "admin",
        fullName: "مطورة شيخة",
        email: "sheikhaalbander@gmail.com"
    },
    {
        username: "dev-salma",
        password: "salma9",
        role: "admin",
        fullName: "مطورة سلمى",
        email: "salma@training.gov.sa"
    },
    {
        username: "dev-reemass",
        password: "rmmas10",
        role: "admin",
        fullName: "مطورة ريماس",
        email: "reemass@training.gov.sa"
    }
];

function getStoredVisitorUsers() {
    try {
        const raw = localStorage.getItem('users');
        return raw ? JSON.parse(raw) : [];
    } catch (_) {
        return [];
    }
}

function saveStoredVisitorUsers(list) {
    localStorage.setItem('users', JSON.stringify(list || []));
}

function getAllUsers() {
    return [...adminUsers, ...getStoredVisitorUsers()];
}

// مصفوفة المطورين
const developers = [
    {
        name: "شيخه الشمري",
        initials: "SA",
        phone: "0534630161",
        email: "Sheikhaalbander@gmail.com",
        linkedin: "https://www.linkedin.com/in/sheikha-albander-255150261",
        role: "مطور رئيسي"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    // Load data from API or localStorage
    await loadData();
    
    // Check current page and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html') {
        initializeHomePage();
    } else if (currentPage === 'courses.html') {
        initializeCoursesPage();
    } else if (currentPage === 'dashbord.html') {
        initializeDashboard();
    } else if (currentPage === 'certificates.html') {
        initializeCertificatesPage();
    } else if (currentPage === 'register.html') {
        initializeRegisterPage();
    }
}

async function loadData() {
    if (isApiAvailable) {
        try {
            // Load courses from API
            const response = await window.apiClient.getCourses();
            courses = response;
            
            // Load registrations from API (admin only)
            if (currentUser && currentUser.role === 'admin') {
                try {
                    const regResponse = await window.apiClient.getRegistrations();
                    registrations = regResponse;
                } catch (error) {
                    console.log('Not authorized to load registrations');
                    registrations = [];
                }
            } else {
                registrations = [];
            }
        } catch (error) {
            console.error('Failed to load data from API:', error);
            // Fallback to localStorage
            loadDataFromLocalStorage();
        }
    } else {
        // Fallback to localStorage
        loadDataFromLocalStorage();
    }
}

function loadDataFromLocalStorage() {
    // Load courses from localStorage or use default
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
        courses = JSON.parse(savedCourses);
    } else {
        courses = [...defaultCourses];
        localStorage.setItem('courses', JSON.stringify(courses));
    }
    
    // Load registrations from localStorage
    const savedRegistrations = localStorage.getItem('registrations');
    if (savedRegistrations) {
        registrations = JSON.parse(savedRegistrations);
    }
    
    // Update course registration counts
    updateCourseRegistrationCounts();
}

function saveData() {
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

function updateCourseRegistrationCounts() {
    courses.forEach(course => {
        course.registrations = registrations.filter(reg => reg.courseId === course.id).length;
    });
    saveData();
}

// Home Page Functions
function initializeHomePage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (isApiAvailable) {
        try {
            const response = await window.apiClient.login({ username, password });
            
            currentUser = {
                role: response.user.role,
                username: response.user.username,
                fullName: response.user.fullName,
                email: response.user.email,
                id: response.user.id
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('تم تسجيل الدخول بنجاح', 'success');
            
            if (response.user.role === 'admin') {
                setTimeout(() => {
                    window.location.href = 'dashbord.html';
                }, 1000);
            } else {
                setTimeout(() => {
                    window.location.href = 'courses.html';
                }, 1000);
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('بيانات الدخول غير صحيحة', 'error');
        }
    } else {
        // Fallback to local authentication
        const user = getAllUsers().find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = { 
                role: user.role, 
                username: user.username,
                fullName: user.fullName,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            if (user.role === 'admin') {
                window.location.href = 'dashbord.html';
            } else {
                window.location.href = 'courses.html';
            }
        } else {
            showNotification('بيانات الدخول غير صحيحة', 'error');
        }
    }
}

// Register Page Functions
function initializeRegisterPage() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', handleRegisterSubmit);
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const fullName = formData.get('fullName')?.trim();
    const phone = formData.get('phone')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!fullName || !email || !password) {
        showNotification('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showNotification('كلمتا المرور غير متطابقتين', 'error');
        return;
    }

    if (isApiAvailable) {
        try {
            const response = await window.apiClient.register({
                fullName,
                email,
                password,
                phone
            });

            currentUser = {
                role: 'visitor',
                username: response.user.username,
                fullName: response.user.fullName,
                email: response.user.email,
                id: response.user.id
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showNotification('تم إنشاء الحساب بنجاح! تم تسجيل الدخول', 'success');
            setTimeout(() => {
                window.location.href = 'courses.html';
            }, 800);
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('فشل في إنشاء الحساب. جرب مرة أخرى', 'error');
        }
    } else {
        // Fallback to localStorage
        const visitors = getStoredVisitorUsers();
        const exists = visitors.some(u => u.username.toLowerCase() === email.toLowerCase());
        if (exists) {
            showNotification('هذا البريد مسجل مسبقاً', 'error');
            return;
        }

        const newUser = {
            username: email,
            password: password,
            role: 'visitor',
            fullName: fullName,
            email: email,
            phone: phone
        };
        visitors.push(newUser);
        saveStoredVisitorUsers(visitors);

        currentUser = {
            role: 'visitor',
            username: newUser.username,
            fullName: newUser.fullName,
            email: newUser.email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showNotification('تم إنشاء الحساب بنجاح! تم تسجيل الدخول', 'success');
        setTimeout(() => {
            window.location.href = 'courses.html';
        }, 800);
    }
}

// Courses Page Functions
function initializeCoursesPage() {
    displayCourses();
    
    // Initialize course registration modal
    const modal = document.getElementById('courseModal');
    const closeBtn = modal.querySelector('.close');
    const registrationForm = document.getElementById('courseRegistrationForm');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    registrationForm.addEventListener('submit', handleCourseRegistration);
}

function displayCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;
    
    coursesGrid.innerHTML = '';
    
    courses.forEach(course => {
        if (course.status === 'active') {
            const courseCard = createCourseCard(course);
            coursesGrid.appendChild(courseCard);
        }
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    card.innerHTML = `
        <div class="course-header">
            <h3>${course.name}</h3>
            <div class="training-hall">${course.trainingHall}</div>
        </div>
        <div class="course-body">
            <p class="course-description">${course.description}</p>
            <div class="course-actions">
                <button class="btn btn-primary" onclick="openRegistrationModal('${course.name}')">
                    سجل الآن
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function openRegistrationModal(courseName) {
    const modal = document.getElementById('courseModal');
    const courseNameInput = document.getElementById('courseName');
    
    courseNameInput.value = courseName;
    modal.style.display = 'block';
}

async function handleCourseRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const courseName = formData.get('courseName');
    const courseId = courses.find(c => c.name === courseName)?.id;
    
    if (!courseId) {
        showNotification('خطأ في تحديد الدورة', 'error');
        return;
    }

    const registrationData = {
        courseId: courseId,
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        idNumber: formData.get('idNumber'),
        qualification: formData.get('qualification'),
        workplace: formData.get('workplace')
    };
    
    if (isApiAvailable) {
        try {
            await window.apiClient.registerForCourse(registrationData);
            
            // Close modal and show success message
            document.getElementById('courseModal').style.display = 'none';
            event.target.reset();
            
            showNotification('تم التسجيل في الدورة بنجاح!', 'success');
            
            // Reload courses to update registration counts
            await loadData();
            displayCourses();
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('فشل في التسجيل. جرب مرة أخرى', 'error');
        }
    } else {
        // Fallback to localStorage
        const registration = {
            id: Date.now(),
            courseName: courseName,
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            idNumber: formData.get('idNumber'),
            qualification: formData.get('qualification'),
            workplace: formData.get('workplace'),
            registrationDate: new Date().toLocaleDateString('ar-SA'),
            courseId: courseId
        };
        
        registrations.push(registration);
        updateCourseRegistrationCounts();
        saveData();
        
        // Close modal and show success message
        document.getElementById('courseModal').style.display = 'none';
        event.target.reset();
        
        showNotification('تم التسجيل في الدورة بنجاح!', 'success');
    }
}

// Dashboard Functions
function initializeDashboard() {
    // Check if user is admin
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser || JSON.parse(savedUser).role !== 'admin') {
        showNotification('غير مصرح لك بالوصول إلى هذه الصفحة', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    currentUser = JSON.parse(savedUser);
    
    // Initialize dashboard
    displayDashboardStats();
    displayCoursesTable();
    displayRegistrationsTable();
    
    // Initialize event listeners
    initializeDashboardEvents();
}

function initializeDashboardEvents() {
    const addCourseBtn = document.getElementById('addCourseBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const courseForm = document.getElementById('courseForm');
    const courseModal = document.getElementById('courseModal');
    const closeBtn = courseModal.querySelector('.close');
    
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => {
            openCourseModal();
        });
    }
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (courseForm) {
        courseForm.addEventListener('submit', handleCourseSubmit);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            courseModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === courseModal) {
            courseModal.style.display = 'none';
        }
    });
}

async function displayDashboardStats() {
    if (isApiAvailable) {
        try {
            const stats = await window.apiClient.getDashboardStats();
            document.getElementById('totalCourses').textContent = stats.totalCourses;
            document.getElementById('totalRegistrations').textContent = stats.totalRegistrations;
            document.getElementById('activeCourses').textContent = stats.activeCourses;
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
            // Fallback to local calculation
            const totalCourses = courses.length;
            const totalRegistrations = registrations.length;
            const activeCourses = courses.filter(c => c.status === 'active').length;
            
            document.getElementById('totalCourses').textContent = totalCourses;
            document.getElementById('totalRegistrations').textContent = totalRegistrations;
            document.getElementById('activeCourses').textContent = activeCourses;
        }
    } else {
        // Fallback to local calculation
        const totalCourses = courses.length;
        const totalRegistrations = registrations.length;
        const activeCourses = courses.filter(c => c.status === 'active').length;
        
        document.getElementById('totalCourses').textContent = totalCourses;
        document.getElementById('totalRegistrations').textContent = totalRegistrations;
        document.getElementById('activeCourses').textContent = activeCourses;
    }
}

function displayCoursesTable() {
    const tbody = document.getElementById('coursesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.description}</td>
            <td>${course.trainingHall}</td>
            <td>${course.registrations}</td>
            <td>${course.status === 'active' ? 'نشطة' : 'غير نشطة'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editCourse(${course.id})">تعديل</button>
                    <button class="btn-delete" onclick="deleteCourse(${course.id})">حذف</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayRegistrationsTable() {
    const tbody = document.getElementById('registrationsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    registrations.forEach(registration => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${registration.courseName}</td>
            <td>${registration.fullName}</td>
            <td>${registration.phone}</td>
            <td>${registration.email}</td>
            <td>${registration.idNumber}</td>
            <td>${registration.qualification}</td>
            <td>${registration.workplace}</td>
            <td>${registration.registrationDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-delete" onclick="deleteRegistration(${registration.id})">حذف</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openCourseModal(courseId = null) {
    const modal = document.getElementById('courseModal');
    const modalTitle = document.getElementById('modalTitle');
    const courseForm = document.getElementById('courseForm');
    
    if (courseId) {
        // Edit mode
        const course = courses.find(c => c.id === courseId);
        if (course) {
            modalTitle.textContent = 'تعديل الدورة';
            document.getElementById('courseName').value = course.name;
            document.getElementById('courseDescription').value = course.description;
            document.getElementById('trainingHall').value = course.trainingHall;
            document.getElementById('courseStatus').value = course.status;
            courseForm.dataset.editId = courseId;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'إضافة دورة جديدة';
        courseForm.reset();
        delete courseForm.dataset.editId;
    }
    
    modal.style.display = 'block';
}

async function handleCourseSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const editId = event.target.dataset.editId;
    
    const courseData = {
        name: formData.get('courseName'),
        description: formData.get('courseDescription'),
        trainingHall: formData.get('trainingHall'),
        status: formData.get('courseStatus')
    };
    
    if (isApiAvailable) {
        try {
            if (editId) {
                // Edit existing course
                await window.apiClient.updateCourse(editId, courseData);
                showNotification('تم تحديث الدورة بنجاح!', 'success');
            } else {
                // Add new course
                await window.apiClient.createCourse(courseData);
                showNotification('تم إضافة الدورة بنجاح!', 'success');
            }
            
            // Reload data
            await loadData();
            await displayDashboardStats();
            displayCoursesTable();
            
            // Close modal
            document.getElementById('courseModal').style.display = 'none';
            event.target.reset();
        } catch (error) {
            console.error('Course operation error:', error);
            showNotification('فشل في حفظ الدورة', 'error');
        }
    } else {
        // Fallback to localStorage
        if (editId) {
            // Edit existing course
            const courseIndex = courses.findIndex(c => c.id === parseInt(editId));
            if (courseIndex !== -1) {
                courses[courseIndex] = {
                    ...courses[courseIndex],
                    name: formData.get('courseName'),
                    description: formData.get('courseDescription'),
                    trainingHall: formData.get('trainingHall'),
                    status: formData.get('courseStatus')
                };
            }
        } else {
            // Add new course
            const newCourse = {
                id: Date.now(),
                name: formData.get('courseName'),
                description: formData.get('courseDescription'),
                trainingHall: formData.get('trainingHall'),
                status: formData.get('courseStatus'),
                registrations: 0
            };
            courses.push(newCourse);
        }
        
        saveData();
        displayDashboardStats();
        displayCoursesTable();
        
        // Close modal
        document.getElementById('courseModal').style.display = 'none';
        event.target.reset();
        
        showNotification('تم حفظ الدورة بنجاح!', 'success');
    }
}

function editCourse(courseId) {
    openCourseModal(courseId);
}

async function deleteCourse(courseId) {
    if (confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
        if (isApiAvailable) {
            try {
                await window.apiClient.deleteCourse(courseId);
                
                // Reload data
                await loadData();
                await displayDashboardStats();
                displayCoursesTable();
                displayRegistrationsTable();
                
                showNotification('تم حذف الدورة بنجاح!', 'success');
            } catch (error) {
                console.error('Delete course error:', error);
                showNotification('فشل في حذف الدورة', 'error');
            }
        } else {
            // Fallback to localStorage
            courses = courses.filter(c => c.id !== courseId);
            // Also remove related registrations
            registrations = registrations.filter(r => r.courseId !== courseId);
            
            saveData();
            updateCourseRegistrationCounts();
            displayDashboardStats();
            displayCoursesTable();
            displayRegistrationsTable();
            
            showNotification('تم حذف الدورة بنجاح!', 'success');
        }
    }
}

async function deleteRegistration(registrationId) {
    if (confirm('هل أنت متأكد من حذف هذا التسجيل؟')) {
        if (isApiAvailable) {
            try {
                await window.apiClient.deleteRegistration(registrationId);
                
                // Reload data
                await loadData();
                await displayDashboardStats();
                displayRegistrationsTable();
                
                showNotification('تم حذف التسجيل بنجاح!', 'success');
            } catch (error) {
                console.error('Delete registration error:', error);
                showNotification('فشل في حذف التسجيل', 'error');
            }
        } else {
            // Fallback to localStorage
            registrations = registrations.filter(r => r.id !== registrationId);
            updateCourseRegistrationCounts();
            saveData();
            displayDashboardStats();
            displayRegistrationsTable();
            
            showNotification('تم حذف التسجيل بنجاح!', 'success');
        }
    }
}

function exportToExcel() {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "اسم الدورة,اسم المتدرب,رقم الجوال,البريد الإلكتروني,رقم الهوية,المؤهل العلمي,مكان العمل,تاريخ التسجيل\n";
    
    // Add data
    registrations.forEach(registration => {
        const row = [
            registration.courseName,
            registration.fullName,
            registration.phone,
            registration.email,
            registration.idNumber,
            registration.qualification,
            registration.workplace,
            registration.registrationDate
        ].join(',');
        csvContent += row + '\n';
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'تسجيلات_الدورات.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('تم تصدير البيانات بنجاح!', 'success');
}

async function logout() {
    if (isApiAvailable) {
        await window.apiClient.logout();
    }
    
    localStorage.removeItem('currentUser');
    currentUser = null;
    showNotification('تم تسجيل الخروج بنجاح', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Certificates Page Functions
function initializeCertificatesPage() {
    // No specific initialization needed for certificates page
    console.log('Certificates page initialized');
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2c5aa0'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 600;
    `;
    
    // Add animation CSS
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Security Functions
function validateInput(input) {
    // Basic input validation
    return input.trim().length > 0;
}

function sanitizeInput(input) {
    // Basic input sanitization
    return input.replace(/[<>]/g, '');
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('حدث خطأ في التطبيق', 'error');
});

// Export functions for global access
window.openRegistrationModal = openRegistrationModal;
window.editCourse = editCourse;
window.deleteCourse = deleteCourse;
window.deleteRegistration = deleteRegistration;
