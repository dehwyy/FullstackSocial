import { configureStore } from "@reduxjs/toolkit"
import PostsApi from "./req/posts-slice.api"
import UserPageApi from "./req/userPage-slice-api"
import CurrentUserApi from "./req/currentUser-slice-api"
import CurrentUserSliceReducer from "./slices/currentUser-slice"

const store = configureStore({
  reducer: {
    [PostsApi.reducerPath]: PostsApi.reducer,
    [UserPageApi.reducerPath]: UserPageApi.reducer,
    [CurrentUserApi.reducerPath]: CurrentUserApi.reducer,
    currentUser: CurrentUserSliceReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(PostsApi.middleware, UserPageApi.middleware, CurrentUserApi.middleware),
})

export type RootT = ReturnType<typeof store.getState>
export type DispatchT = typeof store.dispatch
export default store
