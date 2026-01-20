(function () {
    DigitalCard.UI.CardRenderer = {
        init: function () {
            this.bindInputs();
            this.bindThemeToggles();
            this.loadInitialData();
            this.bindActionButtons();
            this.updateProUI();
        },
        updateProUI: async function () {
            if (await DigitalCard.Utils.Subscription.isPro()) {
                const locks = document.querySelectorAll('.fa-lock');
                locks.forEach(lock => lock.classList.add('hidden'));
            }
        },
        bindInputs: function () {
            const mappings = {
                'input-name': 'preview-name',
                'input-job': 'preview-job',
                'input-company': 'preview-company',
                'input-phone': 'preview-phone',
                'input-email': 'preview-email',
                'input-website': 'preview-website',
                'input-address': 'preview-address'
            };

            for (const [inputId, previewId] of Object.entries(mappings)) {
                const input = document.getElementById(inputId);
                const preview = document.getElementById(previewId);
                if (input && preview) {
                    input.addEventListener('input', (e) => {
                        if (!e.target.value) {
                            preview.textContent = '';
                        } else {
                            preview.textContent = e.target.value;
                        }
                    });
                }
            }

            const bgColorInput = document.getElementById('input-bg-color');
            if (bgColorInput) {
                bgColorInput.addEventListener('input', (e) => {
                    const card = document.getElementById('visiting-card');
                    if (card) {
                        card.style.background = e.target.value;
                        // Clear theme dataset if custom color is used, or handle coexistence
                        // for now let's just set the style.
                        card.dataset.theme = 'custom';
                    }
                });
            }
        },
        bindThemeToggles: function () {
            const buttons = document.querySelectorAll('button[data-theme]');
            const card = document.getElementById('visiting-card');

            buttons.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const theme = btn.dataset.theme;
                    const isPremium = ['sunset', 'emerald', 'midnight'].includes(theme);

                    if (isPremium && !(await DigitalCard.Utils.Subscription.isPro())) {
                        DigitalCard.Utils.Subscription.showPremiumPrompt();
                        return;
                    }

                    card.dataset.theme = theme;
                    buttons.forEach(b => b.classList.remove('ring-offset-premium-dark', 'ring-2', 'ring-white', 'ring-offset-8'));
                    btn.classList.add('ring-offset-premium-dark', 'ring-2', 'ring-white', 'ring-offset-8');
                });
            });

            const bgImageInput = document.getElementById('input-bg-image');
            if (bgImageInput) {
                bgImageInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const card = document.getElementById('visiting-card');
                            if (card) {
                                card.style.background = `url(${event.target.result}) center center / cover no-repeat`;
                                card.dataset.theme = 'custom';
                                card.dataset.bgImage = event.target.result;
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        },
        loadInitialData: async function () {
            const { data: card, error } = await DigitalCard.Core.Database.getMyCard();
            if (card) {
                const setVal = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) el.value = val || '';
                }

                setVal('input-name', card.name);
                setVal('input-job', card.job);
                setVal('input-company', card.company);
                setVal('input-email', card.email);
                setVal('input-phone', card.phone);
                setVal('input-website', card.website);
                setVal('input-address', card.address);
                if (card.custom_bg_color) {
                    setVal('input-bg-color', card.custom_bg_color);
                    const cardEl = document.getElementById('visiting-card');
                    if (cardEl) {
                        cardEl.style.background = card.custom_bg_color;
                        cardEl.dataset.theme = 'custom';
                    }
                }
                if (card.background_image) {
                    const cardEl = document.getElementById('visiting-card');
                    if (cardEl) {
                        cardEl.style.background = `url(${card.background_image}) center center / cover no-repeat`;
                        cardEl.dataset.theme = 'custom';
                        cardEl.dataset.bgImage = card.background_image;
                    }
                }

                const inputs = document.querySelectorAll('input');
                inputs.forEach(input => input.dispatchEvent(new Event('input')));
            }
        },
        bindActionButtons: function () {
            const saveBtn = document.getElementById('save-card');
            if (saveBtn) {
                saveBtn.addEventListener('click', async () => {
                    const saveIcon = saveBtn.querySelector('i');
                    const originalIconClass = saveIcon.className;
                    saveIcon.className = 'fas fa-spinner fa-spin';

                    const cardData = {
                        name: document.getElementById('input-name').value,
                        job: document.getElementById('input-job').value,
                        company: document.getElementById('input-company').value,
                        email: document.getElementById('input-email').value,
                        phone: document.getElementById('input-phone').value,
                        website: document.getElementById('input-website').value,
                        address: document.getElementById('input-address').value,
                        theme: document.getElementById('visiting-card').dataset.theme || 'default',
                        theme: document.getElementById('visiting-card').dataset.theme || 'default',
                        custom_bg_color: document.getElementById('input-bg-color').value,
                        background_image: document.getElementById('visiting-card').dataset.bgImage || null
                    };

                    const { error } = await DigitalCard.Core.Database.saveCard(cardData);

                    saveIcon.className = originalIconClass;

                    if (error) {
                        alert('Error saving card: ' + error.message);
                    } else {
                        alert('Card saved successfully!');
                    }
                });
            }
        }
    };
})();
