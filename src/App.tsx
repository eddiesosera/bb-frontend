import "./App.css";
import BlogList from "./pages/BlogList";
import CreateArticle from "./pages/Article/create.article";
import Login from "./pages/Auth/login.auth";
import { RootState, useAppDispatch } from "./redux/store";
import { useEffect } from "react";
import { fetchUser } from "./redux/slices/auth.slice";
import { useSelector } from "react-redux";
import Register from "./pages/Auth/register.auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./elements/Navbar";
import PrivateRoute from "./util/private.route";
import { ToastContainer } from "react-toastify";
import Article from "./pages/Article/read.article";

function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/articles/:slug" element={<Article />} />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreateArticle />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
