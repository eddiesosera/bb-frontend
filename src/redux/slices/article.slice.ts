import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ArticleState {
  articles: any[];
  article: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articles: [],
  article: null,
  loading: false,
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk for fetching articles
export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/articles`);
      console.log(API_BASE_URL);
      console.log(response.data?.docs);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for creating an article
export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (articleData: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      articleData.author = "67432a6a91d1436624065a34";
      const response = await axios.post(
        `${API_BASE_URL}/api/articles`,
        articleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "An unexpected error occurred";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for deleting an article
export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      await axios.delete(`${API_BASE_URL}/api/articles/id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "An unexpected error occurred";
      return rejectWithValue(message);
    }
  }
);

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetching Articles
    builder.addCase(fetchArticles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.loading = false;
      state.articles = action.payload?.docs;
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Creatng Article
    builder.addCase(createArticle.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createArticle.fulfilled, (state, action) => {
      state.loading = false;
      state.articles.push(action.payload);
    });
    builder.addCase(createArticle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Deleting Article
    builder.addCase(deleteArticle.fulfilled, (state, action) => {
      state.articles = state.articles.filter(
        (article) => article._id !== action.payload
      );
    });
    builder.addCase(deleteArticle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default articleSlice.reducer;
