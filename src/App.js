import React, { useState } from 'react';
import ItemForm from './components/ItemForm';
import ServiceSearch from './components/ServiceSearch';

function App() {
  const [calculationDetails, setCalculationDetails] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [notification, setNotification] = useState('');

  const calculateWeightedSum = (pairsArray, includeHardware, includeSoftware) => {
    let newTotalSum = 0;
    let details = pairsArray.map(({ number, quantity }) => {
      let markedUpNumber = number < 50 ? number * 2 : number * 1.3;
      const total = markedUpNumber * quantity;
      newTotalSum += total;
      return {
        detail: `${number !== markedUpNumber ? `${number} marked up to ${markedUpNumber.toFixed(2)}` : number} (quantity: ${quantity}) = ${total.toFixed(2)}`,
        total: total.toFixed(2)
      };
    });

    // Adding labor costs if the checkboxes are selected
    if (includeHardware) {
      const hardwareCost = 129.90;
      const lastItem = details[details.length - 1];
      const newTotal = parseFloat(lastItem.total) + hardwareCost;
      lastItem.detail += ` + Hardware Labor ($129.90)`;
      lastItem.total = newTotal.toFixed(2);
      newTotalSum += hardwareCost;
    }

    if (includeSoftware) {
      const softwareCost = 120;
      const lastItem = details[details.length - 1];
      const newTotal = parseFloat(lastItem.total) + softwareCost;
      lastItem.detail += ` + Software Labor ($120.00)`;
      lastItem.total = newTotal.toFixed(2);
      newTotalSum += softwareCost;
    }

    setCalculationDetails(details);
    setTotalSum(`$${newTotalSum.toFixed(2)}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setNotification('Copied to clipboard!');
      setTimeout(() => setNotification(''), 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="App">
      <div className="card">
        <h1 className="text-3xl font-semibold mb-6">Number & Quantity Sum Calculator</h1>
        <div className="container">
          <ItemForm onCalculateWeightedSum={calculateWeightedSum} />
          <ServiceSearch />
        </div>
      </div>
      <div className="calculation-details mt-8 container">
        <h2 className="text-2xl font-semibold mb-4">Calculation Details:</h2>
        {notification && <p className="text-green-500 mb-4">{notification}</p>}
        <div className="details-list">
          {calculationDetails.map((item, index) => (
            <div key={index} className="detail-item mb-2">
              <p className="text-gray-800">{item.detail}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
                onClick={() => copyToClipboard(item.total)}>
                Copy ${item.total}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xl text-green-500 mt-4">Total Weighted Sum: {totalSum}</p>
      </div>
    </div>
  );
}

export default App;
