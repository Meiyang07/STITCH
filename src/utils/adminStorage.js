import { getUsers } from './authStorage';
import { collections } from '../data/collections';
import { readyMadeProducts } from '../data/readymade';
import { fabricGroups } from '../data/fabrics';
import { accessories } from '../data/accessories';



// Starter master data. Demo supplier contacts use example.com and reserved-style
// placeholder mobile numbers so they are safe to replace with real supplier details.
const STARTER_SUPPLIERS = [
  {
    id: 'SUP-1001',
    supplierType: 'Raw Material',
    businessName: 'Everest Suiting Demo Supply',
    contactPerson: 'Demo Contact A',
    phone: '+9770000001001',
    whatsapp: '+9770000001001',
    email: 'suiting.demo@example.com',
    address: 'Pokhara, Nepal',
    panVat: '',
    notes: 'Demo supplier for wool, linen, velvet, cashmere and general suiting fabrics. Replace with a real supplier before sending a PO.',
  },
  {
    id: 'SUP-1002',
    supplierType: 'Raw Material',
    businessName: 'Himalayan Heritage Textile Demo',
    contactPerson: 'Demo Contact B',
    phone: '+9770000001002',
    whatsapp: '+9770000001002',
    email: 'heritage.demo@example.com',
    address: 'Kathmandu, Nepal',
    panVat: '',
    notes: 'Demo supplier for Dhaka, Allo, handwoven cotton, hemp and heritage textiles. Replace before real procurement.',
  },
  {
    id: 'SUP-1003',
    supplierType: 'Raw Material',
    businessName: 'Pokhara Shirting Demo Traders',
    contactPerson: 'Demo Contact C',
    phone: '+9770000001003',
    whatsapp: '+9770000001003',
    email: 'shirting.demo@example.com',
    address: 'Pokhara, Nepal',
    panVat: '',
    notes: 'Demo supplier for shirting cotton and related shirt fabrics.',
  },
  {
    id: 'SUP-1004',
    supplierType: 'Raw Material',
    businessName: 'Tailor Trims Demo Supply',
    contactPerson: 'Demo Contact D',
    phone: '+9770000001004',
    whatsapp: '+9770000001004',
    email: 'trims.demo@example.com',
    address: 'Kathmandu, Nepal',
    panVat: '',
    notes: 'Demo supplier for buttons, thread, zippers, shoulder pads, sleeve heads and labels.',
  },
  {
    id: 'SUP-1005',
    supplierType: 'Raw Material',
    businessName: 'Canvas & Lining Demo House',
    contactPerson: 'Demo Contact E',
    phone: '+9770000001005',
    whatsapp: '+9770000001005',
    email: 'lining.demo@example.com',
    address: 'Birgunj, Nepal',
    panVat: '',
    notes: 'Demo supplier for linings, pocketing and tailoring canvas/interlining.',
  },
  {
    id: 'SUP-1006',
    supplierType: 'Raw Material',
    businessName: 'Garment Packaging Demo Nepal',
    contactPerson: 'Demo Contact F',
    phone: '+9770000001006',
    whatsapp: '+9770000001006',
    email: 'packaging.demo@example.com',
    address: 'Pokhara, Nepal',
    panVat: '',
    notes: 'Demo supplier for garment bags, hangers and packaging boxes.',
  },
  {
    id: 'SUP-1007',
    supplierType: 'Ready-Made',
    businessName: 'Ready Wear Demo Wholesale',
    contactPerson: 'Demo Contact G',
    phone: '+9770000001007',
    whatsapp: '+9770000001007',
    email: 'readywear.demo@example.com',
    address: 'Kathmandu, Nepal',
    panVat: '',
    notes: 'Demo supplier assigned to ready-made products for stock setup. Replace with the real source for each garment.',
  },
  {
    id: 'SUP-1008',
    supplierType: 'Production',
    businessName: 'Formalwear Production Demo Partner',
    contactPerson: 'Demo Contact H',
    phone: '+9770000001008',
    whatsapp: '+9770000001008',
    email: 'production.demo@example.com',
    address: 'Pokhara, Nepal',
    panVat: '',
    notes: 'Demo production-source record for made-to-order catalog items. Bespoke styles are not purchased through the raw-material PO workflow.',
  },
  {
    id: 'SUP-1009',
    supplierType: 'Accessories',
    businessName: 'Classic Accessories Demo Supply',
    contactPerson: 'Demo Contact I',
    phone: '+9770000001009',
    whatsapp: '+9770000001009',
    email: 'accessories.demo@example.com',
    address: 'Kathmandu, Nepal',
    panVat: '',
    notes: 'Demo supplier for ties, cufflinks, bow ties, lapel pins, tie clips, pocket squares, buttons and belts. Replace with real supplier details.',
  },
];

