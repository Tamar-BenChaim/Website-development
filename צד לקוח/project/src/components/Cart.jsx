import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/CartCards.css';

const Cart = () => {

    const path = "http://localhost:5018/api";
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [address, setAddress] = useState('');
    const [dateHour, setDateHour] = useState('');

    const [items, setItems] = useState(() => {
        try {
            const cartData = localStorage.getItem("cart");
            if (cartData) {
                const parsedCart = JSON.parse(cartData);
                // Filter out invalid items (products with ID 0 or invalid structure)
                const validItems = parsedCart.filter(item => 
                    item && 
                    item.product && 
                    item.product.id && 
                    item.product.id !== 0 && 
                    item.count && 
                    item.count > 0
                );
                
                // Update localStorage if we filtered out invalid items
                if (validItems.length !== parsedCart.length) {
                    localStorage.setItem("cart", JSON.stringify(validItems));
                }
                
                return validItems;
            }
            return [];
        } catch (error) {
            console.error("Error loading cart:", error);
            localStorage.removeItem("cart"); // Clear corrupted cart
            return [];
        }
    });

    const AddCnt = (id) => {
        const items = JSON.parse(localStorage.getItem("cart"));
        const item = items.find(item => item.product.id === id);
        if (item) {
            item.count += 1;
            localStorage.setItem("cart", JSON.stringify(items))
            setItems(items);
        }
    }   
    const DesCnt =(id)=>{
        
        const items = JSON.parse(localStorage.getItem("cart"));
        const item = items.find(item => item.product.id === id);
        if (item && item.count > 1){
            item.count -= 1;
            localStorage.setItem("cart", JSON.stringify(items))
            setItems(items);
        }
        if (item && item.count == 1){
            const newItems = items.filter(item => item.product.id !== id);
            localStorage.setItem("cart", JSON.stringify(newItems))
            setItems(newItems);
        }
    }

    const CreateOrder = () => {
        if (localStorage.getItem("user")) {
            setShowOrderForm(true);
        } else {
            setShowLoginModal(true);
        }
    };

    const SubmitOrder = () => {
        if (!address.trim()) {
            alert("אנא הכנס כתובת משלוח");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const orderData = {
            UserId: user.id,
            Address: address,
            DateAndHour: dateHour,
            Items: items.map(it => ({
                Product: it.product,
                Quantity: it.count
            }))
        };

        console.log("SUBMITTING ORDER DATA:", orderData);

        axios.post(path + "/order", orderData)
        .then((response) => {
            console.log("ORDER CREATED SUCCESSFULLY:", response.data);
            alert("ההזמנה נוצרה בהצלחה");
            localStorage.removeItem("cart");
            setItems([]);
            setShowOrderForm(false);
            setAddress('');
            setDateHour('');
        })
        .catch(err => {
            console.error("ORDER CREATION ERROR:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);

            if (err.response?.status === 400) {
                alert(`שגיאה ביצירת ההזמנה: ${err.response.data || 'נתונים לא תקינים'}`);
            } else if (err.response?.status === 404) {
                alert("משתמש או מוצר לא נמצא במערכת");
            } else {
                alert("שגיאה ביצירת ההזמנה - בדוק את החיבור לשרת");
            }
        });
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.product.price * item.count), 0);
    };

    const clearCart = () => {
        localStorage.removeItem("cart");
        setItems([]);
    };
    console.log("CART ITEMS:", items);
        
    return (
        <div className="cart-container">
            <h2>עגלה</h2>
            {items?.length != 0 ? <ul>
                {items.map(it =>
                    <li key={it.product.id} className="Products">
                        <p>{it.product.name}</p>
                        <p>קטגוריה: {it.product.category}</p>
                        <p>מחיר: {it.product.price} ₪</p>
                        <div>
                        <button onClick={() => AddCnt(it.product.id)}>➕</button>
                        <p>{it.count}</p>
                        <button onClick={() => DesCnt(it.product.id)}>➖</button>
                        </div>
                        <Link to={it.product.id && it.product.id !== 0 ? `/details/${it.product.id}` : '#'} 
                              onClick={(e) => {
                                  if (!it.product.id || it.product.id === 0) {
                                      e.preventDefault();
                                      alert('מוצר זה אינו זמין');
                                  }
                              }}>
                            לפרטים
                        </Link>
                    </li>
                )}
            </ul> :
                <p>הסל ריק , הכנס פריטים </p>}
        {items?.length != 0 && (
        <>
        <div style={{gridColumn: '1 / -1', marginTop: '20px', display:'flex', justifyContent:'space-between'}}></div>
        <button onClick={() => CreateOrder()}>שליחת הזמנה</button>
        <button onClick={clearCart} style={{marginLeft: '10px', backgroundColor: '#dc3545'}}>נקה סל</button>
        </>
        )}
        {showLoginModal && (
            <div className="modal-backdrop">
                <div className="modal">
                    <h3>אתה לא מחובר</h3>
                    <p>פעם ראשונה?</p>
                    <button onClick={() => {
                        navigate("/register");
                        setShowLoginModal(false);
                    }}>
                        הרשמה
                    </button>
                    <p>אם אתה כבר משתמש רשום</p>
                    <button onClick={() => {
                        navigate("/login");
                        setShowLoginModal(false);
                    }}>
                        התחברות
                    </button>
                    <button onClick={() => setShowLoginModal(false)}>
                        ביטול
                    </button>
                </div>
            </div>
        )}
        {showOrderForm && (
            <div className="modal-backdrop">
                <div className="modal order-form">
                    <h3>פרטי ההזמנה</h3>
                    
                    <div className="user-details">
                        <h4>פרטי הלקוח</h4>
                        <p><strong>שם:</strong> {JSON.parse(localStorage.getItem("user")).name}</p>
                        <p><strong>טלפון:</strong> {JSON.parse(localStorage.getItem("user")).phoneNumber}</p>
                        <p><strong>אימייל:</strong> {JSON.parse(localStorage.getItem("user")).email}</p>
                    </div>

                    <div className="address-input">
                        <label>כתובת משלוח</label>
                        <input 
                            type="text" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="הכנס כתובת משלוח"
                            required
                        />
                        <label>תאריך ושעת הארוע</label>
                        <input 
                            type="text" 
                            value={dateHour} 
                            onChange={(e) => setDateHour(e.target.value)}
                            placeholder="הכנס תאריך ושעה "
                            required
                        />
                    </div>

                    <div className="order-items">
                        <h4>פריטי ההזמנה</h4>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>סה"כ</th>
                                    <th>מחיר יחידה</th>
                                    <th>כמות</th>
                                    <th>מוצר</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(it => (
                                    <tr key={it.product.id}>
                                        <td>{it.product.price * it.count} ₪</td>
                                        <td>{it.product.price} ₪</td>
                                        <td>{it.count}</td>
                                        <td>{it.product.name}</td>  
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><strong>{calculateTotal()} ₪</strong></td>
                                    <td colSpan="3"><strong>סה"כ לתשלום:</strong></td> 
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="order-actions">
                        <button onClick={SubmitOrder} className="submit-order">
                            אישור ושליחת הזמנה
                        </button>
                        <button onClick={() => setShowOrderForm(false)} className="cancel-order">
                            ביטול
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}

export default Cart
