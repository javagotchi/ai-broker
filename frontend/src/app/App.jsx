import { Outlet } from "react-router-dom";
import { AppShell } from "../layouts/AppShell.jsx";

export const App = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);

