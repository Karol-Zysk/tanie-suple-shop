import React from "react";

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className="flex items-stretch w-full mb-5 text-xs md:text-base">
      {[
        "Logowanie",
        "Adres Wysyłki",
        "Metody Płatności",
        "Składam Zamówienie",
      ].map((step, index) => (
        <div
          key={step}
          className={`flex items-center  border-b-2  pb-1  pl-2 md:pl-4
          text-center 
       ${
         index <= activeStep
           ? "border-blue-900   text-black-500"
           : "border-gray-400 text-gray-400"
       }
          
       `}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
