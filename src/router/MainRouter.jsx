import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "./routes/PublicRouter";
import AgentRoutes from "./routes/AgentRouter";
import AdminRouter from "./routes/AdminRouter";
import QARouter from "./routes/QaRouter";

import Login from "../pages/Login";
import Profile from "../pages/profile/Profile";
import UserList from "../pages/user/UserList";
import CustomerList from "../main/analytics/customers/CustomerList";
import Agents from "../main/products/Agents";
import Chat from "../main/chats/Chat";
import ChatDemo from "../main/chats/ChatDemo";
import NewChat from "../main/chats/NewChat";
import Inbox from "../main/email/Ticket";
import TicketDetail from "../main/email/TicketDetail";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AgentDashboard from "../pages/agent/AgentDashboard";
import QaDashboard from "../pages/qa/QaDashboard";
import QaChat from "../pages/qa/QaChat";

const adminChildren = [
  { path: "", index: true, element: <AdminDashboard /> },
];

const qaChildren = [
  { path: "", index: true, element: <QaDashboard /> },
   { path: "chat", element: <QaChat /> },
     { path: "team", element: <Agents /> },
];

const agentChildren = [
  { path: "dashboard", index: true, element: <AgentDashboard /> },
  { path: "team", element: <Agents /> },
  { path: "chat", element: <Chat /> },
  { path: "newchat", element: <NewChat /> },
  { path: "chatdemo", element: <ChatDemo /> },
  { path: "inbox", element: <Inbox /> },
  { path: "inbox/:ticketId", element: <TicketDetail /> },
  { path: "analytics/customers", element: <CustomerList /> },
  { path: "profile", element: <Profile /> },
  { path: "pages/users", element: <UserList /> },
];

const routers = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoutes />,
    children: [{ path: "", index: true, element: <Login /> }],
  },
  {
    path: "/admin",
    element: <AdminRouter />,
    children: adminChildren,
  },
  {
    path: "/qa",
    element: <QARouter />,
    children: qaChildren,
  },
  {
    path: "/agent",
    element: <AgentRoutes />,
    children: agentChildren,
  },
]);

export default function MainRouter() {
  return <RouterProvider router={routers} />;
}
