import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./StaffLogin.css";

export default function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/staff/login", { username: username, password: password });
      localStorage.setItem("token", res.data.token);
      navigate("/staff/dashboard", { replace: true });
    } catch (err) {
      setMessage("登入失敗, 請檢查賬號密碼");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <h2>員工登入</h2>
        <div>
          <p className="input-title">賬號</p>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="輸入賬號" />
        </div>
        <div>
          <p className="input-title">密碼</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="輸入密碼" />
        </div>
        <button className="login-btn" type="submit">
          登入
        </button>
        <p className="message">{message}</p>
      </div>
    </form>
  );
}
