import { Routes, Route } from "react-router";

import { ROUTE_PATHS } from "@/routes/routePaths";
import HomeLayout from "@/layouts/HomeLayout";
import PlanTripPage from "@/pages/PlanTripPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import AuthActionsHandlerPage from "@/pages/AuthActionsHandlerPage";
import SettingsLayout from "@/layouts/SettingsLayout";
import AccountPage from "@/pages/AccountPage";
import PreferencesPage from "@/pages/PreferencesPage";

export const AppRoutes = () => (
  <Routes>
    <Route element={<HomeLayout />}>
      <Route index element={<PlanTripPage />} />
      <Route
        path={ROUTE_PATHS.AUTH_ACTIONS_HANDLER}
        element={<AuthActionsHandlerPage />}
      />
      <Route
        path={`${ROUTE_PATHS.PASSWORD_RESET}`}
        element={<ResetPasswordPage />}
      />
      <Route
        path={ROUTE_PATHS.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <SettingsLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTE_PATHS.ACCOUNT} element={<AccountPage />} />
        <Route path={ROUTE_PATHS.PREFERENCES} element={<PreferencesPage />} />
      </Route>
    </Route>
  </Routes>
);
