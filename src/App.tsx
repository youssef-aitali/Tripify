import { AppRoutes } from "@/routes";
import AuthProvider from "@/contexts/AuthProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
