import { combineReducers } from "redux";
import authReducer from "./auth.slice";
import articleReducer from "./article.slice";

const rootReducer = combineReducers({
  articles: articleReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
