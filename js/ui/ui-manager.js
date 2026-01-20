(function () {
    DigitalCard.UI.UIManager = {
        init: function () {
            this.handleAuthUI();
            DigitalCard.Core.Auth.onAuthStateChange((event, session) => {
                this.handleAuthUI(session);
            });

            // Mobile menu toggles
            const menuToggle = document.getElementById('menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuClose = document.getElementById('menu-close');

            if (menuToggle && mobileMenu && menuClose) {
                menuToggle.addEventListener('click', () => {
                    mobileMenu.classList.add('active');
                });
                menuClose.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                });
            }
        },
        handleAuthUI: async function (session) {
            if (!session) {
                const user = await DigitalCard.Core.Auth.getUser();
                if (user) {
                    session = { user };
                }
            }

            const authButtons = document.getElementById('auth-buttons');
            const userMenu = document.getElementById('user-menu');
            const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
            const mobileUserMenu = document.getElementById('mobile-user-menu');
            const logoutBtn = document.getElementById('logout-btn');
            const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

            if (session && session.user) {
                if (authButtons) authButtons.classList.add('hidden');
                if (userMenu) userMenu.classList.remove('hidden');
                if (userMenu) userMenu.classList.add('flex');

                if (mobileAuthButtons) mobileAuthButtons.classList.add('hidden');
                if (mobileUserMenu) mobileUserMenu.classList.remove('hidden');
                if (mobileUserMenu) mobileUserMenu.classList.add('flex');

                // Show Pro Badge if applicable
                this.updateProBadge();
            } else {
                if (authButtons) authButtons.classList.remove('hidden');
                if (userMenu) userMenu.classList.add('hidden');
                if (userMenu) userMenu.classList.remove('flex');

                if (mobileAuthButtons) mobileAuthButtons.classList.remove('hidden');
                if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
                if (mobileUserMenu) mobileUserMenu.classList.remove('flex');
            }

            if (logoutBtn) {
                logoutBtn.onclick = () => DigitalCard.Core.Auth.signOut();
            }
            if (mobileLogoutBtn) {
                mobileLogoutBtn.onclick = () => DigitalCard.Core.Auth.signOut();
            }
        },
        updateProBadge: async function () {
            const isPro = await DigitalCard.Utils.Subscription.isPro();
            if (isPro) {
                const dashboardBtns = document.querySelectorAll('a[href="create.html"]');
                dashboardBtns.forEach(btn => {
                    if (!btn.querySelector('.pro-badge')) {
                        const badge = document.createElement('span');
                        badge.className = 'pro-badge ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-600 text-[10px] text-white rounded-md font-black italic tracking-tighter shadow-lg shadow-yellow-500/20';
                        badge.textContent = 'PRO';
                        btn.appendChild(badge);
                    }
                });
            }
        }
    };
})();
