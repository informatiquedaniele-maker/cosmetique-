// payment.js – placeholder payment processing
export async function processPayment(orderData) {
  // Simulate async payment processing delay
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Payment processed (placeholder)', orderData);
      resolve({ status: 'success', orderId: Date.now() });
    }, 800);
  });
}
