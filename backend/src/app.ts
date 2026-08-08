import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import tripRoutes from './routes/tripRoutes.js';
import authRoutes from './routes/authRoutes.js';
import shoppingRoutes from './routes/shoppingRoutes.js';
import travelHelperRoutes from './routes/travelHelperRoutes.js';
import { connectDB } from './config/db.js';
import * as dotenv from 'dotenv';

// .env 로드
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

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
app.use('/api/travel-helper', travelHelperRoutes);

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
const startServer = async () => {
  try {
    // MongoDB 연결 (MONGODB_URI 가 있으면 활성화)
    if (MONGODB_URI && MONGODB_URI !== 'mongodb+srv://username:password@cluster.mongodb.net/trip-one?retryWrites=true&w=majority') {
      console.log('🔌 MongoDB 연결 시도...');
      await connectDB();
      console.log('✅ MongoDB 연결 성공');
    } else {
      console.log('📝 (메모리 저장소 사용 중 - 데이터는 재시작 시 소실됩니다)');
    }
    
    app.listen(PORT, () => {
      console.log(`✅ Trip One API Server running on http://localhost:${PORT}`);
      console.log(`📝 (메모리 저장소 사용 중 - 데이터는 재시작 시 소실됩니다)`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();
