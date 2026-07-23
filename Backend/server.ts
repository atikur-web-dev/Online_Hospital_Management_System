import app from './src/app.js';
import dotenv from 'dotenv';

// এনভায়রনমেন্ট ভেরিয়েবল লোড করুন
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});