function fabricSupplierId(name = '') {
  const value = name.toLowerCase();
  if (/(dhaka|allo|handwoven|hemp)/.test(value)) return 'SUP-1002';
  if (/(cotton shirting)/.test(value)) return 'SUP-1003';
  return 'SUP-1001';
}

const PRODUCT_INVENTORY = [
  ...collections.map((product) => ({
    item: product.name,
    group: 'Made-to-Order',
    unit: product.type === 'Wedding' || product.type === 'Suits' || product.type === 'Traditional Wear' ? 'sets' : 'pcs',
    supplierId: 'SUP-1008',
    sourceType: 'bespoke',
  })),
  ...readyMadeProducts.map((product) => ({
    item: product.name,
    group: 'Ready-Made',
    unit: 'pcs',
    supplierId: 'SUP-1007',
    sourceType: 'readymade',
  })),
  ...fabricGroups.map((fabric) => ({
    item: fabric.name,
    group: 'Fabric',
    unit: 'm',
    supplierId: fabricSupplierId(fabric.name),
    sourceType: 'fabric',
  })),
];

const SUPPORTING_MATERIALS = [
  ['Suit Lining', 'Lining', 'm', 'SUP-1005'],
  ['Pocketing Fabric', 'Lining', 'm', 'SUP-1005'],
  ['Horsehair Canvas', 'Canvas', 'm', 'SUP-1005'],
  ['Fusible Canvas', 'Canvas', 'm', 'SUP-1005'],
  ['Suit Buttons', 'Buttons', 'pcs', 'SUP-1004'],
  ['Shirt Buttons', 'Buttons', 'pcs', 'SUP-1004'],
  ['Blazer Buttons', 'Buttons', 'pcs', 'SUP-1004'],
  ['Tailoring Thread', 'Thread', 'rolls', 'SUP-1004'],
  ['Buttonhole Thread', 'Thread', 'rolls', 'SUP-1004'],
  ['Trouser Zippers', 'Zippers', 'pcs', 'SUP-1004'],
  ['Shoulder Pads', 'Trims', 'pairs', 'SUP-1004'],
  ['Sleeve Heads', 'Trims', 'pairs', 'SUP-1004'],
  ['Garment Labels', 'Trims', 'pcs', 'SUP-1004'],
  ['Garment Bags', 'Packaging', 'pcs', 'SUP-1006'],
  ['Suit Hangers', 'Packaging', 'pcs', 'SUP-1006'],
  ['Packaging Boxes', 'Packaging', 'pcs', 'SUP-1006'],
].map(([item, group, unit, supplierId]) => ({ item, group, unit, supplierId, sourceType: 'material' }));

// Keep accessories after the original inventory rows so existing inventory IDs remain stable.
const ACCESSORY_INVENTORY = accessories.map((product) => ({
  item: product.name,
  group: 'Accessories',
  unit: 'pcs',
  supplierId: 'SUP-1009',
  sourceType: 'accessory',
}));

const STARTER_INVENTORY = [...PRODUCT_INVENTORY, ...SUPPORTING_MATERIALS, ...ACCESSORY_INVENTORY].map((row, index) => ({
  id: `INV-${String(index + 1001).padStart(4, '0')}`,
  item: row.item,
  group: row.group,
  stock: 0,
  unit: row.unit,
  reorderAt: 0,
  unitCost: 0,
  supplierId: row.supplierId,
  sourceType: row.sourceType,
  updatedAt: new Date().toISOString(),
}));

function starterSupplierRows() {
  const now = new Date().toISOString();
  return STARTER_SUPPLIERS.map((supplier) => ({ ...supplier, createdAt: now }));
}
const KEYS = {
  orders: 'stitch_live_orders_v1',
  inventory: 'stitch_live_inventory_v1',
  suppliers: 'stitch_live_suppliers_v1',
  purchaseOrders: 'stitch_live_purchase_orders_v1',
};

