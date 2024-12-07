// firebaseConfig.js
import { initializeApp } from 'firebase/app';  // Giữ lại dòng này
import { getFirestore } from 'firebase/firestore'; // Import đúng hàm getFirestore

// Cấu hình Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyANIYn2QG7Rd_qE9L15oRCmqzC7HQAf7Qc",
    authDomain: "doan2-quanlyxe.firebaseapp.com",
    projectId: "doan2-quanlyxe",
    storageBucket: "doan2-quanlyxe.firebasestorage.app",
    messagingSenderId: "625875508834",
    appId: "1:625875508834:web:eee27df2c57d3f0ec93b3b",
    measurementId: "G-Z7P8VGG475"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app); // Đảm bảo gọi getFirestore đúng cách

// Export db để có thể sử dụng trong các component khác
export { db };
