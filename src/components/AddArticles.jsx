import { useState } from 'react';
import { postArticle } from '../api/ArticlesApi.js';

function AddArticle() {
  const [topic, setTopic] = useState('tintuc');
  const [article, setArticle] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    content: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setArticle({
      ...article,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postArticle(topic, article);
      setStatus('✅ Bài viết đã được thêm thành công!');
      setArticle({
        title: '',
        description: '',
        image: '',
        link: '',
        content: ''
      });
    } catch (error) {
      setStatus('❌ Lỗi khi thêm bài viết.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="text-center mb-4">Thêm Bài Viết Mới</h2>
      {status && <div className="alert alert-info">{status}</div>}
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Chủ đề</label>
          <select
            className="form-select"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="tintuc">Tin tức</option>
            <option value="ktbds">Kiến thức BĐS</option>
            <option value="pl">Quản trị DN</option>
            <option value="ktt">Kỹ thuật Trading</option>
            <option value="athd">An toàn học đường</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={article.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={article.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Link hình ảnh</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={article.image}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Link ngoài (nếu có)</label>
          <input
            type="text"
            className="form-control"
            name="link"
            value={article.link}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nội dung chi tiết</label>
          <textarea
            className="form-control"
            name="content"
            value={article.content}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Thêm bài viết
        </button>
      </form>
    </div>
  );
}

export default AddArticle;
