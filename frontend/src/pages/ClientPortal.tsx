import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Search, Calendar, ChevronRight, X } from 'lucide-react';

export default function ClientPortal() {
    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        if (!supabase) return;
        try {
            const { data, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (clientError) throw clientError;
            setClients(data || []);
        } catch (err) {
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccess = () => {
        if (password === selectedClient.password) {
            // Convert to embed link or use standard link
            let finalLink = selectedClient.drive_link;
            if (finalLink.includes('drive.google.com/drive/folders/')) {
                const folderId = finalLink.split('/folders/')[1].split('?')[0];
                finalLink = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
            }
            window.open(finalLink, "_blank");
            setSelectedClient(null);
            setPassword('');
            setError('');
        } else {
            setError('Wrong Password! Please check and try again.');
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight">Client <span className="text-gold-500 italic">Portal</span></h1>
                    <p className="text-gray-400 font-light tracking-[0.3em] uppercase text-xs">Access your private wedding gallery</p>
                    <div className="w-20 h-[1px] bg-gold-600/50 mx-auto mt-8"></div>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-16 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search your name..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-gold-600 focus:bg-white/10 transition-all font-light"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Clients Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-2 border-gold-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 cursor-pointer hover:border-gold-600/40 transition-all duration-700"
                            >
                                <img
                                    src={client.photo_url}
                                    alt={client.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 text-[10px] text-gold-500 font-bold uppercase tracking-[0.2em]">
                                            <Calendar className="w-3 h-3" />
                                            {client.wedding_date}
                                        </div>
                                        <h3 className="text-2xl font-serif text-white">{client.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-white/40 font-light opacity-0 group-hover:opacity-100 transition-opacity delay-100 uppercase tracking-widest">
                                            View Private Gallery <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Lock className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredClients.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <p className="text-gray-500 font-light tracking-widest uppercase text-sm italic">Gallery not found</p>
                    </div>
                )}
            </div>

            {/* Password Modal */}
            {selectedClient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] w-full max-w-md rounded-[3rem] border border-white/10 p-10 relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-50"></div>

                        <button
                            onClick={() => { setSelectedClient(null); setPassword(''); setError(''); }}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-gold-600/10 rounded-3xl flex items-center justify-center mx-auto mb-2">
                                <Lock className="w-8 h-8 text-gold-500 shadow-lg" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-serif text-white mb-2">{selectedClient.name}</h2>
                                <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-light">Enter private access key</p>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="password"
                                    autoFocus
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-center text-xl tracking-[0.5em] focus:outline-none focus:border-gold-600 transition-all text-gold-500 placeholder:text-gray-800"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
                                />
                                {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}

                                <button
                                    onClick={handleAccess}
                                    className="w-full bg-gold-600 hover:bg-gold-500 text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-gold-600/20 active:scale-[0.98] transition-all"
                                >
                                    Unlock Gallery
                                </button>
                            </div>

                            <p className="text-[10px] text-gray-600 font-light">
                                Contact Vishal Photography if you don't have the key.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
