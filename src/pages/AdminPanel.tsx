import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, PackageSearch, Settings, Type, Wrench, Save, Trash2, Plus, RefreshCw, Search, AlertCircle, CreditCard, Layers3, FileText, BarChart3 } from 'lucide-react';
import { fetchJson } from '../lib/api';

type Service = {
  id: string;
  category: 'ai' | 'card' | 'graphic';
  image: string;
  title: { dr: string; ps: string; en: string };
  description: { dr: string; ps: string; en: string };
  price: { dr: string; ps: string; en: string };
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

type Order = {
  tracking_code: string;
  customer_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  items?: OrderItem[];
  amount_afn: number;
  payment_status: string;
  order_status: string;
  notes: string;
  created_at: string;
};

type LocalizedText = { dr: string; ps: string; en: string };

type Tab = 'orders' | 'services' | 'content' | 'settings';

const emptyService = (): Service => ({
  id: '',
  category: 'ai',
  image: '/images/logo.svg',
  title: { dr: '', ps: '', en: '' },
  description: { dr: '', ps: '', en: '' },
  price: { dr: '', ps: '', en: '' },
});

const ORDER_PAYMENT_STATUSES = ['pending', 'paid', 'failed'] as const;
const ORDER_WORK_STATUSES = ['new', 'confirmed', 'in_progress', 'completed', 'cancelled', 'failed'] as const;

export default function AdminPanel() {
  const token = localStorage.getItem('admin_token') || '';
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [content, setContent] = useState<Record<string, LocalizedText>>({});
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [serviceForm, setServiceForm] = useState<Service>(emptyService());
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSavingService, setIsSavingService] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [orderSavingCode, setOrderSavingCode] = useState<string | null>(null);
  const [orderDeletingCode, setOrderDeletingCode] = useState<string | null>(null);
  const [serviceDeletingId, setServiceDeletingId] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [newSettingKey, setNewSettingKey] = useState('');

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }), [token]);

  const handleAdminError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown admin error.';
    setErrorMessage(message);
    if (message.toLowerCase().includes('expired') || message.toLowerCase().includes('authentication') || message.toLowerCase().includes('invalid')) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_profile');
      window.location.href = '/admin/login';
    }
  }, []);

  const loadData = useCallback(async (refresh = false) => {
    setErrorMessage('');
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [ordersData, servicesData, contentData, settingsData] = await Promise.all([
        fetchJson<{ orders: Order[] }>('/api/admin/orders', { headers: authHeaders }),
        fetchJson<{ services: Service[] }>('/api/admin/services', { headers: authHeaders }),
        fetchJson<{ content: Record<string, LocalizedText> }>('/api/admin/site-content', { headers: authHeaders }),
        fetchJson<{ settings: Record<string, string> }>('/api/admin/site-settings', { headers: authHeaders }),
      ]);

      setOrders(ordersData.orders || []);
      setServices(servicesData.services || []);
      setContent(contentData.content || {});
      setSettings(settingsData.settings || {});
      setStatusMessage(refresh ? 'Admin data refreshed.' : '');
    } catch (error) {
      handleAdminError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [authHeaders, handleAdminError]);

  useEffect(() => {
    loadData().catch(handleAdminError);
  }, [loadData, handleAdminError]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_profile');
    window.location.href = '/admin/login';
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceForm(emptyService());
  };

  const saveService = async () => {
    if (!serviceForm.id.trim() && !editingServiceId) {
      setErrorMessage('Service ID is required.');
      return;
    }
    if (!serviceForm.title.en.trim() && !serviceForm.title.dr.trim() && !serviceForm.title.ps.trim()) {
      setErrorMessage('At least one service title is required.');
      return;
    }

    setIsSavingService(true);
    setErrorMessage('');
    try {
      const method = editingServiceId ? 'PUT' : 'POST';
      const url = editingServiceId ? `/api/admin/services/${editingServiceId}` : '/api/admin/services';
      await fetchJson(url, { method, headers: authHeaders, body: JSON.stringify(serviceForm) });
      resetServiceForm();
      await loadData(true);
      setStatusMessage('Service saved successfully.');
    } catch (error) {
      handleAdminError(error);
    } finally {
      setIsSavingService(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    setServiceDeletingId(id);
    setErrorMessage('');
    try {
      await fetchJson(`/api/admin/services/${id}`, { method: 'DELETE', headers: authHeaders });
      await loadData(true);
      setStatusMessage('Service deleted.');
      if (editingServiceId === id) resetServiceForm();
    } catch (error) {
      handleAdminError(error);
    } finally {
      setServiceDeletingId(null);
    }
  };

  const saveContent = async () => {
    setIsSavingContent(true);
    setErrorMessage('');
    try {
      await fetchJson('/api/admin/site-content', { method: 'PUT', headers: authHeaders, body: JSON.stringify({ content }) });
      setStatusMessage('Site text updated.');
    } catch (error) {
      handleAdminError(error);
    } finally {
      setIsSavingContent(false);
    }
  };

  const saveSettings = async () => {
    setIsSavingSettings(true);
    setErrorMessage('');
    try {
      await fetchJson('/api/admin/site-settings', { method: 'PUT', headers: authHeaders, body: JSON.stringify({ settings }) });
      setStatusMessage('Site settings updated.');
    } catch (error) {
      handleAdminError(error);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const updateOrder = async (tracking_code: string, patch: Partial<Order>) => {
    const existing = orders.find((item) => item.tracking_code === tracking_code);
    if (!existing) return;
    setOrderSavingCode(tracking_code);
    setErrorMessage('');
    try {
      await fetchJson(`/api/admin/orders/${tracking_code}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ ...existing, ...patch }),
      });
      await loadData(true);
      setStatusMessage(`Order ${tracking_code} updated.`);
    } catch (error) {
      handleAdminError(error);
    } finally {
      setOrderSavingCode(null);
    }
  };

  const deleteOrder = async (trackingCode: string) => {
    if (!window.confirm(`Delete order ${trackingCode}?`)) return;

    setOrderDeletingCode(trackingCode);
    setErrorMessage('');
    try {
      await fetchJson(`/api/admin/orders/${trackingCode}`, { method: 'DELETE', headers: authHeaders });
      setOrders((prev) => prev.filter((item) => item.tracking_code !== trackingCode));
      setStatusMessage(`Order ${trackingCode} deleted.`);
    } catch (error) {
      handleAdminError(error);
    } finally {
      setOrderDeletingCode(null);
    }
  };

  const addSettingField = () => {
    const key = newSettingKey.trim();
    if (!key) {
      setErrorMessage('Enter a setting key first.');
      return;
    }
    if (settings[key] !== undefined) {
      setErrorMessage('This setting key already exists.');
      return;
    }
    setSettings((prev) => ({ ...prev, [key]: '' }));
    setNewSettingKey('');
    setStatusMessage(`Setting field "${key}" added locally. Save settings to persist it.`);
  };

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) =>
      [order.tracking_code, order.customer_name, order.email, order.phone, order.whatsapp, order.payment_status, order.order_status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [orders, orderSearch]);

  const summaryCards = useMemo(() => ([
    { label: 'Total orders', value: orders.length.toString(), hint: `${orders.filter((order) => order.payment_status === 'paid').length} paid`, icon: CreditCard },
    { label: 'Active services', value: services.length.toString(), hint: `${services.filter((service) => service.category === 'ai').length} AI services`, icon: Layers3 },
    { label: 'Text entries', value: Object.keys(content).length.toString(), hint: 'Localized content blocks', icon: FileText },
    { label: 'Settings keys', value: Object.keys(settings).length.toString(), hint: 'Runtime configuration', icon: BarChart3 },
  ]), [orders, services, content, settings]);

  const menu = [
    { id: 'orders' as const, label: 'Orders', icon: PackageSearch },
    { id: 'services' as const, label: 'Services', icon: Wrench },
    { id: 'content' as const, label: 'Text', icon: Type },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="font-black text-white">Loading admin panel…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto grid xl:grid-cols-[280px_1fr] gap-8">
        <aside className="glass rounded-[32px] border border-white/10 p-6 h-fit space-y-3 xl:sticky xl:top-28">
          <div className="mb-6">
            <div className="text-primary text-xs uppercase tracking-[0.25em] font-black mb-2">Admin</div>
            <h1 className="text-3xl font-black">Management Panel</h1>
          </div>
          {menu.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`w-full flex items-center gap-3 rounded-2xl px-4 py-4 font-black transition-all ${tab === item.id ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'border border-white/5 bg-white/[0.02] hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          <button onClick={() => loadData(true).catch(handleAdminError)} disabled={isRefreshing} className="w-full flex items-center gap-3 rounded-2xl px-4 py-4 font-black hover:bg-white/5 transition-colors disabled:opacity-60">
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh data
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 rounded-2xl px-4 py-4 font-black text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </aside>

        <main className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,198,39,0.14),transparent_55%),rgba(255,255,255,0.03)] p-8 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-primary">Workspace overview</div>
                <h2 className="text-4xl font-black">A cleaner dashboard for daily operations.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300">Review live order activity, update services, manage localized text, and maintain settings from one place.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-gray-300">
                <div className="text-xs uppercase tracking-[0.24em] text-gray-500">Current tab</div>
                <div className="mt-2 text-xl font-black text-white">{menu.find((item) => item.id === tab)?.label}</div>
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <card.icon className="mb-4 h-5 w-5 text-primary" />
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-gray-500">{card.label}</div>
                  <div className="mt-3 text-3xl font-black text-white">{card.value}</div>
                  <div className="mt-2 text-sm text-gray-400">{card.hint}</div>
                </div>
              ))}
            </div>
          </div>
          {statusMessage && <div className="rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4 font-bold text-primary">{statusMessage}</div>}
          {errorMessage && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 font-bold text-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {tab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[32px] border border-white/10 p-6 overflow-auto shadow-2xl shadow-black/20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h2 className="text-3xl font-black">Orders</h2>
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search by tracking code, name, or contact" className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3" />
                </div>
              </div>
              <div className="space-y-4">
                {filteredOrders.length === 0 && <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">No orders match your search.</div>}
                {filteredOrders.map((order) => (
                  <div key={order.tracking_code} className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.03))] p-5 shadow-lg shadow-black/10">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">{order.tracking_code}</div>
                        <div className="text-2xl font-black">{order.customer_name}</div>
                        <div className="text-sm text-gray-400">{order.email || order.phone || order.whatsapp}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-black text-xl">{order.amount_afn.toLocaleString()} AFN</div>
                        <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-3">Order Items</div>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={`${order.tracking_code}-${item.id}`} className="flex items-center justify-between gap-4 text-sm">
                              <div className="text-gray-200">{item.name}</div>
                              <div className="text-gray-400">{item.quantity || 1} × {Number(item.price || 0).toLocaleString()} AFN</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-3">
                      <select value={order.payment_status} onChange={(e) => updateOrder(order.tracking_code, { payment_status: e.target.value })} disabled={orderSavingCode === order.tracking_code || orderDeletingCode === order.tracking_code} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 disabled:opacity-60">
                        {ORDER_PAYMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <select value={order.order_status} onChange={(e) => updateOrder(order.tracking_code, { order_status: e.target.value })} disabled={orderSavingCode === order.tracking_code || orderDeletingCode === order.tracking_code} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 disabled:opacity-60">
                        {ORDER_WORK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <input value={order.notes || ''} onChange={(e) => setOrders((prev) => prev.map((item) => item.tracking_code === order.tracking_code ? { ...item, notes: e.target.value } : item))} onBlur={(e) => updateOrder(order.tracking_code, { notes: e.target.value })} disabled={orderSavingCode === order.tracking_code || orderDeletingCode === order.tracking_code} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 disabled:opacity-60" placeholder="Internal notes" />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => deleteOrder(order.tracking_code).catch(handleAdminError)}
                        disabled={orderDeletingCode === order.tracking_code || orderSavingCode === order.tracking_code}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-bold text-red-200 transition-colors hover:bg-red-500/15 disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" />
                        {orderDeletingCode === order.tracking_code ? 'Deleting…' : 'Delete order'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'services' && (
            <div className="grid xl:grid-cols-[420px_1fr] gap-6">
              <div className="glass rounded-[32px] border border-white/10 p-6 space-y-4 shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black">Service Editor</h2>
                  <button onClick={resetServiceForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold">Reset</button>
                </div>
                <input value={serviceForm.id} onChange={(e) => setServiceForm((prev) => ({ ...prev, id: e.target.value }))} placeholder="service-id" disabled={Boolean(editingServiceId)} className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 disabled:opacity-50" />
                <select value={serviceForm.category} onChange={(e) => setServiceForm((prev) => ({ ...prev, category: e.target.value as Service['category'] }))} className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <option value="ai">ai</option>
                  <option value="card">card</option>
                  <option value="graphic">graphic</option>
                </select>
                <input value={serviceForm.image} onChange={(e) => setServiceForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="/images/service.jpg" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3" />
                {(['dr', 'ps', 'en'] as const).map((lang) => (
                  <div key={lang} className="space-y-2 rounded-2xl border border-white/10 p-4 bg-white/5">
                    <div className="text-sm font-black uppercase">{lang}</div>
                    <input value={serviceForm.title[lang]} onChange={(e) => setServiceForm((prev) => ({ ...prev, title: { ...prev.title, [lang]: e.target.value } }))} placeholder={`Title (${lang})`} className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3" />
                    <textarea value={serviceForm.description[lang]} onChange={(e) => setServiceForm((prev) => ({ ...prev, description: { ...prev.description, [lang]: e.target.value } }))} placeholder={`Description (${lang})`} className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 min-h-24" />
                    <input value={serviceForm.price[lang]} onChange={(e) => setServiceForm((prev) => ({ ...prev, price: { ...prev.price, [lang]: e.target.value } }))} placeholder={`Price (${lang})`} className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3" />
                  </div>
                ))}
                <button onClick={() => saveService().catch(handleAdminError)} disabled={isSavingService} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-black text-dark disabled:opacity-60">
                  <Save className="w-4 h-4" /> {isSavingService ? 'Saving…' : 'Save Service'}
                </button>
              </div>
              <div className="glass rounded-[32px] border border-white/10 p-6 shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black">Services</h2>
                  <span className="text-gray-400 text-sm">{services.length} total</span>
                </div>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.03))] p-5 flex flex-col gap-4 lg:flex-row lg:items-center">
                      <img src={service.image} alt={service.title.en} className="w-full lg:w-28 h-28 rounded-2xl object-cover bg-black/20" />
                      <div className="flex-1">
                        <div className="text-sm uppercase tracking-[0.25em] text-primary font-black mb-2">{service.category}</div>
                        <div className="text-2xl font-black mb-2">{service.title.en || service.title.dr || service.title.ps}</div>
                        <div className="text-gray-400 line-clamp-2">{service.description.en || service.description.dr || service.description.ps}</div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingServiceId(service.id); setServiceForm(service); }} className="rounded-2xl border border-white/10 px-4 py-3 font-bold hover:bg-white/5">Edit</button>
                        <button onClick={() => deleteService(service.id).catch(handleAdminError)} disabled={serviceDeletingId === service.id} className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-bold text-red-200 disabled:opacity-60"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'content' && (
            <div className="glass rounded-[32px] border border-white/10 p-6 space-y-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between"><h2 className="text-3xl font-black">Editable Site Text</h2><button onClick={() => saveContent().catch(handleAdminError)} disabled={isSavingContent} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-dark disabled:opacity-60"><Save className="w-4 h-4" /> {isSavingContent ? 'Saving…' : 'Save Text'}</button></div>
              {Object.entries(content).map(([key, value]) => (
                <div key={key} className="rounded-[24px] border border-white/10 bg-white/5 p-5 grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-3 font-black text-primary">{key}</div>
                  {(['dr', 'ps', 'en'] as const).map((lang) => (
                    <textarea key={lang} value={value[lang]} onChange={(e) => setContent((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: e.target.value } }))} className="rounded-2xl bg-black/20 border border-white/10 px-4 py-3 min-h-28" />
                  ))}
                </div>
              ))}
            </div>
          )}

          {tab === 'settings' && (
            <div className="glass rounded-[32px] border border-white/10 p-6 space-y-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between"><h2 className="text-3xl font-black">Site Settings</h2><button onClick={() => saveSettings().catch(handleAdminError)} disabled={isSavingSettings} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-dark disabled:opacity-60"><Save className="w-4 h-4" /> {isSavingSettings ? 'Saving…' : 'Save Settings'}</button></div>
              <div className="flex flex-col md:flex-row gap-3">
                <input value={newSettingKey} onChange={(e) => setNewSettingKey(e.target.value)} placeholder="new_setting_key" className="flex-1 rounded-2xl bg-black/20 border border-white/10 px-4 py-3" />
                <button onClick={addSettingField} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 px-5 py-3 font-bold hover:bg-white/5">
                  <Plus className="w-4 h-4" /> Add setting field
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <div className="text-sm font-black uppercase tracking-[0.25em] text-primary mb-3">{key}</div>
                    <input value={value} onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))} className="w-full rounded-2xl bg-black/20 border border-white/10 px-4 py-3" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
