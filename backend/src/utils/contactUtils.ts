import { Contact, FormattedContact } from "../types/contactTypes";

// Formats contact for frontend
export const formatContact = (contact: Contact): FormattedContact => ({
    name: contact.name,
    address: contact.address,
    phone: contact.phone,
    mobile: contact.mobile,
    email: contact.email,
    maintenence: contact.maintenence,
    dataId: contact.data_id,
    ic: contact.ic,
    dic: contact.dic,
    bankAccount: contact.bank_account,
    lastUpdated: contact.last_updated.toISOString(),
    officeHours: contact.officeHours,
    employees: contact.employees
});