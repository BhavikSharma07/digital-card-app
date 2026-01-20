(function () {
    let proStatusCache = null;

    DigitalCard.Utils.Subscription = {
        isPro: async function () {
            if (proStatusCache !== null) return proStatusCache;

            const { data: profile, error } = await DigitalCard.Core.Database.getProfile();
            if (error) {
                console.warn('Could not fetch profile:', error);
                return false;
            }

            proStatusCache = profile ? profile.is_pro : false;
            return proStatusCache;
        },

        // Helper to check if a specific feature is locked
        isFeatureLocked: async function (featureLevel) {
            if (featureLevel === 'free') return false;
            const pro = await this.isPro();
            return !pro;
        },

        // Helper to show a "Premium Required" prompt
        showPremiumPrompt: function () {
            if (confirm('This is a premium feature. Would you like to view our pricing plans?')) {
                window.location.href = 'pricing.html';
            }
        }
    };
})();
