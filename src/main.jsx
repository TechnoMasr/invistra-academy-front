import { createRoot } from "react-dom/client";
import AppRouter from "./routes/AppRouter.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";
import { DirectionProvider } from "./components/ui/direction.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const lang = localStorage.getItem("lang") || "en";

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <DirectionProvider direction={lang === "ar" ? "rtl" : "ltr"}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <AppRouter />
        </GoogleOAuthProvider>
      </DirectionProvider>
    </Provider>
  </QueryClientProvider>,
);
