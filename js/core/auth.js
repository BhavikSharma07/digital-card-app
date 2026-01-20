(function () {
    DigitalCard.Core.Auth = {
        signUp: async (email, password, metaData = {}) => {
            const { data, error } = await window.supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: metaData
                }
            });
            return { data, error };
        },
        signIn: async (email, password) => {
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email,
                password,
            });
            return { data, error };
        },
        signOut: async () => {
            const { error } = await window.supabaseClient.auth.signOut();
            if (!error) {
                window.location.href = 'index.html';
            }
            return { error };
        },
        getUser: async () => {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            return user;
        },
        onAuthStateChange: (callback) => {
            window.supabaseClient.auth.onAuthStateChange((event, session) => {
                callback(event, session);
            });
        }
    };
})();
