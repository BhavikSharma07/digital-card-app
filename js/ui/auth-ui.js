(function () {
    DigitalCard.UI.AuthUI = {
        init: function () {
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');

            if (loginForm) {
                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    const btn = loginForm.querySelector('button[type="submit"]');
                    const originalText = btn.textContent;

                    btn.textContent = 'Signing In...';
                    btn.disabled = true;

                    const { data, error } = await DigitalCard.Core.Auth.signIn(email, password);

                    if (error) {
                        alert(error.message);
                        btn.textContent = originalText;
                        btn.disabled = false;
                    } else {
                        window.location.href = 'create.html';
                    }
                });
            }

            if (registerForm) {
                registerForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    const fullName = document.getElementById('fullname') ? document.getElementById('fullname').value : '';
                    const phone = document.getElementById('phone') ? document.getElementById('phone').value : '';

                    const btn = registerForm.querySelector('button[type="submit"]');
                    const originalText = btn.textContent;

                    btn.textContent = 'Creating Account...';
                    btn.disabled = true;

                    const { data, error } = await DigitalCard.Core.Auth.signUp(email, password, { full_name: fullName, phone });
                    if (error) {
                        alert(error.message);
                        btn.textContent = originalText;
                        btn.disabled = false;
                    } else {
                        alert('Account created! Please check your email for verification link.');
                        window.location.href = 'login.html';
                    }
                });
            }
        }
    };
})();
