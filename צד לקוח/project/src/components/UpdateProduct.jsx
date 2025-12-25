import React from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import '../CSS/ProductsForm.css';

const UpdateProduct = ({products,functionUpdateProduct}) => {

    const navigate = useNavigate();
    const { id } = useParams();
    const currentProduct = products.find(p => p.id == id )
    const path = "http://localhost:5018/api"

    const updateProductSubmitted = (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedProduct = {
            id: currentProduct.id,
            name: form.name.value,
            category: form.category.value,
            price: form.price.value
        };

        axios.put(path+"/Product/"+id  , updatedProduct).then(res=>{
            console.log(res);
            functionUpdateProduct(id, updatedProduct);
            navigate("/")
            window.location.reload();
        })
    }

    return (
        <div className="product-form-container">
            <h1>עידכון מוצר</h1>
            <form onSubmit={((e) => { updateProductSubmitted(e) })}>
                <input type="text" defaultValue={currentProduct.name} name="name" placeholder="שם המוצר" />
                <input type="text" defaultValue={currentProduct.category} name="category" placeholder="קטגוריה" />
                <input type="number" defaultValue={currentProduct.price} name="price" placeholder="מחיר" />
                <button >עדכון</button>
            </form>
            
        </div>
    )
}

export default UpdateProduct
