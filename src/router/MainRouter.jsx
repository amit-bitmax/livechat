import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoutes from "./routes/PublicRouter";
import PrivateRoutes from "./routes/PrivateRouter";
import UserList from "../pages/user/UserList";
import Profile from "../pages/profile/Profile";
import Dashboard from "../main/dashboard/Dashboard";
import CustomerList from "../main/analytics/customers/CustomerList";
import Agents from "../main/products/Agents";
import Chat from "../main/chats/Chat";
import Login from "../pages/Login";
import Inbox from "../main/email/Ticket";
import ChatDemo from "../main/chats/ChatDemo";

const routers = createBrowserRouter([
    {
        path: "/login",
        element: <PublicRoutes />,
        children: [
            {
                path: "",
                index: true,
                element: <Login />,
            },
        ],
    },
    {
        path: "",
        element: <PrivateRoutes />,
        children: [
            {
                path: "dashboard",
                index: true,
                element: <Dashboard />,
            },
            {
                path: "team",
                element: <Agents />,
            },
            {
                path: "chat",
                element: <Chat />,
            },
            {
                path: "chatdemo",
                element: <ChatDemo />,
            },
            {
                path: "inbox",
                element: <Inbox />,
            },
            {
                path: "analytics/customers",
                element: <CustomerList />
            },
            {
                path: "team/agent/profile",
                element: <Profile />
            },
            {
                path: "pages/users",
                element: <UserList />
            },
        ],
    },
]);

export default function MainRouter() {
    return <RouterProvider router={routers} />;
}
