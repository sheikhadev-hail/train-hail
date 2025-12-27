const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const path = require('path');
const config = require('./config');

const app = express();
const db = new sqlite3.Database(config.dbPath);

function seedAdminUsers() {
  if (!Array.isArray(config.admin) || config.admin.length === 0) {
    return;
  }

  config.admin.forEach(adminAccount => {
    if (!adminAccount || !adminAccount.username || !adminAccount.password) {
      return;
    }

    db.get(
      'SELECT id FROM users WHERE username = ?',
      [adminAccount.username],
      (lookupErr, existingUser) => {
        if (lookupErr) {
          console.error('❌ Failed to check admin user:', adminAccount.username, lookupErr);
          return;
        }

        if (existingUser) {
          return;
        }

        const passwordHash = bcrypt.hashSync(adminAccount.password, 10);
        db.run(
          'INSERT INTO users (username, email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
          [
            adminAccount.username,
            adminAccount.email || null,
            passwordHash,
            adminAccount.fullName || adminAccount.username,
            adminAccount.phone || null,
            'admin'
          ],
          insertErr => {
            if (insertErr) {
              console.error('❌ Failed to seed admin user:', adminAccount.username, insertErr);
            } else {
              console.log(`✅ Seeded admin account: ${adminAccount.username}`);
            }
          }
        );
      }
    );
  });
}

// خدمة الملفات الثابتة (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Routes للصفحات الأمامية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, 'courses.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/certificates', (req, res) => {
    res.sendFile(path.join(__dirname, 'certificates.html'));
});

app.get('/dashbord', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashbord.html'));
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // السماح بطلبات بدون origin (مثل Postman أو mobile apps)
    if (!origin) return callback(null, true);
    
    // قائمة الدومينات المسموحة
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'file://',
      /\.onrender\.com$/,  // جميع دومينات Render
      /\.railway\.app$/,   // جميع دومينات Railway
      /\.fly\.dev$/,       // جميع دومينات Fly.io
      // ============================================
      // ⚠️ مهم: أضف دومينك الخاص هنا بعد ربطه:
      // ============================================
      // 'https://YOUR-DOMAIN.com',        // مثال: 'https://training-hail.gov.sa'
      // 'https://www.YOUR-DOMAIN.com',   // مثال: 'https://www.training-hail.gov.sa'
      // ============================================
    ];
    
    // التحقق من الدومين
    if (allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return origin === pattern;
      } else if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return false;
    })) {
      callback(null, true);
    } else {
      // في الإنتاج، يمكنك إرجاع false بدلاً من true
      // للسماح فقط بالدومينات المحددة
      callback(null, true); // مؤقتاً نسمح بجميع الدومينات
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin role check middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Validation middleware
const validateRegistration = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone number required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// ========== AUTHENTICATION ROUTES ==========

// Visitor registration (public access - no authentication required)
app.post('/api/auth/visitor-register', 
  body('fullName').trim().isLength({ min: 2 }).withMessage('الاسم يجب أن يكون حقيقي'),
  body('phone').trim().isLength({ min: 10 }).withMessage('رقم الهاتف غير صحيح'),
  body('email').optional().isEmail().withMessage('البريد الإلكترونי غير صحيح'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'بيانات غير صحيحة',
        details: errors.array() 
      });
    }

    const { fullName, email, phone } = req.body;

    // Check if visitor already exists by phone or email
    let checkQuery = 'SELECT id FROM users WHERE phone = ?';
    let checkParams = [phone];
    
    if (email) {
      checkQuery += ' OR email = ?';
      checkParams.push(email);
    }

    db.get(checkQuery, checkParams, (err, existingVisitor) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في قاعدة البيانات' });
      }

      if (existingVisitor) {
        return res.status(400).json({ 
          error: 'سجل هذا الشخص من قبل', 
          message: 'يرجى استخدام بيانات أخرى أو التواصل مع الإدارة'
        });
      }

      // Insert new visitor (no password required)
      const username = email || `visitor_${phone}`;
      db.run(
        'INSERT INTO users (username, email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email || null, null, fullName, phone, 'visitor'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'فشل في إنشاء حساب الزائر' });
          }

          // Generate simple visitor token (no expiration for convenience)
          const token = jwt.sign(
            { id: this.lastID, username, role: 'visitor', phone },
            config.jwtSecret,
            { expiresIn: '30d' }
          );

          res.status(201).json({
            message: 'تم إنشاء حساب الزائر بنجاح',
            token,
            visitor: {
              id: this.lastID,
              username,
              fullName,
              email: email || null,
              phone,
              role: 'visitor'
            }
          });
        }
      );
    });
  }
);

// Admin/User registration (requires password)
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, email], (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const passwordHash = bcrypt.hashSync(password, 10);

      // Insert new user
      db.run(
        'INSERT INTO users (username, email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
        [email, email, passwordHash, fullName, phone, 'user'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, username: email, role: 'user' },
            config.jwtSecret,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
              id: this.lastID,
              username: email,
              fullName,
              email,
              role: 'user'
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', [
  body('username').trim().notEmpty().withMessage('Username required'),
  body('password').notEmpty().withMessage('Password required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, username],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          email: user.email,
          role: user.role
        }
      });
    }
  );
});

// Get current user info
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.created_at
      });
    }
  );
});

// ========== COURSES ROUTES ==========

