import { configureStore, isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { baseApi, type ApiError } from "./api/base-api";
import { describeError, isUnexpectedStatus } from "./api/errors";

const unexpectedErrorToast: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const error = action.payload as ApiError;
        if (isUnexpectedStatus(error.status) || error.code === "INVALID_RESPONSE") toast.error(describeError(error));
    }
    return next(action);
};

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware, unexpectedErrorToast),
});

setupListeners(store.dispatch);

export const resetApiCache = () => store.dispatch(baseApi.util.resetApiState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
