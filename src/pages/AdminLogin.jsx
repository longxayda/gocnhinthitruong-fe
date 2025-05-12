import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://api.gocnhinthitruong.com/api/admin/login', { username, password });
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessToken', res.data.accessToken); // Lưu token
  
      alert(res.data.message);
      navigate('/admin/add-articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <form onSubmit={handleSubmit} className="p-4 rounded shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Đăng nhập Admin</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Tài khoản</label>
          <input
            type="email"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
      </form>
    </div>
  );
}

export default AdminLogin;
