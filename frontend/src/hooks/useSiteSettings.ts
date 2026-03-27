import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteSettings {
    admin_id?: string;
    admin_password?: string;
    phone?: string;
    email?: string;
    location?: string;
    facebook_link?: string;
    instagram_link?: string;
    disabled_sections: string[];
}

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings>({
        phone: '9667517894',
        email: 'yourbrandstudio705@gmail.com',
        location: 'Dehri on sone Rattubigha petrol pump near ( Rohtas bihar) Dalmiyanagar, Pin code 821305',
        facebook_link: '#',
        instagram_link: 'https://instagram.com/vishal_kushwaha21',
        disabled_sections: []
    });

    useEffect(() => {
        async function fetchSettings() {
            if (!supabase) return;
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('*')
                    .eq('id', 1)
                    .maybeSingle();

                if (data && !error) {
                    setSettings(data);
                }
            } catch (err) {
                console.warn('Could not fetch site settings');
            }
        }
        fetchSettings();
    }, []);

    return settings;
}
