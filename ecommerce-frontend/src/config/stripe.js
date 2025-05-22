const stripePromise = () => Promise.resolve({
  elements: () => ({
    create: (type) => ({
      mount: (element) => {
        const mockCard = document.createElement('div');
        mockCard.className = 'mock-card-form';
        
        const cardNumber = document.createElement('div');
        cardNumber.className = 'mock-card-field';
        cardNumber.innerHTML = `
          <label>Card Number</label>
          <input type="text" placeholder="4242 4242 4242 4242" />
        `;
        
        const expiration = document.createElement('div');
        expiration.className = 'mock-card-field';
        expiration.innerHTML = `
          <label>Expiration</label>
          <input type="text" placeholder="MM/YY" />
        `;
        
        const cvc = document.createElement('div');
        cvc.className = 'mock-card-field';
        cvc.innerHTML = `
          <label>CVC</label>
          <input type="text" placeholder="CVC" />
        `;
        
        mockCard.appendChild(cardNumber);
        mockCard.appendChild(expiration);
        mockCard.appendChild(cvc);
        element.appendChild(mockCard);
      },
      
      validate: () => {
        const inputs = element.querySelectorAll('input');
        return Array.from(inputs).every(input => input.value.trim() !== '');
      }
    })
  })
});

export default stripePromise;
