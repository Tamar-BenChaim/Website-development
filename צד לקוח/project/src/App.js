import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/animations.css';

import AddProduct from './components/AddProduct';
import HomePage from './components/HomePage';
import Details from './components/Details';
import UpdateProduct from './components/UpdateProduct';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Statistics from './components/Statistics';

function App() {

  const path = "http://localhost:5018/api";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const functionUpdateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? updatedProduct : p));
  };

  const funDeleteProductFromList = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const AddProductToList = (product) => {
    setProducts(prev => [...prev, product]);
  };

  const logout = () => {
    try{
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      setUser(null);
      navigate("/login");} 
    catch{alert("שגיאה בעת ההתנתקות")}
    navigate("/login");
  };

  useEffect(() => {
    axios.get(path + "/Product")
      .then(res => setProducts(res.data))
      .catch(() => alert("השרת לא זמין כעת"));
  }, []);

  return (
    <div>
      {/* ===== Header ===== */}
      <header className="navbar">
        <h2 className="logo">קייטרינג ניחוחות הבית</h2>

        <nav>
          <Link to="/">בית</Link>
          {localStorage.getItem("user") ? (JSON.parse(localStorage.getItem("user")).name != "מנהל" ? 
          <Link to="/cart">🛒 עגלה</Link>
          : null) : <Link to="/cart">🛒 עגלה</Link>}

          {user && (
            <>
              {user.name === "מנהל" && (
                <>
                  <Link to="/orders">📋 הזמנות</Link>
                  <Link to="/statistics">📊 סטטיסטיקות</Link>
                </>
              )}
              <span className="hello">שלום {user?.name}</span>
              <button className="logout" onClick={logout}>התנתק</button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login">התחברות</Link>
              <Link to="/register">הרשמה</Link>
            </>
          )}
        </nav>
      </header>

      {/* ===== Routes ===== */}
      <main className="container">
        <Routes>
          <Route path="/" element={
            <HomePage
              products={products}
              funDeleteProductFromList={funDeleteProductFromList}
            />
          } />

          <Route path="/add" element={
            user
              ? <AddProduct AddProductToList={AddProductToList} />
              : <Login setUser={setUser} />
          } />

          <Route path="/update/:id" element={
            <UpdateProduct
              products={products}
              functionUpdateProduct={functionUpdateProduct}
            />
          } />

          <Route path="/details/:id" element={
            <Details products={products} />
          } />

          <Route path="/cart" element={
            <Cart />
          } />

          <Route path="/orders" element={
            user && user.name === "מנהל" ? <Orders /> : <Login setUser={setUser} />
          } />

          <Route path="/statistics" element={
            user && user.name === "מנהל" ? <Statistics /> : <Login setUser={setUser} />
          } />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<h1>404 - לא נמצא</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
