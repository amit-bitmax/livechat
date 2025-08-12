import { Forum, Home, Inbox, Pages, PeopleAlt, SignalCellularAlt } from "@mui/icons-material";

export  const QaData = [
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
                name: "Inbox", icon: Inbox,route:"inbox",
            },

            {
                name: "Team", icon: PeopleAlt,route:"team",
            },

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
