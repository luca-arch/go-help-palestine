import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Contacts from "./components/pages/Contacts";
import Convo from "./components/pages/Convo";
import HomePage from "./components/pages/HomePage";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const router = createBrowserRouter([
  {
    element: <HomePage />,
    path: "/",
  },
  {
    element: <Contacts />,
    path: "contacts",
  },
  {
    element: <Convo showConversation={false} />,
    path: "how-to-help",
  },
  {
    element: <Convo />,
    path: "stef-point-of-view",
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
