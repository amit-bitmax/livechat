import { CiPercent } from "react-icons/ci";
import { IoDiamond, IoTimeOutline } from "react-icons/io5";

const statisticsData = [
    {
        title: "Session",
        status: "24",
        icon: IoDiamond,
        change: 8,
        variant: "success",
        description: "New Sessions Today",
    },
    {
        title: "Session",
        status: "24",
        icon: IoDiamond,
        change: 8,
        variant: "success",
        description: "New Sessions Today",
    },
    {
        title: "Avg.Sessions",
        status: "00:18",
        icon: IoTimeOutline,
        change: 10,
        variant: "success",
        description: "Weekly Avg. Sessions",
    },
    {
        title: "Bounce Rate",
        status: "36.45",
        icon: CiPercent,
        change: 12,
        variant: "error",
        description: "Up Bounce Rate Weekly",
    },
];

export { statisticsData }; 
