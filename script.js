document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const resultDiv = document.getElementById('result');
    const submitBtn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // إظهار حالة التحميل
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
            </span>
        `;

        try {
            const formData = new FormData(contactForm);
            
            // إضافة تحقق إضافي للروبوتات
            formData.append('botcheck', document.getElementById('botcheck').value);

            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                resultDiv.innerHTML = `
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <strong class="font-bold">Success!</strong>
                        <span class="block sm:inline">${data.message || 'Thank you! I will contact you soon.'}</span>
                    </div>
                `;
                contactForm.reset();
            } else {
                resultDiv.innerHTML = `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong class="font-bold">Error!</strong>
                        <span class="block sm:inline">${data.message || 'Something went wrong. Please try again.'}</span>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerHTML = `
                <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                    <strong class="font-bold">Warning!</strong>
                    <span class="block sm:inline">Your message might have been sent. If you don't hear back, please try emailing directly.</span>
                </div>
            `;
        } finally {
            resultDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span class="flex items-center justify-center gap-2">
                    Submit now
                    <img src="./images/right-arrow-white.png" alt="" class="w-4">
                </span>
            `;
            
            // إخفاء الرسالة بعد 5 ثواني
            setTimeout(() => {
                resultDiv.classList.add('hidden');
            }, 5000);
        }
    });
});
function validateForm() {
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    if (!name || !email || !message) {
        alert('Please fill all fields');
        return false;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        alert('Please enter a valid email');
        return false;
    }

    return true;
}