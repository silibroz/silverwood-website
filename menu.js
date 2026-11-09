/* Mobile hamburger menu - works on every page */
(function () {
    var css = document.createElement('style');
    css.textContent =
        '.navbar{position:relative}' +
        '.mobile-menu{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent}' +
        '@media(max-width:768px){' +
        '  nav.open{display:flex !important;flex-direction:column;align-items:stretch;' +
        '    position:absolute;top:100%;left:0;right:0;background:#0a0a0a;' +
        '    border-top:2px solid #c27935;box-shadow:0 20px 40px rgba(0,0,0,0.5);z-index:3000}' +
        '  nav.open a{margin:0;padding:18px 7%;color:#fff;font-size:13px;letter-spacing:2px;' +
        '    border-bottom:1px solid rgba(255,255,255,0.08)}' +
        '  nav.open a:last-child{border-bottom:none}' +
        '  nav.open a:hover{color:#c27935}' +
        '}';
    document.head.appendChild(css);

    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.querySelector('.mobile-menu');
        var nav = document.querySelector('.navbar nav');
        if (!btn || !nav) return;

        function setOpen(open) {
            nav.classList.toggle('open', open);
            btn.textContent = open ? '✕' : '☰';
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            setOpen(!nav.classList.contains('open'));
        });
        nav.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') setOpen(false);
        });
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target)) setOpen(false);
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) setOpen(false);
        });
    });
})();