function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function nextSequence(items, prefix, start = 1) {
  const values = items.map((item) => Number(String(item.id || '').replace(/\D/g, '')) || 0);
  const next = Math.max(start - 1, ...values) + 1;
  return `${prefix}-${String(next).padStart(4, '0')}`;
}

export function getAdminOrders() {
  return read(KEYS.orders);
}

export function getAdminCustomers() {
  return getUsers().map((user) => ({
    id: `WEB-${user.id}`,
    name: user.name,
    email: user.email,
    phone: user.phone,
    joinedAt: user.createdAt,
    source: 'Website account',
  }));
}

export function getAdminAppointments() {
  let bookings = [];
  try {
    bookings = JSON.parse(localStorage.getItem('stitch_bookings') || '[]');
    if (!Array.isArray(bookings)) bookings = [];
  } catch {
    bookings = [];
  }

  if (!bookings.length) {
    try {
      const legacy = JSON.parse(localStorage.getItem('stitch_booking') || 'null');
      if (legacy) bookings = [{ ...legacy, id: legacy.id || `WEB-APT-${legacy.createdAt || Date.now()}`, status: legacy.status || 'Pending' }];
    } catch {
      // Ignore malformed legacy booking data.
    }
  }

  return bookings;
}

export function getAdminInventory() {
  const existing = read(KEYS.inventory);
  const byName = new Map(existing.map((item) => [String(item.item || '').trim().toLowerCase(), item]));
  let changed = localStorage.getItem(KEYS.inventory) === null;

  STARTER_INVENTORY.forEach((starter) => {
    const key = starter.item.trim().toLowerCase();
    const current = byName.get(key);
    if (!current) {
      existing.push(starter);
      byName.set(key, starter);
      changed = true;
      return;
    }
    if (!current.supplierId && starter.supplierId) {
      current.supplierId = starter.supplierId;
      current.sourceType = current.sourceType || starter.sourceType;
      current.updatedAt = new Date().toISOString();
      changed = true;
    }
  });

  if (changed) write(KEYS.inventory, existing);
  return existing;
}

export function getInventoryItemByName(name) {
  const normalized = String(name || '').trim().toLowerCase();
  return getAdminInventory().find((item) => String(item.item || '').trim().toLowerCase() === normalized) || null;
}

export function getSuppliers() {
  const existing = read(KEYS.suppliers);
  const ids = new Set(existing.map((supplier) => supplier.id));
  const names = new Set(existing.map((supplier) => String(supplier.businessName || '').trim().toLowerCase()));
  let changed = localStorage.getItem(KEYS.suppliers) === null;

  starterSupplierRows().forEach((starter) => {
    if (!ids.has(starter.id) && !names.has(starter.businessName.toLowerCase())) {
      existing.push(starter);
      ids.add(starter.id);
      names.add(starter.businessName.toLowerCase());
      changed = true;
    }
  });

  if (changed) write(KEYS.suppliers, existing);
  return existing;
}

export function getPurchaseOrders() {
  return read(KEYS.purchaseOrders);
}

