import React, { useEffect, useState } from "react";
import "./News.css";
import Navbar from "../navbar/Navbar";

const News = () => {
  const [myNews, setMyNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryParam = category ? `&category=${category}` : '';
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us${categoryParam}&page=${currentPage}&pageSize=${pageSize}&apiKey=714ef9b8a6ef47d19b4bda6f4f0d100f`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Network response was not ok: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        setMyNews(data.articles);
        setTotalResults(data.totalResults);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, currentPage]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <>
      <Navbar onCategoryChange={handleCategoryChange} />
      <h1 className="text-center my-3">Top News</h1>
      <div className="mainDiv">
        {myNews.length === 0 ? (
          <p>No news available for selected category.</p>
        ) : (
          myNews.map((ele, index) => (
            <div
              key={index}
              className="card"
              style={{ marginTop: "2rem", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
            >
              <img
                src={
                  ele.urlToImage == null
                    ? "https://kubrick.htvapps.com/vidthumb/f6865cb1-d77d-4a31-ba83-d57c4b2324d8/4b9c9d8f-ad14-47ea-bcf4-bf24ee0bb1f3.jpg?crop=0.383xw:0.383xh;0.517xw,0.252xh&resize=1200:*"
                    : ele.urlToImage
                }
                className="card-img-top"
                alt="News"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {ele.author == "" || ele.author == null ? "Unknown Author" : ele.author}
                </h5>
                <p className="card-text">{ele.title}</p>
                <a href={ele.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Explore
                </a>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default News;
