import { Routes, Route } from "react-router";
import { ROUTE_PATHS } from "./routePaths";
import DashboardPage from "@/pages/DashboardPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import HomeLayout from "@/layouts/HomeLayout";
import PlanTripPage from "@/pages/PlanTripPage";

export const AppRoutes = () => (
  <Routes>
    <Route element={<HomeLayout />}>
      <Route index element={<PlanTripPage />} />
      <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
      <Route
        path={ROUTE_PATHS.PASSWORD_RESET}
        element={<ResetPasswordPage />}
      />
    </Route>
  </Routes>
);