export function addCustomerOrder(order) {
  const orders = getAdminOrders();
  const newOrder = {
    id: nextSequence(orders, 'SO'),
    customer: order.customer.trim(),
    item: order.item.trim(),
    category: order.category || 'Bespoke',
    amount: Math.max(0, Number(order.amount) || 0),
    paidAmount: order.payment === 'Paid'
      ? Math.max(0, Number(order.amount) || 0)
      : order.payment === 'Pending' || order.payment === 'Refunded'
        ? 0
        : Math.max(0, Math.min(Number(order.paidAmount) || 0, Number(order.amount) || 0)),
    status: order.status || 'In Production',
    payment: order.payment || 'Pending',
    dueDate: order.dueDate || '',
    notes: order.notes?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  write(KEYS.orders, [newOrder, ...orders]);
  return newOrder;
}

export function updateOrderStatus(id, status) {
  const next = getAdminOrders().map((order) => order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order);
  return write(KEYS.orders, next);
}

export function updateOrderPayment(id, payment, paidAmount) {
  const next = getAdminOrders().map((order) => order.id === id ? {
    ...order,
    payment,
    paidAmount: Math.max(0, Math.min(Number(paidAmount) || 0, Number(order.amount) || 0)),
    updatedAt: new Date().toISOString(),
  } : order);
  return write(KEYS.orders, next);
}

export function updateCustomerOrderContact(id, changes = {}) {
  const next = getAdminOrders().map((order) => order.id === id ? {
    ...order,
    notes: changes.notes === undefined ? order.notes : String(changes.notes || '').trim(),
    updatedAt: new Date().toISOString(),
  } : order);
  return write(KEYS.orders, next);
}

export function updateAppointmentStatus(id, status) {
  try {
    const website = JSON.parse(localStorage.getItem('stitch_bookings') || '[]');
    if (Array.isArray(website)) {
      localStorage.setItem('stitch_bookings', JSON.stringify(website.map((item) => item.id === id ? { ...item, status } : item)));
    }
    const legacy = JSON.parse(localStorage.getItem('stitch_booking') || 'null');
    if (legacy && legacy.id === id) localStorage.setItem('stitch_booking', JSON.stringify({ ...legacy, status }));
  } catch {
    // Ignore malformed booking data.
  }
}

export function addInventoryItem(item) {
  const inventory = getAdminInventory();
  const newItem = {
    id: nextSequence(inventory, 'INV'),
    item: item.item.trim(),
    group: item.group || 'Fabric',
    stock: Math.max(0, Number(item.stock) || 0),
    unit: item.unit || 'm',
    reorderAt: Math.max(0, Number(item.reorderAt) || 0),
    unitCost: Math.max(0, Number(item.unitCost) || 0),
    supplierId: item.supplierId || '',
    updatedAt: new Date().toISOString(),
  };
  write(KEYS.inventory, [newItem, ...inventory]);
  return newItem;
}

export function updateInventoryItem(id, changes) {
  const next = getAdminInventory().map((item) => item.id === id ? {
    ...item,
    ...changes,
    stock: changes.stock === undefined ? item.stock : Math.max(0, Number(changes.stock) || 0),
    reorderAt: changes.reorderAt === undefined ? item.reorderAt : Math.max(0, Number(changes.reorderAt) || 0),
    unitCost: changes.unitCost === undefined ? item.unitCost : Math.max(0, Number(changes.unitCost) || 0),
    updatedAt: new Date().toISOString(),
  } : item);
  return write(KEYS.inventory, next);
}

export function addSupplier(supplier) {
  const suppliers = getSuppliers();
  const newSupplier = {
    id: nextSequence(suppliers, 'SUP'),
    businessName: supplier.businessName.trim(),
    supplierType: supplier.supplierType || 'Raw Material',
    contactPerson: supplier.contactPerson?.trim() || '',
    phone: supplier.phone?.trim() || '',
    whatsapp: supplier.whatsapp?.trim() || supplier.phone?.trim() || '',
    email: supplier.email?.trim().toLowerCase() || '',
    address: supplier.address?.trim() || '',
    panVat: supplier.panVat?.trim() || '',
    notes: supplier.notes?.trim() || '',
    createdAt: new Date().toISOString(),
  };
  write(KEYS.suppliers, [newSupplier, ...suppliers]);
  return newSupplier;
}

export function updateSupplier(id, changes) {
  const next = getSuppliers().map((supplier) => supplier.id === id ? { ...supplier, ...changes } : supplier);
  return write(KEYS.suppliers, next);
}

export function deleteSupplier(id) {
  return write(KEYS.suppliers, getSuppliers().filter((supplier) => supplier.id !== id));
}

export function createPurchaseOrder(order) {
  const purchaseOrders = getPurchaseOrders();
  const year = new Date().getFullYear();
  const sameYear = purchaseOrders.filter((po) => String(po.id).startsWith(`PO-${year}-`));
  const sequence = Math.max(0, ...sameYear.map((po) => Number(String(po.id).split('-').pop()) || 0)) + 1;
  const items = (order.items || [])
    .filter((item) => item.name?.trim() && Number(item.quantity) > 0)
    .map((item) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: item.name.trim(),
      group: item.group || 'Fabric',
      quantity: Math.max(0, Number(item.quantity) || 0),
      unit: item.unit || 'm',
      unitCost: Math.max(0, Number(item.unitCost) || 0),
    }));
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const shipping = Math.max(0, Number(order.shipping) || 0);
  const discount = Math.max(0, Number(order.discount) || 0);
  const taxPercent = Math.max(0, Number(order.taxPercent) || 0);
  const taxable = Math.max(0, subtotal + shipping - discount);
  const tax = taxable * (taxPercent / 100);
  const total = taxable + tax;

  const newOrder = {
    id: `PO-${year}-${String(sequence).padStart(3, '0')}`,
    supplierId: order.supplierId,
    items,
    subtotal,
    shipping,
    discount,
    taxPercent,
    tax,
    total,
    expectedDate: order.expectedDate || '',
    paymentStatus: order.paymentStatus || 'Unpaid',
    status: order.status || 'Draft',
    notes: order.notes?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    receivedAt: null,
  };
  write(KEYS.purchaseOrders, [newOrder, ...purchaseOrders]);
  return newOrder;
}

