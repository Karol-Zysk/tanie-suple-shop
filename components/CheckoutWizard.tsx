import React from 'react';

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className="flex flex-wrap mb-5">
      {['Logowanie', 'Adres Wysyłki', 'Metody Płatności', 'Składam Zamówienie'].map(
        (step, index) => (
          <div
            key={step}
            className={`flex-1 border-b-2  
          text-center 
       ${
         index <= activeStep
           ? 'border-indigo-500   text-indigo-500'
           : 'border-gray-400 text-gray-400'
       }
          
       `}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
}