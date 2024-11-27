import React from "react";
import { useNavigate } from "react-router-dom";
import imageNotFound from "../assets/imageNotFound.jpg";

interface IArticleCardProps {
  article: any;
  slugUrl: string;
}

export const ArticleCard: React.FC<IArticleCardProps> = ({
  article,
  slugUrl,
}) => {
  const navigate = useNavigate();
  const viewArticle = () => {
    navigate(slugUrl);
  };

  const summarizeContent = (content: string) => {
    let contentSummary = content;
    return contentSummary;
  };

  const categoryComponent = (category: string) => {
    const capitalizedCategory = () => {
      return category.toUpperCase;
    };

    const categoryIcon = () => {
      if (category === "launchpad") {
        return BookIcon;
      } else if (category === "notice") {
        return AnnouncementIcon;
      } else if (category === "team-build") {
        return TeamBuildIcon;
      } else if (category === "beardatorium") {
        return BeardatoriumIcon;
      }
    };

    return (
      <div>
        {categoryIcon}
        <p>{capitalizedCategory}</p>
      </div>
    );
  };
  return (
    <div className="bg-[white] rounded-lg">
      <img
        alt="Article image"
        className="bg-white h-[192px] w-fit w-full object-cover"
        src={article.imageCover === "" ? imageNotFound : article.imageCover}
      />
      <div className="p-8">
        <div className="justify items-start text-left">
          <div className="text-[24px] font-bold">{article.title}</div>
          <div className="text-base text-gray-500">
            {summarizeContent(article.content)}
          </div>
          <div className="flex gap-2 text-[14px] text-gray-500 uppercase">
            <div className="">{article.category}</div>|
            <div className="">{article.datePublished}</div>
          </div>
        </div>
        <div
          className="bg-[#FD5C42] w-fit text-white font-medium rounded-[12px] px-6 py-2 flex items-center gap-2 hover:bg-[#FCA192] cursor-pointer"
          onClick={viewArticle}
        >
          Read more
          <span className="text-lg">→</span>
        </div>
      </div>
    </div>
  );
};
