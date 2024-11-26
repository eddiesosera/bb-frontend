import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { fetchArticles } from "../../redux/slices/article.slice";

const BlogList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { articles, loading, error } = useSelector(
    (state: RootState) => state.articles
  );

  useEffect(() => {
    dispatch(fetchArticles());
    console.log(articles);
  }, [dispatch]);

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Articles</h2>
      {articles.map((article: any) => (
        <div key={article._id}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
