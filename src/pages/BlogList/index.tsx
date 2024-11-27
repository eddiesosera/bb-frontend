import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { deleteArticle, fetchArticles } from "../../redux/slices/article.slice";
import { useNavigate } from "react-router-dom";
import { ArticleCard } from "../../elements/ArticleCard";

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { articles, loading, error } = useSelector(
    (state: RootState) => state.articles
  );
  const handleDelete = (id: string) => {
    dispatch(deleteArticle(id));
  };

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
        <ArticleCard article={article} slugUrl={`/articles/${article.slug}`} />
      ))}
    </div>
  );
};

export default BlogList;
