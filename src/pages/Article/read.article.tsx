import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: {
    username: string;
    email: string;
  };
}

const Article: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!slug) return;

    // This will be converted to a slice
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/articles/${slug}`
        );
        console.log(response.data);
        setArticle(response.data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to fetch the article"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  return (
    <div>
      {loading ? (
        <p>Loading article...</p>
      ) : article ? (
        <div>
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-gray-600 mb-6">By {article.author.username}</p>
          <div className="prose max-w-none">
            {/* Assuming content is in Markdown or HTML */}
            {article.content}
          </div>
        </div>
      ) : (
        <p>Article not found.</p>
      )}
    </div>
  );
};

export default Article;
