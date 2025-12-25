
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Design, Order, OrderCategory, OrderStatus, Notification, PaymentStatus, ChatMessage, Offer, ActionLog } from './types';

interface StoreState {
  user: User | null;
  employees: User[];
  designs: Design[];
  orders: Order[];
  offers: Offer[];
  notifications: Notification[];
  actionLogs: ActionLog[];
  login: (role: UserRole, employeeIdInput?: string) => boolean;
  logout: () => void;
  addNotification: (msg: string, type?: Notification['type']) => void;
  placeOrder: (order: Partial<Order>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addDesign: (design: Design) => void;
  deleteDesign: (id: string) => void;
  sendMessage: (orderId: string, text: string) => void;
  verifyPayment: (orderId: string, status: PaymentStatus) => void;
  assignEmployee: (orderId: string, employeeId: string) => void;
  uploadQR: (orderId: string, url: string) => void;
  uploadPaymentProof: (orderId: string, url: string) => void;
  addEmployee: (emp: Partial<User>) => void;
  removeEmployee: (id: string) => void;
  addOffer: (text: string) => void;
  removeOffer: (id: string) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

// --- Mock Data ---

const MOCK_DESIGNS: Design[] = [
  { id: '1', title: 'Royal Bridal Lehenga', category: OrderCategory.BRIDAL, price: 15000, description: 'Intricate zardosi work.', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1589810635657-232948472d98?auto=format&fit=crop&q=80&w=400'] },
  { id: '2', title: 'Floral Silk Blouse', category: OrderCategory.BLOUSE, price: 3500, description: 'Hand embroidered silk.', images: ['https://images.unsplash.com/photo-1583391733958-e0237c568f23?auto=format&fit=crop&q=80&w=400'] },
  { id: '3', title: 'Cute Elephant Motif', category: OrderCategory.KIDS, price: 1200, description: 'Playful design for kids.', images: ['https://images.unsplash.com/photo-1621334066925-5028448b1c4e?auto=format&fit=crop&q=80&w=400'] },
];

const MOCK_EMPLOYEES: User[] = [
  { id: 'emp1', employeeId: '100100', name: 'Sarah Stitch', role: UserRole.EMPLOYEE, phone: '9876500001' },
  { id: 'emp2', employeeId: '100101', name: 'Mike Thread', role: UserRole.EMPLOYEE, phone: '9876500002' },
  { id: 'emp3', employeeId: '100102', name: 'Jenny Logistics', role: UserRole.EMPLOYEE, phone: '9876500003' },
];

const MOCK_ORDERS: Order[] = [
  {
    id: '1715001',
    customerId: 'cust_demo',
    customerName: 'Alice Baker',
    customerPhone: '9876543210',
    category: OrderCategory.BRIDAL,
    description: 'Red bridal lehenga with heavy gold work',
    status: OrderStatus.IN_PROGRESS,
    paymentStatus: PaymentStatus.VERIFIED,
    dueDate: '2024-06-15',
    address: { line1: '123 Rose St', city: 'Mumbai', state: 'MH', pinCode: '400001' },
    totalAmount: 15000,
    assignedEmployeeId: 'emp1',
    messages: [],
    isCOD: false,
    designId: '1'
  },
  {
    id: '1715002',
    customerId: 'cust_demo_2',
    customerName: 'Carol Smith',
    customerPhone: '9876543211',
    category: OrderCategory.NAME_EMBROIDERY,
    description: 'Name "Rohan" on white towel',
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    dueDate: '2024-05-20',
    address: { line1: '45 Blue Ave', city: 'Delhi', state: 'DL', pinCode: '110001' },
    totalAmount: 500,
    assignedEmployeeId: '',
    messages: [],
    isCOD: true
  },
   {
    id: '1715003',
    customerId: 'cust_demo_3',
    customerName: 'Raj Patel',
    customerPhone: '9876543212',
    category: OrderCategory.CUSTOM,
    description: 'Custom logo on jacket',
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.VERIFIED,
    dueDate: '2024-04-10',
    address: { line1: '88 Green Rd', city: 'Pune', state: 'MH', pinCode: '411001' },
    totalAmount: 2500,
    assignedEmployeeId: 'emp1',
    messages: [],
    isCOD: false
  }
];

const MOCK_OFFERS: Offer[] = [
    { id: '1', text: 'Grand Opening Sale: Flat 20% OFF on Bridal Wear' },
    { id: '2', text: 'Free Shipping on Custom Orders above ₹5000' },
    { id: '3', text: 'Get a Free Design Consultation Today!' }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [designs, setDesigns] = useState<Design[]>(MOCK_DESIGNS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [employees, setEmployees] = useState<User[]>(MOCK_EMPLOYEES);
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);

  // Notification System
  const addNotification = (message: string, type: Notification['type'] = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000); 
  };

  const addActionLog = (log: Omit<ActionLog, 'id'>) => {
      setActionLogs(prev => [{ ...log, id: Date.now().toString() }, ...prev]);
  };

  const login = (role: UserRole, employeeIdInput?: string) => {
    if (role === UserRole.EMPLOYEE) {
         if (!employeeIdInput) {
             addNotification("Please enter Employee ID", "error");
             return false;
         }
         const emp = employees.find(e => e.employeeId === employeeIdInput);
         if (emp) {
             setUser(emp);
             addNotification(`Welcome back, ${emp.name}`);
             return true;
         } else {
             addNotification("Invalid Employee ID", "error");
             return false;
         }
    } else {
        setUser({
            id: role === UserRole.ADMIN ? 'admin1' : 'cust1',
            name: role === UserRole.ADMIN ? 'Admin User' : 'Priya Sharma',
            role,
            phone: '9876543210'
        });
        addNotification(`Logged in as ${role}`);
        return true;
    }
  };

  const logout = () => {
    setUser(null);
    addNotification('Logged out successfully');
  };

  const addDesign = (design: Design) => {
    setDesigns(prev => [design, ...prev]);
    addNotification('New design added to collection');
  };

  const deleteDesign = (id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
    addNotification('Design removed from collection', 'info');
  };

  const placeOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customerId: user?.id || 'guest',
      customerName: user?.name || orderData.customerName || 'Guest',
      customerPhone: orderData.customerPhone || '',
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      messages: [],
      isCOD: false,
      totalAmount: 0,
      category: OrderCategory.CUSTOM,
      description: '',
      dueDate: '',
      address: { line1: '', city: '', state: '', pinCode: '' },
      ...orderData
    } as Order;

    setOrders(prev => [newOrder, ...prev]);
    addNotification('Order placed successfully! Check your dashboard.');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    addNotification(`Order #${orderId.slice(-4)} status updated to ${status}`);
    
    if (user?.role === UserRole.EMPLOYEE) {
        addActionLog({
            employeeId: user.id,
            employeeName: user.name,
            action: 'Status Update',
            details: `Updated Order #${orderId.slice(-4)} to ${status}`,
            timestamp: Date.now(),
            orderId
        });
    }
  };

