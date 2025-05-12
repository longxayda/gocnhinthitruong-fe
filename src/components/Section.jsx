function Section({ topic }) {
  return (
    <div className="content">
      <h2>{topic.title}</h2>
      <div className="row">
        {topic.articles.map((article, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card">
              <img src={article.image} className="card-img-top" alt={article.title} />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Section;
