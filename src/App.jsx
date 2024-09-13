import React, { useState } from 'react';
import ItemForm from './components/ItemForm';
import ServiceSearch from './components/ServiceSearch';

function App() {
  const [calculationDetails, setCalculationDetails] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [notification, setNotification] = useState('');

  // Function to calculate the weighted sum
  const calculateWeightedSum = (pairsArray, includeHardware, hardwareHours, includeSoftware, softwareHours) => {
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

    if (includeHardware) {
      const hardwareCost = 129.90 * hardwareHours;
      newTotalSum += hardwareCost;
      details.push({
        detail: `Hardware Labor (${hardwareHours} hr${hardwareHours > 1 ? 's' : ''} @ $129.90/hr) = $${hardwareCost.toFixed(2)}`,
        total: hardwareCost.toFixed(2)
      });
    }

    if (includeSoftware) { 
      const softwareCost = 120 * softwareHours;
      newTotalSum += softwareCost;
      details.push({
        detail: `Software Labor (${softwareHours} hr${softwareHours > 1 ? 's' : ''} @ $120.00/hr) = $${softwareCost.toFixed(2)}`,
        total: softwareCost.toFixed(2)
      });
    }

    setCalculationDetails(details);
    setTotalSum(`$${newTotalSum.toFixed(2)}`);
  };

  // Add item handler
  const addItemHandler = () => {
    const newItem = { number: 19.59, quantity: 1 }; // Example item
    calculateWeightedSum([newItem], false, 0, false, 0);
    setNotification('Item added successfully!');
    setTimeout(() => setNotification(''), 3000);
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
    <div className="App bg-gray-800 min-h-screen text-white">
      <div className="layout-container flex flex-wrap justify-between w-full p-6">
        {/* Calculation Details Section */}
        <div className="calculation-container bg-gray-900 p-6 rounded-lg shadow-lg w-full sm:w-1/4 mb-6">
          <h2 className="text-2xl font-bold mb-4">Calculation Details:</h2>
          {notification && <p className="text-green-500 mb-4">{notification}</p>}
          <div className="details-list max-h-48 overflow-y-auto">
            {calculationDetails.map((item, index) => (
              <div key={index} className="detail-item mb-2">
                <p className="text-gray-300">{item.detail}</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mt-2"
                  onClick={() => copyToClipboard(item.total)}
                >
                  Copy ${item.total}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xl text-green-400 mt-4">Total Weighted Sum: {totalSum}</p>
        </div>

        {/* Main Content */}
        <div className="main-content flex-grow w-full sm:w-3/4 bg-gray-800 p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-6">Number & Quantity Sum Calculator</h1>
          
          {/* Form and Add Item Button */}
          <div className="form-container space-y-4">
            <ItemForm onCalculateWeightedSum={calculateWeightedSum} />
            <ServiceSearch />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                onClick={addItemHandler} // Add item button functionality
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Calculate Button at the bottom */}
          <div className="flex justify-center mt-8">
            <button
              className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
              onClick={() => calculateWeightedSum([], false, 0, false, 0)} // Calculate button functionality
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