export function updatePurchaseOrderStatus(id, status) {
  const next = getPurchaseOrders().map((order) => order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order);
  return write(KEYS.purchaseOrders, next);
}

export function updatePurchaseOrderPayment(id, paymentStatus) {
  const next = getPurchaseOrders().map((order) => order.id === id ? { ...order, paymentStatus, updatedAt: new Date().toISOString() } : order);
  return write(KEYS.purchaseOrders, next);
}

export function receivePurchaseOrder(id) {
  const purchaseOrders = getPurchaseOrders();
  const order = purchaseOrders.find((item) => item.id === id);
  if (!order || order.receivedAt) return { ok: false, message: order?.receivedAt ? 'This purchase order has already been received.' : 'Purchase order not found.' };

  let inventory = getAdminInventory();
  order.items.forEach((line) => {
    const normalized = line.name.trim().toLowerCase();
    const index = inventory.findIndex((item) => item.item.trim().toLowerCase() === normalized && item.unit === line.unit);
    if (index >= 0) {
      const existing = inventory[index];
      const oldStock = Number(existing.stock) || 0;
      const incoming = Number(line.quantity) || 0;
      const totalStock = oldStock + incoming;
      const oldCost = Number(existing.unitCost) || 0;
      const incomingCost = Number(line.unitCost) || 0;
      const weightedCost = totalStock > 0 ? ((oldStock * oldCost) + (incoming * incomingCost)) / totalStock : incomingCost;
      inventory[index] = { ...existing, stock: totalStock, unitCost: weightedCost, supplierId: order.supplierId, updatedAt: new Date().toISOString() };
    } else {
      inventory = [{
        id: nextSequence(inventory, 'INV'),
        item: line.name,
        group: line.group || 'Fabric',
        stock: Number(line.quantity) || 0,
        unit: line.unit || 'm',
        reorderAt: 0,
        unitCost: Number(line.unitCost) || 0,
        supplierId: order.supplierId,
        updatedAt: new Date().toISOString(),
      }, ...inventory];
    }
  });

  write(KEYS.inventory, inventory);
  write(KEYS.purchaseOrders, purchaseOrders.map((item) => item.id === id ? {
    ...item,
    status: 'Received',
    receivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } : item));

  return { ok: true };
}

function downloadCsv(filename, headers, rows) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportOrdersCsv(orders = getAdminOrders()) {
  downloadCsv(`stitch-customer-orders-${new Date().toISOString().split('T')[0]}.csv`,
    ['Order', 'Customer', 'Item', 'Category', 'Order Value', 'Paid', 'Status', 'Payment', 'Due Date', 'Created'],
    orders.map((order) => [order.id, order.customer, order.item, order.category, order.amount, order.paidAmount, order.status, order.payment, order.dueDate, order.createdAt]));
}

export function exportPurchaseOrdersCsv(orders = getPurchaseOrders(), suppliers = getSuppliers()) {
  const supplierMap = new Map(suppliers.map((supplier) => [supplier.id, supplier.businessName]));
  downloadCsv(`stitch-purchase-orders-${new Date().toISOString().split('T')[0]}.csv`,
    ['PO', 'Supplier', 'Items', 'Total', 'Payment', 'Status', 'Expected', 'Created', 'Received'],
    orders.map((order) => [order.id, supplierMap.get(order.supplierId) || order.supplierId, order.items.map((item) => `${item.name} (${item.quantity} ${item.unit})`).join('; '), order.total, order.paymentStatus, order.status, order.expectedDate, order.createdAt, order.receivedAt || '']));
}
