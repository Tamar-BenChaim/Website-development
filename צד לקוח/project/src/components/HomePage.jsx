import React from 'react'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Card from './Card';

const HomePage = ({products,funDeleteProductFromList}) => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const path = "http://localhost:5018/api"

    const deleteClicked =(id)=>{

        axios.delete(path +"/Product/" + id).then(res => {
            console.log(res);
            funDeleteProductFromList(id)
            navigate("/")
        })
    }
    const updateClicked =(id)=>{
        navigate("/update/"+id)
    }

    const AddClicked =()=>{
        navigate("/add")
    }

    return (
        <div>
            {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).name == "מנהל" ? (
            <button className="add" onClick={()=>{AddClicked()}}><p className='addp'>הוסף מוצר</p></button>)
            : null}
            {products.length != 0 ? <ul>
                {products.map(p =>
                    <Card p={p} setSelectedId={setSelectedId} setShowConfirm={setShowConfirm} updateClicked={updateClicked} />
                )}
                </ul> :
                <p>...המוצרים בטעינה</p>}
                {showConfirm && (
                <div className="modal-backdrop">
                    <div className="modal">
                    <h3>?בטוח שתרצה למחוק</h3>

                    <button onClick={() => {
                        deleteClicked(selectedId);
                        setShowConfirm(false);
                    }}>
                        כן, למחוק
                    </button>

                    <button onClick={() => setShowConfirm(false)}>
                        ביטול
                    </button>
                    </div>
                </div>
                )} 
        </div>
    )
}

export default HomePage
