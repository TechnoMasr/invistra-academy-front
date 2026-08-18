import { QueryClient, QueryCache } from "@tanstack/react-query";
import { store } from "@/store/store";
import { setCredentials } from "@/store/auth/authSlice";
import Cookies from "js-cookie";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onSuccess: (data, query) => {
      if (query.queryKey[0] === "auth" && query.queryKey[1] === "me") {
        const token = Cookies.get("token");
        store.dispatch(setCredentials({ user: data, token }));
      }
    },
  }),
});
