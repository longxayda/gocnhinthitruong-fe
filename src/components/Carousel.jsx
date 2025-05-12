function Carousel() {
  const images = [
    '/images/banner1.jpg',
    '/images/banner3.jpg'
  ];

  return (
    <div
      id="mainCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{ marginTop: '56px' }} // Thêm khoảng cách đẩy xuống
    >
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
            key={index}
          >
            <img
              src={image}
              className="d-block w-100"
              alt={`Slide ${index + 1}`}
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
