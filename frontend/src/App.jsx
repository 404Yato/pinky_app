import { useAuth } from "@/hooks/useAuth";
import { AppRoutes } from "@/routing/AppRoutes";

function App() {
  const auth = useAuth();
  return <AppRoutes auth={auth} />;
}

export default App;
