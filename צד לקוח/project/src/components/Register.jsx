import axios from "axios";
import { useNavigate } from "react-router";
import '../CSS/auth.css';

const Register = () => {
  const nav = useNavigate();

  const submit = e => {
    e.preventDefault();
    const f = e.target;

    // Basic validation
    if (!f.id.value || !f.name.value || !f.email.value || !f.phone.value) {
      alert("אנא מלא את כל השדות");
      return;
    }

    axios.post("http://localhost:5018/api/user/register", null, { 
      params: {
        id: f.id.value,
        name: f.name.value,
        email: f.email.value,
        phoneNumber: f.phone.value
      }
    }).then(() => {
      alert("הרשמה הצליחה! אנא התחבר");
      nav("/login");
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.status === 400) {
        alert("שגיאה ברישום - אנא בדוק את הנתונים שהוזנו");
      } else {
        alert("שגיאה בשרת - נסה שוב מאוחר יותר");
      }
    });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submit}>
        <div className="form-header">
          <h1>הרשמה</h1>
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
          <div className="form-group">
            <label htmlFor="name">שם מלא</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="הכנס שם מלא" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">כתובת אימייל</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="הכנס כתובת אימייל" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">מספר טלפון</label>
            <input 
              id="phone" 
              name="phone" 
              type="tel" 
              placeholder="הכנס מספר טלפון" 
              required 
            />
          </div>
          <button type="submit" className="submit-btn">
            הירשם
          </button>
          <p>
            כבר רשום? <a href="/login">התחבר כאן</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;