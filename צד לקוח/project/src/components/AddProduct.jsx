import React from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import '../CSS/ProductsForm.css';

const AddProduct = ({AddProductToList}) => {
    const navigate = useNavigate();
    const path = "http://localhost:5018/api"
    const addProductSubmitted =(e)=>{
        e.preventDefault();
        const form = e.target;
        const newProduct = {
            id:0, 
            name:form.name.value,
            category:form.category.value,
            price:form.price.value
        };

        axios.post( path+"/Product",   newProduct ).then(res=>{

            console.log("newApartmentfrom server", res);
            AddProductToList(newProduct)
            navigate("/")

        })
    }

    return (
        <>
        <div className="product-form-container">
        <h1>הוספת מוצר</h1>
        <form onSubmit={((e) => { addProductSubmitted(e) })}>
            <input type="text" name="name" placeholder="שם" />
            <input type="text" name="category" placeholder="קטגוריה" />
            <input type="number" name="price" placeholder="מחיר" />
            <button >הוסף</button>
        </form>
        </div>
            
        </>
    )
}

export default AddProduct
