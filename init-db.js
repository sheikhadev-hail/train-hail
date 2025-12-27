const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const config = require('./config');

// إنشاء الاتصال بقاعدة البيانات
const db = new sqlite3.Database(config.dbPath);

db.serialize(() => {
  console.log('🔄 Initializing database...');

  // إنشاء جدول المستخدمين
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'visitor',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, err => {
    if (err) console.error('❌ Error creating users table:', err);
    else console.log('✅ Users table created/verified');
  });

  // إنشاء جدول الدورات
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    training_hall TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, err => {
    if (err) console.error('❌ Error creating courses table:', err);
    else console.log('✅ Courses table created/verified');
  });

  // إنشاء جدول التسجيلات
  db.run(`CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    id_number TEXT NOT NULL,
    qualification TEXT NOT NULL,
    workplace TEXT NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`, err => {
    if (err) console.error('❌ Error creating registrations table:', err);
    else console.log('✅ Registrations table created/verified');
  });

  // --- إنشاء حسابات الإدمن من config.js ---
  console.log('\n🔐 حسابات المديرين تم إنشاؤها بهذه البيانات:\n');

  config.admin.forEach((admin, index) => {
    const passwordHash = bcrypt.hashSync(admin.password, 10);

    db.run(
      `INSERT OR IGNORE INTO users (username, email, password_hash, full_name, phone, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [admin.username, admin.email, passwordHash, admin.fullName, '', 'admin'],
      function(err) {
        if (err) {
          console.error(`❌ خطأ في إنشاء المدير ${index + 1}:`, err);
        } else if (this.changes > 0) {
          console.log(`✅ إنشاء المدير ${index + 1}:`);
          console.log(`   الاسم الكامل: ${admin.fullName}`);
          console.log(`   اسم المستخدم: ${admin.username}`);
          console.log(`   كلمة المرور: ${admin.password}\n`);
        } else {
          console.log(`ℹ  المدير ${index + 1} موجود مسبقاً (${admin.username})`);
        }
      }
    );
  });

  // --- إدخال الدورات الافتراضية ---
  const defaultCourses = [
    { name: "مهارات السكرتارية وإدارة المكاتب", description: "تعلم مهارات تنظيم وإدارة المكاتب والسكرتارية بفعالية.", training_hall: "القاعه التدريبية" },
    { name: "هيئة وتطوير القيادات الإدارية", description: "تطوير مهارات القيادة والإدارة الحديثة لتحسين الأداء المؤسسي.", training_hall: "القاعه التدريبية" },
    { name: "مهارات المساعدة الإدارية", description: "اكتساب المهارات اللازمة لدعم الإدارة وتنظيم المهام بكفاءة.", training_hall: "القاعه التدريبية" },
    { name: "التميز في اختبار القدرات", description: "استراتيجيات وأساليب للتحضير والنجاح في اختبار القدرات بكفاءة.", training_hall: "القاعه التدريبية" },
    { name: "كيفية إعداد السيرة الذاتية", description: "تعلم طرق إعداد سيرة ذاتية احترافية تجذب انتباه أصحاب العمل.", training_hall: "القاعه التدريبية" }
  ];

  const insertCourse = db.prepare('INSERT OR IGNORE INTO courses (name, description, training_hall) VALUES (?, ?, ?)');
  defaultCourses.forEach(course => insertCourse.run([course.name, course.description, course.training_hall]));
  insertCourse.finalize();

  console.log('✅ Default courses inserted');
  console.log('\n🎉 Database initialization completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm start');
  console.log(`2. API will be available at: http://localhost:${config.port}`);

  // إغلاق قاعدة البيانات
  db.close(err => {
    if (err) console.error('❌ Error closing database:', err);
    else console.log('\n📁 Database connection closed');
  });
});
