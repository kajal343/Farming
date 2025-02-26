
// Toggle Login Form
let loginForm = document.querySelector('.login-form');
let loginBtn = document.querySelector('#login-btn');

loginBtn.onclick = () => {
    loginForm.classList.toggle('active');
};


// Close menus when scrolling
window.onscroll = () => {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
};
