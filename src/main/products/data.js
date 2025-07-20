const agentData = [
    {
        id: 1,
        username: "Amit Sharma",
        employeeId: "EMP001",
        mobile: "9876543210",
        email: "amit@example.com",
        status: "Active",
        onBreak: false,
        activeSince: new Date().toISOString(),
        elapsedTime: 0,
    },
    {
        id: 2,
        username: "Neha Verma",
        employeeId: "EMP002",
        mobile: "9988776655",
        email: "neha@example.com",
        status: "Active",
        activeSince: new Date().toISOString(),
        elapsedTime: 0,
        onBreak: false
    },
    {
        id: 3,
        username: "Rahul Singh",
        employeeId: "EMP003",
        mobile: "9123456780",
        email: "rahul@example.com",
        status: "On Break",
        activeSince: new Date().toISOString(),
        elapsedTime: 0,
        onBreak: true
    }
];

export { agentData }; 