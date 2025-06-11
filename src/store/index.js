import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./reducers/appReducer"
import userReducer from "./reducers/userReducer"

const store = configureStore({
   reducer: {
      user: userReducer,
      app: appReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
})

export default store
