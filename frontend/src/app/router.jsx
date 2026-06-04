import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "./App.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { TemplatesPage } from "../pages/TemplatesPage.jsx";
import { WatchlistPage } from "../pages/WatchlistPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "watchlist",
        element: <WatchlistPage />,
      },
      {
        path: "templates",
        element: <TemplatesPage />,
      },
    ],
  },
]);
