import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor/Editor';
import './admin.css';

function AdminAddArticle() {
  const [view, setView] = useState('list');
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    link: '',
    thumbnail: ''
  });
  const [topic, setTopic] = useState('tintuc');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [source, setSource] = useState('editor');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageInput, setPageInput] = useState('');
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Kiểm tra và xử lý khi thoát trang
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }

    // Xử lý khi rời trang
    const handleUnload = async () => {
      try {
        await axios.post('https://api.gocnhinthitruong.com/api/admin/logout');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('accessToken');
      } catch (error) {
        console.error('Lỗi khi tự động đăng xuất:', error);
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [navigate]);

  // Fetch articles khi topic hoặc source thay đổi
  useEffect(() => {
    fetchArticles(topic);
  }, [topic, source]);

  const fetchArticles = async (selectedTopic) => {
    try {
      const apiUrl = source === 'editor' 
        ? `https://api.gocnhinthitruong.com/api/editor/articles/${selectedTopic}` 
        : `https://api.gocnhinthitruong.com/api/articles/${selectedTopic}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Lỗi tải bài viết:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('accessToken');
        navigate('/admin/login');
      }
    }
  };

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles;
    const lowercaseQuery = searchQuery.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery)
    );
  }, [articles, searchQuery]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (summary) => {
    setFormData((prev) => ({ ...prev, summary }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.thumbnail.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (formData.link === null || formData.link === '') {
      //choose a random article
      const randomIndex = Math.floor(Math.random() * articles.length);
      if (articles.length > 0) {
        formData.link = articles[randomIndex].link;
      }
    }
    try {
      const data = {
        title: formData.title,
        summary: formData.summary,
        link: formData.link ? formData.link : '/',
        thumbnail: formData.thumbnail
      };

      const apiUrl = source === 'editor' 
        ? `https://api.gocnhinthitruong.com/api/editor/articles` 
        : `https://api.gocnhinthitruong.com/api/articles`;

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      };

      if (view === 'edit' && selectedArticle) {
        await axios.put(`${apiUrl}/${selectedArticle.id}`, data, config);
        alert('Cập nhật bài viết thành công!');
      } else {
        await axios.post(`${apiUrl}/${topic}`, data, config);
        alert('Đăng bài thành công!');
      }
      setView('list');
      fetchArticles(topic);
    } catch (error) {
      alert('Lỗi khi thêm/cập nhật bài viết.');
      console.error('Lỗi từ server:', error.response?.data || error.message);
    }
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      summary: article.summary,
      link: article.link,
      thumbnail: article.thumbnail
    });
    setSelectedArticle(article);
    setView('edit');
  };

  const handleDelete = async (topic, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      const apiUrl = source === 'editor' 
        ? `https://api.gocnhinthitruong.com/api/editor/articles/${id}` 
        : `https://api.gocnhinthitruong.com/api/articles/${topic}/${id}`;
      await axios.delete(apiUrl, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert('Xóa bài viết thành công!');
      await fetchArticles(topic);
      const totalArticlesAfterDelete = articles.length - 1;
      const maxPagesAfterDelete = Math.ceil(totalArticlesAfterDelete / articlesPerPage);
      if (currentPage > maxPagesAfterDelete && maxPagesAfterDelete > 0) {
        setCurrentPage(maxPagesAfterDelete);
      } else if (totalArticlesAfterDelete <= 0) {
        setCurrentPage(1);
      }
    } catch (error) {
      alert('Lỗi khi xóa bài viết.');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://api.gocnhinthitruong.com/api/admin/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('accessToken');
      alert('Đăng xuất thành công!');
      navigate('/admin/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      alert('Lỗi khi đăng xuất.');
    }
  };

  const openOverlay = (article) => {
    setSelectedArticle(article);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setSelectedArticle(null);
  };

  const articlesPerPage = 12;
  const totalPages = filteredArticles.length > 0 ? Math.ceil(filteredArticles.length / articlesPerPage) : 1;
  const paginatedArticles = useMemo(() => {
    if (filteredArticles.length === 0) return [];
    const startIndex = (currentPage - 1) * articlesPerPage;
    return filteredArticles.slice(startIndex, startIndex + articlesPerPage);
  }, [filteredArticles, currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setPageInput(value);
    if (value && !isNaN(value)) {
      const pageNum = parseInt(value);
      if (pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum);
      }
    }
  };

  const topics = source === 'articles' 
    ? [{ value: 'tintuc', label: 'Tin tức' }] 
    : [
        { value: 'batdongsan', label: 'Kiến thức BĐS' },
        { value: 'phaply', label: 'Quản trị DN' },
        { value: 'trading', label: 'Kỹ thuật Trading' },
        { value: 'antoanhocduong', label: 'An toàn học đường' }
      ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{view === 'list' ? 'Danh sách bài viết' : (view === 'add' ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết')}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Đăng xuất</button>
      </div>
      <div className="mb-3">
        <label className="form-label">Chủ đề</label>
        <select 
          className="form-select" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
        >
          {topics.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => setView('add')}>Thêm bài viết mới</button>
        <button 
          className="btn btn-secondary me-2" 
          onClick={() => { 
            setSource('articles'); 
            setTopic('tintuc');
            setView('list'); 
            // fetchArticles('tintuc'); 
          }}
        >
          Danh sách bài viết (Tự động)
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => { 
            setSource('editor'); 
            setTopic('batdongsan');
            setView('list'); 
            // fetchArticles('batdongsan'); 
          }}
        >
          Danh sách bài viết (Thủ công)
        </button>
      </div>
      
      {view === 'list' && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {view === 'add' || view === 'edit' ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tiêu đề</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Ảnh đại diện (URL)</label>
            <input
              type="text"
              name="thumbnail"
              className="form-control"
              value={formData.thumbnail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Link (nếu có)</label>
            <input
              type="text"
              name="link"
              className="form-control"
              value={formData.link}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nội dung</label>
            <Editor
              value={formData.summary}
              onChange={handleEditorChange}
            />
          </div>
          <button type="submit" className="btn btn-success">
            {view === 'edit' ? 'Sửa' : 'Thêm'} bài viết
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setView('list')}>
            Hủy
          </button>
        </form>
      ) : (
        <>
          <div className="row">
            {paginatedArticles.map((article) => (
              <div key={article.id} className="col-md-3 mb-4">
                <div className="card">
                  <p style={{
                    fontWeight: 'bold',
                  }}>ID: {article.id}</p>
                  <img
                    src={article.thumbnail}
                    className="card-img-top"
                    alt={article.title}
                    onError={(e) => (e.target.src = '/images/replace_error.jfif')}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text">{article.summary.length > 100 ? article.summary.substring(0, 100) + '...' : article.summary}</p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-info btn-sm" onClick={() => openOverlay(article)}>Xem chi tiết</button>
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(article)}>Chỉnh sửa</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(article.topic, article.id)}>Xóa</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredArticles.length > 0 && totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-3">
              <button className="btn btn-light me-2" onClick={prevPage} disabled={currentPage === 1}>❮</button>
              <span>Trang </span>
              <input
                type="number"
                className="form-control mx-2"
                style={{ width: '60px' }}
                value={pageInput}
                onChange={handlePageInputChange}
                min="1"
                max={totalPages}
                placeholder={currentPage}
              />
              <span>/ {totalPages}</span>
              <button className="btn btn-light ms-2" onClick={nextPage} disabled={currentPage === totalPages}>❯</button>
            </div>
          )}
        </>
      )}

      {showOverlay && selectedArticle && (
        <div className="article-overlay" onClick={closeOverlay}>
          <div className="article-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeOverlay}>×</button>
            <h2>{selectedArticle.title}</h2>
            <img src={selectedArticle.thumbnail} alt={selectedArticle.title} style={{ width: '100%', height: 'auto', marginBottom: '15px' }} />
            <p dangerouslySetInnerHTML={{ __html: selectedArticle.summary }} />
            <p><a href={selectedArticle.link} target="_blank" rel="noopener noreferrer">Đọc thêm nguồn</a></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAddArticle;