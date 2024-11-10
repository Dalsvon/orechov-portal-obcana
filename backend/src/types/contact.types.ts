export interface Contact {
    createdAt: Date;
    name: string;
    address: string | null;
    phone: string | null;
    mobile: string | null;
    email: string | null;
    maintenence: string | null;
    data_id: string | null;
    ic: string | null;
    dic: string | null;
    bank_account: string | null;
    last_updated: Date;
    officeHours: OfficeHours[];
    employees: Employee[];
  }
  
  export interface OfficeHours {
    id: number;
    days: string;
    time: string;
  }
  
  export interface Employee {
    id: number;
    name: string;
    position: string | null;
    phone: string | null;
    email: string | null;
  }
  
  export interface FormattedContact {
    name: string;
    address: string | null;
    phone: string | null;
    mobile: string | null;
    email: string | null;
    maintenence: string | null;
    dataId: string | null;
    ic: string | null;
    dic: string | null;
    bankAccount: string | null;
    lastUpdated: string;
    officeHours: OfficeHours[];
    employees: Employee[];
  }