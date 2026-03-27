import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, CheckCircle, AlertCircle, LogOut, MessageSquare, Trash2, Camera, Film, Home, Plus, Layers, IndianRupee, Edit, X, Settings, Phone, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '';
const normalizedApiBaseUrl = rawApiBaseUrl.toLowerCase();
const apiBaseUrl = !rawApiBaseUrl || normalizedApiBaseUrl.includes('your-backend-url')
    ? ''
    : rawApiBaseUrl.replace(/\/$/, '');

const SECTIONS = [
    { id: 'hero', name: 'Banner', icon: ImageIcon, categories: ['Main Banner'] },
    { id: 'services', name: 'Gallery', icon: Camera, categories: ['Wedding', 'Pre-Wedding', 'Birthday', 'Product', 'Baby', 'Videography', 'Reels', 'Wedding Films', 'Editing', 'Photo & Video Editing', 'Album Design', 'Custom Album', 'Backlit Printing', 'Portrait', 'Commercial', 'Cinematic Films'] },
    { id: 'packages', name: 'Packages', icon: IndianRupee, categories: ['Basic Plan', 'Premium Plan'] },
    { id: 'testimonials', name: 'Reviews', icon: MessageSquare, categories: ['Happy Client'] },
    { id: 'clients', name: 'Clients', icon: Camera, categories: ['Private Gallery'] },
    { id: 'admin_settings', name: 'Settings', icon: Settings, categories: ['Website Settings'] },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('services');
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<any[]>([]);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [clientPassword, setClientPassword] = useState('');
    const [clientDate, setClientDate] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Settings State
    const [siteSettings, setSiteSettings] = useState({
        admin_id: '',
        admin_password: '',
        phone: '',
        email: '',
        location: '',
        facebook_link: '',
        instagram_link: '',
        disabled_sections: [] as string[]
    });

    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) navigate('/admin/login');
        if (supabase) {
            fetchImages();
            fetchSettings();
        }

        const sect = SECTIONS.find(s => s.id === activeTab);
        if (sect) setCategory(sect.categories[0]);
        resetForm();
    }, [navigate, activeTab]);

    // Lock body scroll when menu is open (Mobile)
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setClientPassword('');
        setClientDate('');
        setEditingId(null);
    };

    const fetchSettings = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
            if (error) throw error;
            if (data) setSiteSettings(data);
        } catch (err) {
            console.warn('Settings table not ready or empty');
        }
    };

    const fetchImages = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase.from('site_images').select('*').order('created_at', { ascending: false });
            if (error) throw error;

            let clientData: any[] = [];
            try {
                const { data: clients, error: clientError } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
                if (!clientError) clientData = clients || [];
            } catch (e) {
                console.warn('Clients table might not exist');
            }

            setImages([...(data || []), ...clientData.map(c => ({
                ...c,
                section: 'clients',
                category: 'Private Gallery',
                url: c.photo_url,
                title: c.name,
                description: c.wedding_date,
                isClient: true
            }))]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSaveSettings = async () => {
        if (!supabase) return;
        setUploading(true);
        setStatus(null);
        try {
            const { error } = await supabase.from('site_settings').upsert({ id: 1, ...siteSettings });
            if (error) throw error;
            setStatus({ type: 'success', message: 'Settings saved ho gayi!' });
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setUploading(false);
        }
    };

    const toggleSection = (sectionId: string) => {
        const current = [...siteSettings.disabled_sections];
        if (current.includes(sectionId)) {
            setSiteSettings({ ...siteSettings, disabled_sections: current.filter(id => id !== sectionId) });
        } else {
            setSiteSettings({ ...siteSettings, disabled_sections: [...current, sectionId] });
        }
    };

    const handleDelete = async (id: string, isClient: boolean) => {
        if (!supabase || !window.confirm('Pakka delete karna hai?')) return;
        try {
            const { error: dbError } = await supabase.from(isClient ? 'clients' : 'site_images').delete().eq('id', id);
            if (dbError) throw dbError;
            setStatus({ type: 'success', message: 'Hogaya! Delete ho chuka hai.' });
            fetchImages();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        if (item.isClient) {
            setTitle(item.name);
            setClientDate(item.wedding_date);
            setDescription(item.drive_link);
            setClientPassword(item.password);
        } else {
            if (activeTab === 'packages') {
                const [n, p] = item.title.split(' | ');
                setTitle(n);
                setPrice(p || '');
            } else {
                setTitle(item.title);
            }
            setDescription(item.description || '');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async () => {
        try {
            if (!supabase) throw new Error('Backend connect nahi hai.');
            setUploading(true);
            setStatus(null);

            let finalTitle = title;
            if (activeTab === 'packages') finalTitle = `${title} | ${price}`;

            const payload = activeTab === 'clients' ? {
                name: title,
                wedding_date: clientDate,
                drive_link: description,
                password: clientPassword
            } : {
                section: activeTab,
                category: category,
                title: finalTitle,
                description: description,
                media_type: 'text'
            };

            const table = activeTab === 'clients' ? 'clients' : 'site_images';

            if (editingId) {
                const { error: dbError } = await supabase.from(table).update(payload).eq('id', editingId);
                if (dbError) throw dbError;
            } else {
                const { error: dbError } = await supabase.from(table).insert([payload]);
                if (dbError) throw dbError;
            }

            setStatus({ type: 'success', message: 'Hogaya!' });
            resetForm();
            fetchImages();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!supabase) throw new Error('Backend connect nahi hai.');
            if (!e.target.files || e.target.files.length === 0) return;

            setUploading(true);
            setUploadProgress(0);
            const files = Array.from(e.target.files);

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('resource_type', file.type.startsWith('video/') ? 'video' : 'image');

                const response = await fetch(`${apiBaseUrl}/api/cloudinary-upload`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result?.error || 'Cloudinary upload failed');
                }
                const publicUrl = result.data.url;

                const payload = activeTab === 'clients' ? {
                    name: title,
                    wedding_date: clientDate,
                    photo_url: publicUrl,
                    drive_link: description,
                    password: clientPassword
                } : {
                    url: publicUrl,
                    section: activeTab,
                    category: category,
                    title: title || 'Vishal Moment',
                    description: description,
                    media_type: file.type.startsWith('video/') ? 'video' : 'image'
                };

                const { error: dbError } = await supabase.from(activeTab === 'clients' ? 'clients' : 'site_images').insert([payload]);
                if (dbError) throw dbError;

                setUploadProgress(Math.round(((i + 1) / files.length) * 100));
            }

            setStatus({ type: 'success', message: 'Hogaya!' });
            resetForm();
            fetchImages();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row">
            {/* Header / Sidebar */}
            <header className="md:w-64 bg-[#0a0a0a] border-b md:border-r border-white/5 sticky top-0 z-[100] md:h-screen">
                <div className="p-6 md:p-8 flex items-center justify-between">
                    <h1 className="text-xl font-serif font-bold text-gold-500">VP Admin</h1>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                        {isMenuOpen ? <X /> : <Layers className="text-gold-500" />}
                    </button>
                </div>

                <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]`}>
                    {SECTIONS.map((s) => (
                        <button key={s.id} onClick={() => { setActiveTab(s.id); setIsMenuOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === s.id ? 'bg-gold-600 text-black font-bold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                            <s.icon className="w-5 h-5" />
                            <span className="text-xs uppercase tracking-widest">{s.name}</span>
                        </button>
                    ))}
                    <div className="pt-8 space-y-2 border-t border-white/5 mt-4">
                        <button onClick={() => navigate('/')} className="w-full text-xs p-4 flex items-center gap-4 text-gray-500 hover:text-white uppercase tracking-widest">
                            <Home className="w-4 h-4" /> Live Site
                        </button>
                        <button onClick={() => { localStorage.removeItem('adminLoggedIn'); navigate('/admin/login'); }} className="w-full text-xs p-4 flex items-center gap-4 text-gray-500 hover:text-red-500 uppercase tracking-widest">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-12 max-w-6xl mx-auto w-full space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">{SECTIONS.find(s => s.id === activeTab)?.name}</h2>
                    {status && (
                        <div className={`text-[10px] font-bold uppercase p-3 rounded-xl border flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                            {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {status.message}
                        </div>
                    )}
                </div>

                {activeTab === 'admin_settings' ? (
                    /* General Settings Tab */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Login Credentials */}
                        <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 shadow-xl space-y-6">
                            <div className="flex items-center gap-4 text-gold-500 mb-2">
                                <Settings className="w-6 h-6" />
                                <h3 className="font-serif font-bold text-xl">Login Credentials</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-4">Admin Username</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={siteSettings.admin_id} onChange={e => setSiteSettings({ ...siteSettings, admin_id: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-4">Admin Password</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={siteSettings.admin_password} onChange={e => setSiteSettings({ ...siteSettings, admin_password: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 shadow-xl space-y-6">
                            <div className="flex items-center gap-4 text-gold-500 mb-2">
                                <Phone className="w-6 h-6" />
                                <h3 className="font-serif font-bold text-xl">Contact & Socials</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-4">Phone Number</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={siteSettings.phone} onChange={e => setSiteSettings({ ...siteSettings, phone: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-4">Email Address</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={siteSettings.email} onChange={e => setSiteSettings({ ...siteSettings, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-4">Studio Location</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={siteSettings.location} onChange={e => setSiteSettings({ ...siteSettings, location: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-4">Facebook URL</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={siteSettings.facebook_link} onChange={e => setSiteSettings({ ...siteSettings, facebook_link: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-4">Instagram URL</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={siteSettings.instagram_link} onChange={e => setSiteSettings({ ...siteSettings, instagram_link: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Disable Sections */}
                        <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 shadow-xl space-y-6">
                            <div className="flex items-center gap-4 text-gold-500 mb-2">
                                <EyeOff className="w-6 h-6" />
                                <h3 className="font-serif font-bold text-xl">Hide Sections</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {['hero', 'services', 'gallery', 'packages', 'about', 'testimonials', 'contact'].map(sec => (
                                    <button
                                        key={sec}
                                        onClick={() => toggleSection(sec)}
                                        className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-3 ${siteSettings.disabled_sections.includes(sec) ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-green-500/5 border-green-500/20 text-green-500'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${siteSettings.disabled_sections.includes(sec) ? 'bg-red-500' : 'bg-green-500'}`} />
                                        {sec} {siteSettings.disabled_sections.includes(sec) ? '(Hidden)' : '(Shown)'}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[9px] text-gray-600 uppercase font-bold tracking-wider ml-4">Note: Hidden sections will not appear on the live website.</p>
                        </div>

                        <button onClick={handleSaveSettings} disabled={uploading} className="w-full py-6 bg-gold-600 text-black rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-gold-600/10 hover:bg-gold-500 transition-all">
                            {uploading ? 'Saving...' : 'Save All Settings'}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Categories */}
                        {activeTab !== 'clients' && activeTab !== 'hero' && (
                            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                {SECTIONS.find(s => s.id === activeTab)?.categories.map(cat => (
                                    <button key={cat} onClick={() => setCategory(cat)} className={`flex-none px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${category === cat ? 'bg-gold-600 border-gold-600 text-black' : 'border-white/10 text-gray-500'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Form Editor */}
                        <div className="bg-[#0a0a0a] p-6 md:p-10 rounded-[2rem] border border-white/5 shadow-xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <input type="text" placeholder={activeTab === 'clients' ? "Client Name" : "Title"} className="w-full bg-black/50 border border-white/5 p-4 md:p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={title} onChange={e => setTitle(e.target.value)} />

                                    {activeTab === 'packages' && (
                                        <input type="text" placeholder="Price (₹50k - ₹80k)" className="w-full bg-black/50 border border-white/5 p-4 md:p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold text-gold-500" value={price} onChange={e => setPrice(e.target.value)} />
                                    )}

                                    {activeTab === 'clients' && (
                                        <div className="grid grid-cols-1 gap-4">
                                            <input type="text" placeholder="Date (e.g. 12 Feb 2026)" className="w-full bg-black/50 border border-white/5 p-4 md:p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold" value={clientDate} onChange={e => setClientDate(e.target.value)} />
                                            <input type="text" placeholder="Set Gallery Key (Password)" className="w-full bg-black/50 border border-white/5 p-4 md:p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold text-gold-500" value={clientPassword} onChange={e => setClientPassword(e.target.value)} />
                                        </div>
                                    )}

                                    <textarea placeholder={activeTab === 'clients' ? "Paste Drive Link Here" : activeTab === 'packages' ? "Features (1 per line)" : "Description..."} rows={4} className="w-full bg-black/50 border border-white/5 p-4 md:p-5 rounded-2xl text-sm focus:outline-none focus:border-gold-600 transition-all font-bold resize-none" value={description} onChange={e => setDescription(e.target.value)} />
                                </div>

                                <div className="flex flex-col justify-center">
                                    {editingId ? (
                                        <button onClick={handleSave} disabled={uploading} className="w-full h-full min-h-[150px] md:min-h-[250px] bg-gold-600 text-black rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:bg-gold-500 transition-all active:scale-[0.98]">
                                            <Edit className="w-10 h-10" />
                                            <span className="text-sm font-black uppercase tracking-widest">Update Details</span>
                                        </button>
                                    ) : (activeTab === 'packages' || activeTab === 'clients' ? (
                                        <button onClick={handleSave} disabled={uploading} className="w-full h-full min-h-[150px] md:min-h-[250px] bg-gold-600 text-black rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:bg-gold-500 transition-all active:scale-[0.98]">
                                            {uploading ? <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full" /> : <Plus className="w-10 h-10" />}
                                            <span className="text-sm font-black uppercase tracking-widest">Save {activeTab === 'clients' ? 'Client' : 'Package'}</span>
                                        </button>
                                    ) : (
                                        <div className="relative group h-full">
                                            <input type="file" multiple onChange={handleUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*,video/*" />
                                            <div className="h-full min-h-[150px] md:min-h-[250px] border-4 border-dashed border-white/5 bg-black/30 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all group-hover:border-gold-600 group-hover:bg-gold-600/5">
                                                {uploading ? (
                                                    <div className="text-center space-y-4">
                                                        <div className="w-12 h-12 border-4 border-gold-600 border-t-transparent animate-spin rounded-full mx-auto" />
                                                        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">{uploadProgress}% Uploading</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center transition-colors group-hover:bg-gold-600 group-hover:text-black">
                                                            <Plus />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-xs font-black uppercase tracking-widest">Post to {activeTab}</span>
                                                            <p className="text-[10px] text-gray-600 font-bold mt-1 uppercase">Select Photo/Video</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Item List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h3 className="text-lg font-serif font-bold uppercase tracking-widest">Recently Added</h3>
                                <span className="text-[10px] font-bold text-gray-500 uppercase bg-white/5 px-4 py-1 rounded-full">Total: {images.filter(i => (activeTab === 'clients' ? i.isClient : i.section === activeTab && i.category === category)).length}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {images.filter(i => (activeTab === 'clients' ? i.isClient : i.section === activeTab && i.category === category)).map((item) => (
                                    <div key={item.id} className="group relative bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/5 hover:border-gold-600/30 transition-all">
                                        <div className="aspect-[4/5] relative bg-black flex flex-col items-center justify-center p-6 text-center">
                                            {activeTab === 'packages' ? (
                                                <div className="space-y-3">
                                                    <IndianRupee className="w-10 h-10 text-gold-500 mx-auto" />
                                                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                                                    <div className="text-[10px] text-gray-500 font-bold uppercase">{item.category}</div>
                                                </div>
                                            ) : activeTab === 'clients' ? (
                                                <div className="w-full h-full">
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                                                        <img src={item.url} className="w-full h-full object-cover opacity-60" />
                                                    </div>
                                                    <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
                                                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                                        <p className="text-[10px] text-gold-500 font-black uppercase tracking-widest">Key: {item.password}</p>
                                                        <p className="text-[9px] text-gray-500 font-bold mt-1 uppercase">{item.wedding_date}</p>
                                                    </div>
                                                </div>
                                            ) : item.media_type === 'video' ? (
                                                <div className="w-full h-full">
                                                    <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-60" muted />
                                                    <Film className="w-10 h-10 text-gold-500 opacity-20 relative z-10" />
                                                </div>
                                            ) : (
                                                <img src={item.url} className="w-full h-full object-cover opacity-80" />
                                            )}
                                        </div>

                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 p-4">
                                            <button onClick={() => handleEdit(item)} className="p-4 rounded-2xl bg-white/10 text-white hover:bg-white hover:text-black transition-all">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id, item.isClient)} className="p-4 rounded-2xl bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {images.filter(i => (activeTab === 'clients' ? i.isClient : i.section === activeTab && i.category === category)).length === 0 && (
                                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                                    <p className="text-gray-800 font-black uppercase tracking-[0.3em] text-[10px] italic">No items found.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
