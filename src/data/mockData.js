// Mock data for demo dashboards

export const mockUsers = [
    {
        id: '1',
        name: 'Raj Kumar',
        email: 'raj.kumar@example.com',
        role: 'employee'
    },
    {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        role: 'manager'
    },
    {
        id: '3',
        name: 'Amit Patel',
        email: 'amit.patel@example.com',
        role: 'employee'
    },
    {
        id: '4',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        role: 'employee'
    }
];

export const mockClaims = [
    {
        id: '1',
        employeeName: 'Raj Kumar',
        employeeEmail: 'raj.kumar@example.com',
        date: '2024-11-20',
        description: 'Client Meeting Lunch',
        amount: 2500,
        status: 'pending',
        timestamp: new Date('2024-11-20T10:00:00')
    },
    {
        id: '2',
        employeeName: 'Raj Kumar',
        employeeEmail: 'raj.kumar@example.com',
        date: '2024-11-18',
        description: 'Flight Tickets - Mumbai',
        amount: 8500,
        status: 'approved',
        timestamp: new Date('2024-11-18T14:30:00'),
        approvedBy: 'Priya Sharma'
    },
    {
        id: '3',
        employeeName: 'Amit Patel',
        employeeEmail: 'amit.patel@example.com',
        date: '2024-11-19',
        description: 'Hotel Stay - Bangalore',
        amount: 5000,
        status: 'pending',
        timestamp: new Date('2024-11-19T09:15:00')
    },
    {
        id: '4',
        employeeName: 'Sneha Reddy',
        employeeEmail: 'sneha.reddy@example.com',
        date: '2024-11-15',
        description: 'Taxi Fare',
        amount: 450,
        status: 'approved',
        timestamp: new Date('2024-11-15T16:45:00'),
        approvedBy: 'Priya Sharma'
    },
    {
        id: '5',
        employeeName: 'Amit Patel',
        employeeEmail: 'amit.patel@example.com',
        date: '2024-11-10',
        description: 'Conference Registration',
        amount: 12000,
        status: 'rejected',
        timestamp: new Date('2024-11-10T11:20:00'),
        rejectedBy: 'Priya Sharma',
        rejectionReason: 'Budget exceeded for this quarter'
    },
    {
        id: '6',
        employeeName: 'Raj Kumar',
        employeeEmail: 'raj.kumar@example.com',
        date: '2024-11-25',
        description: 'Office Supplies',
        amount: 750,
        status: 'pending',
        timestamp: new Date('2024-11-25T13:00:00')
    },
    {
        id: '7',
        employeeName: 'Sneha Reddy',
        employeeEmail: 'sneha.reddy@example.com',
        date: '2024-11-22',
        description: 'Team Dinner',
        amount: 3200,
        status: 'approved',
        timestamp: new Date('2024-11-22T19:30:00'),
        approvedBy: 'Priya Sharma'
    },
    {
        id: '8',
        employeeName: 'Amit Patel',
        employeeEmail: 'amit.patel@example.com',
        date: '2024-11-23',
        description: 'Parking Charges',
        amount: 200,
        status: 'pending',
        timestamp: new Date('2024-11-23T08:00:00')
    }
];

export const mockDemoUser = {
    admin: {
        displayName: 'Demo Admin',
        email: 'admin@demo.dretam.com',
        photoURL: null
    },
    manager: {
        displayName: 'Demo Manager',
        email: 'manager@demo.dretam.com',
        photoURL: null
    },
    employee: {
        displayName: 'Demo Employee',
        email: 'employee@demo.dretam.com',
        photoURL: null
    }
};
