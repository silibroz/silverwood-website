/* Silverwood booking logic: dates, guests (pax), meal plan, WhatsApp message */
(function () {
    var PHONE = '917679892404';
    var PLANS = {
        APAI: 'APAI (Breakfast, Lunch & Dinner)',
        MAPAI: 'MAPAI (Breakfast & Dinner)',
        CPAI: 'CPAI (Breakfast only)',
        EPAI: 'EPAI (Room only)'
    };

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function fmt(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
    function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

    window.initBooking = function (opts) {
        opts = opts || {};
        var $ = function (id) { return document.getElementById(id); };

        /* ---------- Dates ---------- */
        var ci = $('checkIn'), co = $('checkOut');
        var today = new Date();
        ci.min = fmt(today);
        ci.value = fmt(addDays(today, 1));
        co.value = fmt(addDays(today, 3));
        co.min = fmt(addDays(parse(ci.value), 1));
        ci.addEventListener('change', function () {
            if (!ci.value) return;
            var min = fmt(addDays(parse(ci.value), 1));
            co.min = min;
            if (!co.value || co.value < min) co.value = min;
        });

        /* ---------- Guests (pax) ---------- */
        var adults = 2, children = 0;
        var label = $('paxLabel'), panel = $('paxPanel'), toggle = $('paxToggle');

        function paxText() {
            var t = adults + (adults === 1 ? ' Adult' : ' Adults');
            if (children > 0) t += ', ' + children + (children === 1 ? ' Child' : ' Children');
            return t;
        }
        function render() {
            $('adultsVal').textContent = adults;
            $('childrenVal').textContent = children;
            label.textContent = paxText();
        }
        panel.addEventListener('click', function (e) {
            var b = e.target.closest('[data-pax]');
            if (!b) return;
            var dir = +b.getAttribute('data-dir');
            if (b.getAttribute('data-pax') === 'adults') adults = Math.min(10, Math.max(1, adults + dir));
            else children = Math.min(6, Math.max(0, children + dir));
            render();
        });
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            panel.classList.toggle('open');
        });
        $('paxDone').addEventListener('click', function () { panel.classList.remove('open'); });
        document.addEventListener('click', function (e) {
            if (!panel.contains(e.target) && !toggle.contains(e.target)) panel.classList.remove('open');
        });
        render();

        /* ---------- Room selection (property pages) ---------- */
        var roomLabel = $('selectedRoom');
        var cards = document.querySelectorAll('.room-card');
        cards.forEach(function (card) {
            var btn = card.querySelector('.select-room-btn');
            if (!btn) return;
            btn.addEventListener('click', function () {
                cards.forEach(function (c) { c.classList.remove('selected'); });
                card.classList.add('selected');
                if (roomLabel) roomLabel.textContent = card.getAttribute('data-room');
            });
        });

        /* ---------- WhatsApp ---------- */
        window.bookOnWhatsApp = function () {
            var lines = [];
            if (opts.mode === 'home') {
                var sel = $('bookingProperty');
                if (!sel.value) { alert('Please select a property.'); return; }
                lines.push("Hi Silverwood Hotels! I'd like to book a stay.", '');
                lines.push('🏨 *Property:* ' + sel.value);
            } else {
                lines.push("Hi Silverwood Hotels! I'd like to book a stay at *" + opts.property + '*.', '');
                var room = roomLabel ? roomLabel.textContent : '';
                lines.push('🏨 *Room:* ' + (room && room !== 'No room selected' ? room : 'Not selected'));
            }
            lines.push('📅 *Check-in:* ' + (ci.value || 'TBD'));
            lines.push('📅 *Check-out:* ' + (co.value || 'TBD'));
            lines.push('👥 *Guests:* ' + paxText());
            var plan = $('mealPlan').value;
            lines.push('🍽️ *Meal Plan:* ' + (plan ? PLANS[plan] : 'Not selected'));
            lines.push('', 'Kindly confirm availability. Thank you!');
            window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
        };
    };
})();
