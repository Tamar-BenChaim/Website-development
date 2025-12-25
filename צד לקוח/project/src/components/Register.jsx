import axios from "axios";
import { useNavigate } from "react-router";
import '../CSS/auth.css';

const  Register=() => {
  const nav = useNavigate();

  const submit = e => {
    e.preventDefault();
    const f = e.target;

    // Basic validation
    if (!f.id.value || !f.name.value || !f.email.value || !f.phone.value) {
      alert("אנא מלא את כל השדות");
      return;
    }

    axios.post("http://localhost:5018/api/user/register",null,{ 
      params: {
      id: f.id.value,
      name: f.name.value,
      email: f.email.value,
      phoneNumber: f.phone.value
      }
    }).then(() => nav("/login"))
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
    <form className="auth-form" onSubmit={submit}>
      <h1>הרשמה</h1>
      <input name="id" placeholder="תעודת זהות" />
      <input name="name" placeholder="שם" />
      <input name="email" placeholder="אימייל" />
      <input name="phone" placeholder="טלפון" />
      <button>הרשמה</button>
    </form>
  );
}
export default Register;
