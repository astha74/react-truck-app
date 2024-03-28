import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    Current_Location: '',
    TRANSPORTATION_DISTANCE_IN_KM: '',
    vehicleType: '',
    Driver_MobileNo: '',
    supplierID: '', // Additional fields
    Material_Shipped: '',
    vehicle_states: '',
    Dest_states: '',
  });
  const [delay, setDelay] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);
  const [destinationLocationOptions, setDestinationLocationOptions] = useState([]);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
  const [vehicleStateOptions, setVehicleStateOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [supplierIdOptions, setSupplierIdOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const current_location = await axios.get("/data/current_location.json"); // Corrected path
        const current_location_data = Object.entries(current_location.data).map(([label, value]) => ({
          label,
          value
        }));
        setLocationOptions(current_location_data);
        const destination_location = await axios.get("/data/dest_states.json"); // Corrected path
        const destination_location_data = Object.entries(destination_location.data).map(([label, value]) => ({
          label,
          value
        }));
        setDestinationLocationOptions(destination_location_data);
        const material_shipped = await axios.get("/data/material_shipped.json"); // Corrected path
        const material_shipped_data = Object.entries(material_shipped.data).map(([label, value]) => ({
          label,
          value
        }));
        setMaterialOptions(material_shipped_data);
        const supplier = await axios.get("/data/supplierid.json"); // Corrected path
        const supplier_data = Object.entries(supplier.data).map(([label, value]) => ({
          label,
          value
        }));
        setSupplierIdOptions(supplier_data);
        const vehicle_states = await axios.get("/data/vehicle_states.json"); // Corrected path
        const vehicle_states_data = Object.entries(vehicle_states.data).map(([label, value]) => ({
          label,
          value
        }));
        setVehicleStateOptions(vehicle_states_data);
        const vehicle_type = await axios.get("/data/vehicletype.json"); // Corrected path
        const vehicle_type_data = Object.entries(vehicle_type.data).map(([label, value]) => ({
          label,
          value
        }));
        setVehicleTypeOptions(vehicle_type_data);


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/calculate-delay', formData);
      setDelay(response.data.prediction);
      setAdditionalInfo(response.data.additional_info);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h1 className="text-center mb-4">Predict Truck Delay System</h1>

      <form onSubmit={handleSubmit}>
        <label>Current Location:</label>
        <select name="Current_Location" value={formData.Current_Location} onChange={handleChange} required className="form-control">
          <option value="">Select Current Location</option>
          {locationOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <br />
        <label>End Location:</label>
        <select name="Dest_states" value={formData.Dest_states} onChange={handleChange} required>
          <option value="">Select Destination Location</option>
          {destinationLocationOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <br />
        <label>TRANSPORTATION_DISTANCE_IN_KM:</label>
        <input type="integer" name="TRANSPORTATION_DISTANCE_IN_KM" value={formData.TRANSPORTATION_DISTANCE_IN_KM} onChange={handleChange} required />
        <br />
         <label>Vehicle Type:</label>
        <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
          <option value="">Select Vehicle Type</option>
          {vehicleTypeOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <br />
        <label>Vehicle State:</label>
        <select name="vehicle_states" value={formData.vehicle_states} onChange={handleChange} required>
          <option value="">Select Vehicle State</option>
          {vehicleStateOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <br />
        <label>Driver Mobile No Available(0.0/1.0):</label>
        <select name="Driver_MobileNo" value={formData.Driver_MobileNo} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="1.0">Yes</option>
          <option value="0.0">No</option>
        </select>
        <br />
        <label>Supplier ID:</label>
        <select name="supplierID" value={formData.supplierID} onChange={handleChange} required>
          <option value="">Select Supplier</option>
          {supplierIdOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <br />
        <label>Material Shipped:</label>
        <select name="Material_Shipped" value={formData.Material_Shipped} onChange={handleChange} required>
          <option value="">Select Material Shipped</option>
          {materialOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <br />


        {/* Include inputs for other additional fields in a similar manner */}

        <button type="submit">Calculate Delay</button>
      </form>
      {delay && (
        <div>
          <h2>{delay}</h2>
          <p>{additionalInfo}</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
