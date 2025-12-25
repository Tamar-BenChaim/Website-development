import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import '../CSS/details.css';

const Details = ({products}) => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        const product = products.find(p => p.id == id)
        setCurrent(product);
    }, [])

    return (
        <div className="details-page">
            {current ? <>
            <h1>פרטי מוצר</h1>
            <p>מספר המוצר הוא {id}</p>
            <p>{current.name}</p>
            <div className='picture'><img src={`/pic/${current.name}.jpg`} alt={current.name} /></div>
            <p>{current.category}</p>
            <p>{current.price} ₪</p>
            </> : "...בטעינה"}
        </div>
    )
}

export default Details
