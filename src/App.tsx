import "./App.css";
import BlogList from "./pages/BlogList";
import CreateArticle from "./pages/Article/create.article";

function App() {
  return (
    <div>
      <CreateArticle />
      <BlogList />
    </div>
  );
}

export default App;
