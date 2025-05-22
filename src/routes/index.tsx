import { Routes, Route } from "react-router";
import { ROUTE_PATHS } from "./routePaths";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTE_PATHS.HOME} element={<HomePage />} />
    <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
  </Routes>
);