  const verifyPayment = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o));
    addNotification(`Payment ${status} for Order #${orderId.slice(-4)}`);
  };

  const assignEmployee = (orderId: string, employeeId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedEmployeeId: employeeId } : o));
    const empName = employees.find(e => e.id === employeeId)?.name || 'Employee';
    addNotification(`Assigned ${empName} to Order #${orderId.slice(-4)}`);
  };

  const sendMessage = (orderId: string, text: string) => {
    if (!user) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text,
      timestamp: Date.now(),
      isAdmin: user.role === UserRole.ADMIN
    };
    
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, messages: [...o.messages, newMessage] };
      }
      return o;
    }));
    
    if (user.role === UserRole.EMPLOYEE) {
        addActionLog({
            employeeId: user.id,
            employeeName: user.name,
            action: 'Message Sent',
            details: `Sent message in Order #${orderId.slice(-4)}`,
            timestamp: Date.now(),
            orderId
        });
    }
    addNotification('Message sent');
  };

  const uploadQR = (orderId: string, url: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, qrCodeUrl: url } : o));
    addNotification('QR Code uploaded for order');
  };

  const uploadPaymentProof = (orderId: string, url: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentProofUrl: url } : o));
    addNotification('Payment proof uploaded. Waiting for verification.');
  };

  const addEmployee = (emp: Partial<User>) => {
    // Generate a 6-digit random ID
    const generatedId = Math.floor(100000 + Math.random() * 900000).toString();
    const newEmp: User = {
      id: `emp${Date.now()}`,
      employeeId: generatedId,
      name: emp.name || 'New Employee',
      role: UserRole.EMPLOYEE,
      phone: emp.phone || ''
    };
    setEmployees(prev => [...prev, newEmp]);
    addNotification(`Added ${newEmp.name}. Login ID: ${generatedId}`);
  };

  const removeEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    addNotification('Employee removed.');
  };

  const addOffer = (text: string) => {
      setOffers(prev => [...prev, { id: Date.now().toString(), text }]);
      addNotification('New offer displayed on homepage');
  };

  const removeOffer = (id: string) => {
      setOffers(prev => prev.filter(o => o.id !== id));
      addNotification('Offer removed');
  };

  return (
    <StoreContext.Provider value={{ 
      user, designs, orders, employees, offers, notifications, actionLogs,
      login, logout, addNotification, placeOrder, 
      updateOrderStatus, addDesign, deleteDesign, sendMessage, verifyPayment, assignEmployee,
      uploadQR, uploadPaymentProof, addEmployee, removeEmployee, addOffer, removeOffer
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
