const API_URL = 'https://api.gocnhinthitruong.com/api';

export const getArticles = async () => {
  const response = await fetch(`${API_URL}/articles`);
  return response.json();
};

export const postArticle = async (topic, articleData) => {
  const response = await fetch(`${API_URL}/articles/${topic}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articleData),
  });
  return response.json();
};
