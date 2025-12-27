// Configuration file
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  nodeEnv: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || './database.sqlite',

  // Admin credentials
  admin: [
    {
      username: 'admin-m',
      password: 'mohmd77',
      email: 'admin@training.gov.sa',
      fullName: 'مدير المركز'
    },
    {
      username: 'vol-ahood',
      password: 'ahood7',
      email: 'volunteer@training.gov.sa',
      fullName: 'مسؤولة التطوع'
    },
    {
      username: 'dev-sheikha',
      password: 'sheikha8',
      email: 'sheikhaalbander@gmail.com',
      fullName: 'مطورة شيخة'
    },
    {
      username: 'dev-salma',
      password: 'salma9',
      email: 'salma@training.gov.sa',
      fullName: 'مطورة سلمى'
    },
    {
      username: 'dev-reemass',
      password: 'rmmas10',
      email: 'reemass@training.gov.sa',
      fullName: 'مطورة ريماس'
    }
  ]
};
