/* =========================================================
   KRISHNA CONSTRUCTION — CONTACT PAGE JAVASCRIPT
   js/contact.js  |  Loaded only on contact.html
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    const form       = document.getElementById('contact-form');
    const submitBtn  = document.getElementById('submit-btn');
    const btnText    = document.getElementById('btn-text');
    const btnIcon    = document.getElementById('btn-icon');
    const successBox = document.getElementById('form-success');
    const errorBox   = document.getElementById('form-error');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic browser validation
        if (!form.checkValidity()) { form.reportValidity(); return; }

        // ── Loading state ──────────────────────────────────
        submitBtn.disabled     = true;
        submitBtn.style.opacity = '0.75';
        btnText.textContent    = 'Sending…';
        // Swap icon to spinner
        btnIcon?.setAttribute('data-lucide', 'loader-2');
        if (window.reinitIcons) window.reinitIcons();

        // Submit straight to Web3Forms, which emails the submission to
        // contact@thekrishnaconstruction.com server-side — no mail client
        // or extra step needed on the visitor's end.
        const readableSelect = (name) => {
            const select = form.elements[name];
            const opt = select?.selectedOptions?.[0];
            return opt && !opt.disabled ? opt.text : '';
        };

        const formData = new FormData(form);
        formData.append('access_key', '5a3dc5f1-3407-458d-9a72-313464e5be7e');
        formData.append('subject', `Website Enquiry from ${formData.get('name') || 'Website Visitor'}`);
        formData.set('query_type', readableSelect('query_type'));
        formData.set('department', readableSelect('department'));
        formData.set('project_value', readableSelect('project_value'));

        let ok = false;
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            });
            const result = await res.json();
            ok = res.ok && result.success;
        } catch (err) {
            ok = false;
        }

        if (ok) {
            // ── Success ────────────────────────────────────
            submitBtn.style.display = 'none';
            successBox?.classList.remove('hidden');
            successBox?.classList.add('flex');
            form.reset();
            if (window.reinitIcons) window.reinitIcons();

            setTimeout(() => {
                successBox?.classList.add('hidden');
                successBox?.classList.remove('flex');
                submitBtn.style.display  = 'flex';
                submitBtn.style.opacity  = '1';
                submitBtn.disabled       = false;
                btnText.textContent      = 'Send Message';
                btnIcon?.setAttribute('data-lucide', 'send');
                if (window.reinitIcons) window.reinitIcons();
            }, 6000);

        } else {
            // ── Error ──────────────────────────────────────
            errorBox?.classList.remove('hidden');
            errorBox?.classList.add('flex');
            submitBtn.disabled       = false;
            submitBtn.style.opacity  = '1';
            btnText.textContent      = 'Send Message';
            btnIcon?.setAttribute('data-lucide', 'send');
            if (window.reinitIcons) window.reinitIcons();

            setTimeout(() => {
                errorBox?.classList.add('hidden');
                errorBox?.classList.remove('flex');
            }, 5000);
        }
    });

});
