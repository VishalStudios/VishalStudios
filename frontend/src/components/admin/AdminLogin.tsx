import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            console.log('Attempting login with:', username);
            // Fetch credentials from Supabase
            const { data, error: dbError } = await supabase
                .from('site_settings')
                .select('admin_id, admin_password')
                .eq('id', 1)
                .maybeSingle();

            if (dbError) console.error('Supabase error:', dbError);
            console.log('Database returned:', data);

            // Accepted credentials (either from DB or hardcoded fallback)
            const isMatch = (username === (data?.admin_id || 'vishalriya26') && password === (data?.admin_password || 'Vishalriya26')) ||
                (username === 'vishalriya26' && password === 'Vishalriya26');

            if (isMatch) {
                console.log('Login successful!');
                localStorage.setItem('adminLoggedIn', 'true');
                navigate('/admin/dashboard');
            } else {
                console.warn('Credential mismatch. Input:', username, 'Expected (DB):', data?.admin_id);
                setError('Invalid credentials');
            }
        } catch (err) {
            console.error('Fatal login error:', err);
            // Absolute fallback
            if (username === 'vishalriya26' && password === 'Vishalriya26') {
                localStorage.setItem('adminLoggedIn', 'true');
                navigate('/admin/dashboard');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };


    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-dark-800 p-10 rounded-2xl border border-white/5 shadow-2xl">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-gold-600/10 rounded-full">
                            <Camera className="w-10 h-10 text-gold-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Admin Login</h2>
                    <p className="mt-2 text-gray-400 font-light">Enter your credentials to manage the website</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-3 bg-dark-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 bg-dark-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-dark-900 bg-gold-600 hover:bg-gold-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}
