import { Outlet, useLocation } from "react-router";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSettings } from "@/store/settings/settingsActions.js";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTopBtn from "@/components/behaviors/ScrollToTopBtn";
import ModalManager from "@/components/modals/ModalManager";
import FixedSection from "@/components/behaviors/FixedSection";
import TopHeader from "@/components/layout/Header/TopHeader";
import { fetchInstructors } from "@/store/instructors/instructorsActions";
import { fetchCategories } from "./store/categories/categoriesActions";
import AppInitializer from "./utils/AppInitializer";

function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchCategories());
    dispatch(fetchInstructors());
  }, [dispatch]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <TopHeader />
      <Header />

      <div className="min-h-[calc(100vh-90px)]">
        <AppInitializer>
          <Outlet />
        </AppInitializer>
      </div>

      <Footer />

      <Toaster position="top-center" />

      <ScrollToTopBtn />
      <FixedSection />

      {/* modals */}
      <ModalManager />
    </>
  );
}

export default App;
