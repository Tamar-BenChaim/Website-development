import axios from "axios";
import { useNavigate } from "react-router";
import '../CSS/auth.css';

export default function Login({ setUser }) {
  const nav = useNavigate();

  const submit = e => {
    e.preventDefault();
    const id = e.target.id.value;

    axios.post(`http://localhost:5018/api/user/login?id=${id}`)
      .then(res => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        nav("/");
        window.location.reload();
      })
      .catch(err => {
        alert("שגיאה בהתחברות - אנא בדוק את פרטי ההתחברות");
      });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submit}>
        <div className="form-header">
          <h1>התחברות</h1>
        </div>
        <div className="form-content">
          <div className="form-group">
            <label htmlFor="id">תעודת זהות</label>
            <input 
              id="id" 
              name="id" 
              type="text" 
              placeholder="הכנס תעודת זהות" 
              required 
            />
          </div>
          <button type="submit" className="submit-btn">
            התחבר
          </button>
          <p>
            עדיין לא רשום? <a href="/register">הירשם כאן</a>
          </p>
        </div>
      </form>
    </div>
  );
}
