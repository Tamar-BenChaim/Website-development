import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Statistics.css';


const Statistics = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const path = "http://localhost:5018/api";

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = () => {
        setLoading(true);
        Promise.all([
            axios.get(path + "/statistics/popular-products"),
            axios.get(path + "/statistics/active-users")
        ])
        .then(([productsRes, usersRes]) => {
            setPopularProducts(productsRes.data);
            setActiveUsers(usersRes.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching statistics:", err);
            alert("שגיאה בטעינת הסטטיסטיקות");
            setLoading(false);
        });
    };

    if (loading) {
        return (
            <div className="statistics-container">
                <h2>סטטיסטיקות</h2>
                <div className="loading">טוען נתונים...</div>
            </div>
        );
    }

    return (
        <div className="statistics-container">
            <h2>סטטיסטיקות</h2>

            <div className="statistics-grid">
                {/* Popular Products */}
                <div className="statistics-section">
                    <h3>המוצרים הפופולריים ביותר</h3>
                    <div className="stats-list">
                        {popularProducts.length > 0 ? (
                            popularProducts.map((product, index) => (
                                <div key={product.id || product.productId} className="stats-item">
                                    <div className="rank">#{index + 1}</div>
                                    <div className="item-details">
                                        <h4>{product.name || product.productName}</h4>
                                        <p className="category">{product.category}</p>
                                        {/* <p className="stats">נמכר: {product.totalSold || product.quantity} יחידות</p> */}
                                    </div>
                                    <div className="item-price">
                                        {/* {product.price || product.unitPrice} ₪ */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">אין נתונים זמינים</p>
                        )}
                    </div>
                </div>

                {/* Active Users */}
                <div className="statistics-section">
                    <h3>המשתמשים הפעילים ביותר</h3>
                    <div className="stats-list">
                        {activeUsers.length > 0 ? (
                            activeUsers.map((user, index) => (
                                <div key={user.id || user.userId} className="stats-item">
                                    <div className="rank">#{index + 1}</div>
                                    <div className="item-details">
                                        <h4>{user.name || user.userName}</h4>
                                        {/* <p className="stats">הזמנות: {user.orderCount || user.totalOrders}</p>
                                        <p className="stats">סה"כ הוצאה: {user.totalSpent || user.totalAmount} ₪</p> */}
                                    </div>
                                    <div className="user-contact">
                                        <small>{user.email || user.userEmail}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">אין נתונים זמינים</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;