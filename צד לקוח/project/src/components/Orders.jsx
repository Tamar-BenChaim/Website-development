import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [visibleOrders, setVisibleOrders] = useState(5);
    const path = "http://localhost:5018/api";

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios.get(path + "/order")
            .then(res => {
                console.log("FULL API Response:", res);
                console.log("Response data:", res.data);
                console.log("First order:", res.data[0]);
                if (res.data[0]) {
                    console.log("First order keys:", Object.keys(res.data[0]));
                    console.log("First order User:", res.data[0].User);
                    console.log("First order UserName:", res.data[0].UserName);
                    console.log("First order UserId:", res.data[0].UserId);
                    console.log("First order Items:", res.data[0].Items);
                }
                // Sort orders by date (most recent first)
                const sortedOrders = res.data.sort((a, b) => new Date(b.OrderDate || b.orderDate) - new Date(a.OrderDate || a.orderDate));
                setOrders(sortedOrders);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                console.error("Error response:", err.response);
                alert("שגיאה בטעינת ההזמנות");
            });
    };

    const getSelectedOrder = () => {
        return orders.find(order => (order.Id || order.id) === selectedOrderId);
    };

    const loadMoreOrders = () => {
        setVisibleOrders(prev => prev + 5);
    };

    const handleOrderClick = (order) => {
        console.log('=== ORDER CLICKED ===');
        console.log('Clicked order ID:', order.Id || order.id);
        setSelectedOrderId(order.Id || order.id);
    };

    const calculateOrderTotal = (items) => {
        if (!items || !Array.isArray(items) || items.length === 0) {
            console.log('No items to calculate total');
            return 0;
        }
        
        let total = 0;
        items.forEach((item, index) => {
            const price = item.Price || item.price;
            const quantity = item.Quantity || item.quantity;
            console.log(`Item ${index}:`, item.ProductName, 'Price:', price, 'Quantity:', quantity);
            if (price && quantity) {
                const itemTotal = price * quantity;
                total += itemTotal;
                console.log(`Item ${index} total:`, itemTotal, 'Running total:', total);
            }
        });
        
        console.log('Final total:', total);
        return total;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'תאריך לא זמין';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'תאריך לא תקין';
            return date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL');
        } catch (error) {
            return 'תאריך לא תקין';
        }
    };

    return (
        <div className="orders-container">
            <h2>ניהול הזמנות</h2>

            {!selectedOrderId ? (
                <div>
                    <div className="orders-grid">
                        {orders.slice(0, visibleOrders).map(order => (
                            <div key={order.Id} className="order-card" onClick={() => handleOrderClick(order)}>
                                <div className="order-header"> 
                                    <h3>הזמנה #{order.id}</h3>
                                    <p className="order-date">{formatDate(order.OrderDate || order.orderDate)}</p>
                                </div>
                                <div className="order-info">
                                    <p><strong>לקוח:</strong> {order.UserName || order.userName || 'לא זמין'}</p>
                                    <p><strong>סה"כ פריטים:</strong> {(order.Items || order.items || []).length}</p>
                                    <p><strong>סה"כ לתשלום:</strong> {calculateOrderTotal(order.Items || order.items || [])} ₪</p>
                                </div>
                                <div className="order-status">
                                    <span className="status-badge">לחץ לפרטים</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {visibleOrders < orders.length && (
                        <div className="load-more-container">
                            <button onClick={loadMoreOrders} className="load-more-btn">
                                טען עוד 5 הזמנות
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="order-details">
                    {(() => {
                        const selectedOrder = getSelectedOrder();
                        console.log('=== RENDERING ORDER DETAILS ===');
                        console.log('selectedOrder exists:', !!selectedOrder);
                        console.log('selectedOrder:', selectedOrder);
                        return null;
                    })()}
                    <button onClick={() => setSelectedOrderId(null)} className="back-btn">
                        ← חזרה לרשימת ההזמנות
                    </button>

                    <div className="order-details-header">
                        <h3>הזמנה #{getSelectedOrder()?.Id || getSelectedOrder()?.id}</h3>
                        <p className="order-date">{formatDate(getSelectedOrder()?.OrderDate || getSelectedOrder()?.orderDate)}</p>
                    </div>

                    <div className="customer-details">
                        <h4>פרטי הלקוח:</h4>
                        <p><strong>שם:</strong> {getSelectedOrder()?.UserName || getSelectedOrder()?.userName || 'לא זמין'}</p>
                        <p><strong>טלפון:</strong> {getSelectedOrder()?.UserPhone || getSelectedOrder()?.userPhone || 'לא זמין'}</p>
                        <p><strong>אימייל:</strong> {getSelectedOrder()?.UserEmail || getSelectedOrder()?.userEmail || 'לא זמין'}</p>
                        <p><strong>מזהה משתמש:</strong> {getSelectedOrder()?.UserId || getSelectedOrder()?.userId || 'לא זמין'}</p>

                        <p><strong>כתובת למשלוח:</strong> {getSelectedOrder()?.DeliveryAddress || getSelectedOrder()?.deliveryAddress || 'לא זמין'}</p>
                        <p><strong>תאריך ושעת הארוע:</strong> {getSelectedOrder()?.EventDate || getSelectedOrder()?.eventDate || 'לא זמין'}</p>
                        <p><strong>הערות להזמנה:</strong> {getSelectedOrder()?.Notes || getSelectedOrder()?.notes || 'ללא הערות'}</p>
                    </div>

                    <div className="order-items-section">
                        <h4>פריטי ההזמנה:</h4>
                        <table className="order-items-table">
                            <thead>
                                <tr>
                                    <th>מוצר</th>
                                    <th>קטגוריה</th>
                                    <th>כמות</th>
                                    <th>מחיר יחידה</th>
                                    <th>סה"כ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(getSelectedOrder()?.Items || getSelectedOrder()?.items || []).map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.ProductName || item.productName || 'מוצר לא זמין'}</td>
                                        <td>{item.Category || item.category || 'לא זמין'}</td>
                                        <td>{item.Quantity || item.quantity || 1}</td>
                                        <td>{item.Price || item.price ? `${item.Price || item.price} ₪` : 'לא זמין'}</td>
                                        <td>{(item.Price || item.price) && (item.Quantity || item.quantity) ? `${(item.Price || item.price) * (item.Quantity || item.quantity)} ₪` : 'לא זמין'}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4"><strong>סה"כ לתשלום:</strong></td>
                                    <td><strong>{(() => {
                                        const items = getSelectedOrder()?.Items || getSelectedOrder()?.items || [];
                                        console.log('About to calculate total for:', items);
                                        const total = calculateOrderTotal(items);
                                        console.log('Calculated total result:', total);
                                        return total;
                                    })()} ₪</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;