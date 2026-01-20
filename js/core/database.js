(function () {
    const supabaseUrl = 'https://crfkdzaikuqyojauuprp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZmtkemFpa3VxeW9qYXV1cHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDAzMTIsImV4cCI6MjA4MzM3NjMxMn0.0M971JQatbXQi90KQf6YvE2qCDa64ZBT250AVJF97IQ';

    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Supabase initialized');
    } else {
        console.error('Supabase library not loaded. Make sure to include the Supabase CDN.');
    }

    DigitalCard.Core.Database = {
        saveCard: async (cardData) => {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) return { error: { message: 'Not authenticated' } };

            // Add user_id to cardData
            cardData.user_id = user.id;

            // We will upsert based on user_id if we want one card per user, 
            // but the schema allows multiple. For this simple app, let's just insert/update.
            // But we need an ID to update. 
            // Let's try to find an existing card for this user first.

            const { data: existingCard } = await window.supabaseClient
                .from('cards')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (existingCard) {
                cardData.id = existingCard.id;
            }

            const { data, error } = await window.supabaseClient
                .from('cards')
                .upsert(cardData)
                .select();
            return { data, error };
        },
        getMyCard: async () => {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) return { data: null, error: null };

            const { data, error } = await window.supabaseClient
                .from('cards')
                .select('*')
                .eq('user_id', user.id)
                .single();
            return { data, error };
        },
        getProfile: async () => {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) return { data: null, error: null };

            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            return { data, error };
        },
        updateSubscription: async (isPro) => {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) return { error: { message: 'Not authenticated' } };

            const { data, error } = await window.supabaseClient
                .from('profiles')
                .update({ is_pro: isPro, updated_at: new Date().toISOString() })
                .eq('id', user.id);
            return { data, error };
        }
    };
})();
