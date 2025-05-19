import { Routes, Route } from "react-router";
import { ROUTE_PATHS } from "./routePaths";
import HomePage from "@/pages/HomePage";

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTE_PATHS.HOME} element={<HomePage />} />
  </Routes>
);
