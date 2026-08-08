import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import tripRoutes from './routes/tripRoutes.js';
import authRoutes from './routes/authRoutes.js';
import shoppingRoutes from './routes/shoppingRoutes.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', tripRoutes);
app.use('/api/shopping', shoppingRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 핸들러
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    statusCode: 404,
  });
});

// 에러 핸들러
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ Trip One API Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
});
