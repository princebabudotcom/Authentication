const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://10.79.61.221',

  'https://yourapp.com',
  'https://admin.yourapp.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin
    // (mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
