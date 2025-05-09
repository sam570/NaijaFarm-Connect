// Get the total amount from localStorage
const totalAmount = localStorage.getItem('checkout_total') || 0;
document.getElementById('checkout-total').textContent = totalAmount;

// Paystack payment function
document.getElementById('paystack-button').addEventListener('click', function() {
    const handler = PaystackPop.setup({
        key: 'pk_test_a5b4097b03437cbeefce5e90a2e0b2589db478a3', 
        email: 'customer@example.com', // Replace with the customer's email
        amount: totalAmount * 100, // Amount is in kobo
        currency: "NGN", // Currency
        callback: function(response) {
            // Payment successful
            alert('Payment successful! Reference: ' + response.reference);
            // Clear the cart and redirect to home
            localStorage.removeItem('naijafarm_cart');
            localStorage.removeItem('checkout_total');
            window.location.href = 'index.html';
        },
        onClose: function() {
            alert('Transaction was not completed, window closed.');
        }
    });
    handler.openIframe();
});