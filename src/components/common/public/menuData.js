import { Forum, Home, Inbox, Pages, PeopleAlt, SignalCellularAlt } from "@mui/icons-material";

export const menuData = [
    {
        label: "Navigation",
        items: [
            {
                name: "dashboard", icon: Home,route: "dashboard",
            },
             {
                name: "Analytics", icon: SignalCellularAlt,
                subMenu: [
                    { name: "Customers", route: "analytics/customers" },
                ]
            },
            {
                name: "Chat", icon: Forum,route:"chat",
            },
            {
                name: "ChatDemo", icon: Forum,route:"chatdemo",
            },
            {
                name: "NewChat", icon: Forum,route:"newchat",
            },
            {
                name: "Inbox", icon: Inbox,route:"inbox",
            },

            {
                name: "Team", icon: PeopleAlt,route:"team",
            },
            {
                 name: "Reports", icon: SignalCellularAlt,
                subMenu: [
                    {
                        name: "Agents",
                        nestedSubMenu: [
                            { name: "Agents performance", route: "reports/performance" },
                            { name: "Agent activity", route: "reports/activity" },
                        ],
                    },
                ]
            }

        ]
    },
    {
        label: "Crafted",
        items: [
            {
                name: "Pages", icon: Pages,
                subMenu: [
                    { name: "Profile", route: "profile" },
                    { name: "Notifictions", route: "notifications" },
                ]
            },
        ]
    }
];
