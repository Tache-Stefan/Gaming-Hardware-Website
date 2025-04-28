document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.getElementById('theme-switch');
    const themeIcon = document.getElementById('theme-icon');

    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
        themeIcon.classList.remove('fas', 'fa-sun');
        themeIcon.classList.add('fas', 'fa-moon');
    } else {
        document.body.setAttribute('data-theme', 'light');
        themeSwitch.checked = false;
        themeIcon.classList.remove('fas', 'fa-moon');
        themeIcon.classList.add('fas', 'fa-sun');
    }

    themeSwitch.addEventListener('change', function() {
        if (themeSwitch.checked) {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fas', 'fa-sun');
            themeIcon.classList.add('fas', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fas', 'fa-moon');
            themeIcon.classList.add('fas', 'fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });
});
