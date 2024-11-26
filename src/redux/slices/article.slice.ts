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

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetching hArticles
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
  },
});

export default articleSlice.reducer;
