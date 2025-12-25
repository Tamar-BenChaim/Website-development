import React from 'react'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../CSS/card.css';


const Card = ({p,setSelectedId,setShowConfirm,updateClicked}) => {

    const [quantity, setQuantity] = useState(1);

    const AddToCart =(product)=>{
        if (!JSON.parse(localStorage.getItem("cart"))){
            localStorage.setItem("cart", JSON.stringify([]));
        }
        const cart = JSON.parse(localStorage.getItem("cart"));
        const item = cart.find(item => item.product.id === product.id);
        if(item){
            const updatedCart = cart.map(item => {
                if(item.product.id === product.id){
                    return {...item, count: item.count + quantity};
                }
                return item;
            });
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        } else {
            const cart = JSON.parse(localStorage.getItem("cart"));
            cart.push({product: product, count: quantity});
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }


    return (
        <div>
            <div key={p.id} className="Products">
                <p>{p.name}</p>
                <div className='picture'><img src={`/pic/${p.name}.jpg`} alt={p.name} /></div>
                <p>{p.category}</p>
                <p>{p.price} ₪</p>
                {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).name == "מנהל" ? (
                <div>
                    <button onClick={() => { setSelectedId(p.id); setShowConfirm(true); }}>🗑️</button>
                    <button onClick={() => { updateClicked(p.id) }}>✏️</button>
                </div>
                ) : 
                <div>
                    <button onClick={() => AddToCart(p)}>הוסף לסל</button>
                </div>}
                <Link to={`/details/${p.id}`}>לפרטים</Link>
            </div>
        </div>
    )
}

export default Card
