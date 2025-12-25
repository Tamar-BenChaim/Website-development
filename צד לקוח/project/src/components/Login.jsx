import axios from "axios";
import { useNavigate } from "react-router";
import '../CSS/auth.css';

export default function Login() {
  const nav = useNavigate();

  const submit = e => {
    e.preventDefault();
    const id = e.target.id.value;

    axios.post(`http://localhost:5018/api/user/login?id=${id}`)
      .then(res => {
        localStorage.setItem("user", JSON.stringify(res.data));
        nav("/");
        window.location.reload();
      });
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <h1>התחברות</h1>
      <input name="id" placeholder="תעודת זהות" />
      <button>התחבר</button>
    </form>
  );
}