// Get all courses (public)
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses ORDER BY created_at DESC', (err, courses) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Get registration count for each course
    const courseIds = courses.map(c => c.id);
    if (courseIds.length === 0) {
      return res.json(courses.map(course => ({ ...course, registrations: 0 })));
    }

    const placeholders = courseIds.map(() => '?').join(',');
    db.all(
      `SELECT course_id, COUNT(*) as count FROM registrations WHERE course_id IN (${placeholders}) GROUP BY course_id`,
      courseIds,
      (err, counts) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const countMap = {};
        counts.forEach(count => {
          countMap[count.course_id] = count.count;
        });

        const coursesWithCounts = courses.map(course => ({
          ...course,
          registrations: countMap[course.id] || 0
        }));

        res.json(coursesWithCounts);
      }
    );
  });
});

// Create course (admin only)
app.post('/api/courses', authenticateToken, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Course name required'),
  body('description').trim().notEmpty().withMessage('Course description required'),
  body('trainingHall').trim().notEmpty().withMessage('Training hall required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], (req, res) => {
  const { name, description, trainingHall, status = 'active' } = req.body;

  db.run(
    'INSERT INTO courses (name, description, training_hall, status) VALUES (?, ?, ?, ?)',
    [name, description, trainingHall, status],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create course' });
      }

      res.status(201).json({
        message: 'Course created successfully',
        course: {
          id: this.lastID,
          name,
          description,
          trainingHall,
          status,
          registrations: 0
        }
      });
    }
  );
});

// Update course (admin only)
app.put('/api/courses/:id', authenticateToken, requireAdmin, [
  body('name').trim().notEmpty().withMessage('Course name required'),
  body('description').trim().notEmpty().withMessage('Course description required'),
  body('trainingHall').trim().notEmpty().withMessage('Training hall required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], (req, res) => {
  const { id } = req.params;
  const { name, description, trainingHall, status } = req.body;

  db.run(
    'UPDATE courses SET name = ?, description = ?, training_hall = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, trainingHall, status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update course' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json({
        message: 'Course updated successfully',
        course: {
          id: parseInt(id),
          name,
          description,
          trainingHall,
          status
        }
      });
    }
  );
});

// Delete course (admin only)
app.delete('/api/courses/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM courses WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete course' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  });
});

// ========== REGISTRATIONS ROUTES ==========

// Register for course
app.post('/api/registrations', authenticateToken, [
  body('courseId').isInt().withMessage('Valid course ID required'),
  body('fullName').trim().notEmpty().withMessage('Full name required'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('idNumber').trim().notEmpty().withMessage('ID number required'),
  body('qualification').trim().notEmpty().withMessage('Qualification required'),
  body('workplace').trim().notEmpty().withMessage('Workplace required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], (req, res) => {
  const { courseId, fullName, phone, email, idNumber, qualification, workplace } = req.body;

  // Check if course exists
  db.get('SELECT * FROM courses WHERE id = ?', [courseId], (err, course) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.status !== 'active') {
      return res.status(400).json({ error: 'Course is not active' });
    }

    // Check if user already registered for this course
    db.get(
      'SELECT id FROM registrations WHERE course_id = ? AND user_id = ?',
      [courseId, req.user.id],
      (err, existing) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existing) {
          return res.status(400).json({ error: 'Already registered for this course' });
        }

        // Create registration
        db.run(
          `INSERT INTO registrations (course_id, user_id, full_name, phone, email, id_number, qualification, workplace) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [courseId, req.user.id, fullName, phone, email, idNumber, qualification, workplace],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to register for course' });
            }

            res.status(201).json({
              message: 'Successfully registered for course',
              registration: {
                id: this.lastID,
                courseId,
                fullName,
                phone,
                email,
                idNumber,
                qualification,
                workplace,
                registrationDate: new Date().toISOString()
              }
            });
          }
        );
      }
    );
  });
});

// Get all registrations (admin only)
app.get('/api/registrations', authenticateToken, requireAdmin, (req, res) => {
  const query = `
    SELECT r.*, c.name as course_name, u.username, u.email as user_email
    FROM registrations r
    JOIN courses c ON r.course_id = c.id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.registration_date DESC
  `;

  db.all(query, (err, registrations) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(registrations);
  });
});

// Delete registration (admin only)
app.delete('/api/registrations/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM registrations WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete registration' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ message: 'Registration deleted successfully' });
  });
});

// ========== DASHBOARD STATS (Admin only) ==========
app.get('/api/dashboard/stats', authenticateToken, requireAdmin, (req, res) => {
  const stats = {};

  // Get total courses
  db.get('SELECT COUNT(*) as count FROM courses', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    stats.totalCourses = result.count;

    // Get total registrations
    db.get('SELECT COUNT(*) as count FROM registrations', (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      stats.totalRegistrations = result.count;

      // Get active courses
      db.get('SELECT COUNT(*) as count FROM courses WHERE status = "active"', (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        stats.activeCourses = result.count;
        res.json(stats);
      });
    });
  });
});

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
const PORT = config.port;
seedAdminUsers();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/api`);
  const seededAdmins = Array.isArray(config.admin)
    ? config.admin.map(adminAccount => adminAccount.username).join(', ')
    : 'غير محدد';
  console.log(`🔐 Admin logins: ${seededAdmins}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});
