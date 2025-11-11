import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export const useLocationService = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  
  const [loadingStates, setLoadingStates] = useState({
    states: false,
    districts: false,
    talukas: false,
    villages: false,
    zipcode: false
  });

  const [showStateList, setShowStateList] = useState(false);
  const [showDistrictList, setShowDistrictList] = useState(false);
  const [showTalukaList, setShowTalukaList] = useState(false);
  const [showVillageList, setShowVillageList] = useState(false);

  const [dropdownLayouts, setDropdownLayouts] = useState({
    state: { x: 0, y: 0, width: 0, height: 0 },
    district: { x: 0, y: 0, width: 0, height: 0 },
    taluka: { x: 0, y: 0, width: 0, height: 0 },
    village: { x: 0, y: 0, width: 0, height: 0 }
  });

  const API_BASE_URL = 'https://gramjob.walstarmedia.com/api';

  // Fetch all states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, states: true }));
      const response = await fetch(`${API_BASE_URL}/state`, {
        method: 'GET'
      });

      if (!response.ok) throw new Error('Failed to fetch states');
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error('Error fetching states:', error);
      Alert.alert('Error', 'Failed to load states. Please try again.');
      // Fallback mock data
      const mockStates = [
        { id: 1, state: 'Maharashtra' },
        { id: 2, state: 'Gujarat' },
        { id: 3, state: 'Karnataka' },
      ];
      setStates(mockStates);
    } finally {
      setLoadingStates(prev => ({ ...prev, states: false }));
    }
  };

  const fetchDistricts = async (stateId) => {
    if (!stateId) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, districts: true }));
      const response = await fetch(`${API_BASE_URL}/district/${stateId}`, {
        method: 'GET'
      });

      if (!response.ok) throw new Error('Failed to fetch districts');
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      Alert.alert('Error', 'Failed to load districts. Please try again.');
      // Fallback mock data
      const mockDistricts = [
        { id: 1, district: 'Pune', state_id: 1 },
        { id: 2, district: 'Mumbai', state_id: 1 },
      ].filter(district => district.state_id === parseInt(stateId));
      setDistricts(mockDistricts);
    } finally {
      setLoadingStates(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchTalukas = async (districtId) => {
    if (!districtId) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, talukas: true }));
      const response = await fetch(`${API_BASE_URL}/taluka/${districtId}`, {
        method: 'GET'
      });

      if (!response.ok) throw new Error('Failed to fetch talukas');
      const data = await response.json();
      setTalukas(data);
    } catch (error) {
      console.error('Error fetching talukas:', error);
      Alert.alert('Error', 'Failed to load talukas. Please try again.');
      // Fallback mock data
      const mockTalukas = [
        { id: 1, taluka: 'Haveli', district_id: 1 },
        { id: 2, taluka: 'Mulshi', district_id: 1 },
      ].filter(taluka => taluka.district_id === parseInt(districtId));
      setTalukas(mockTalukas);
    } finally {
      setLoadingStates(prev => ({ ...prev, talukas: false }));
    }
  };

  const fetchVillages = async (talukaId) => {
    if (!talukaId) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, villages: true }));
      const response = await fetch(`${API_BASE_URL}/village/${talukaId}`, {
        method: 'GET'
      });

      if (!response.ok) throw new Error('Failed to fetch villages');
      const data = await response.json();
      setVillages(data);
    } catch (error) {
      console.error('Error fetching villages:', error);
      Alert.alert('Error', 'Failed to load villages. Please try again.');
      // Fallback mock data
      const mockVillages = [
        { id: 1, village: 'Village A', taluka_id: 1 },
        { id: 2, village: 'Village B', taluka_id: 1 },
      ].filter(village => village.taluka_id === parseInt(talukaId));
      setVillages(mockVillages);
    } finally {
      setLoadingStates(prev => ({ ...prev, villages: false }));
    }
  };

  const fetchZipcode = async (villageId) => {
    if (!villageId) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, zipcode: true }));
      const response = await fetch(`${API_BASE_URL}/zipcode/${villageId}`, {
        method: 'GET'
      });

      if (!response.ok) throw new Error('Failed to fetch zipcode');
      const data = await response.json();
      
      if (data.zipcode || data.pincode) {
        return data.zipcode || data.pincode;
      }
    } catch (error) {
      console.error('Error fetching zipcode:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, zipcode: false }));
    }
  };

  const handleLocationChange = async (field, value, setFormData) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'state_id') {
      fetchDistricts(value);
      setFormData(prev => ({ 
        ...prev, 
        district_id: '', 
        taluka_id: '', 
        village_id: '',
        zipcode: '' 
      }));
      setDistricts([]);
      setTalukas([]);
      setVillages([]);
    } else if (field === 'district_id') {
      fetchTalukas(value);
      setFormData(prev => ({ 
        ...prev, 
        taluka_id: '', 
        village_id: '',
        zipcode: '' 
      }));
      setTalukas([]);
      setVillages([]);
    } else if (field === 'taluka_id') {
      fetchVillages(value);
      setFormData(prev => ({ 
        ...prev, 
        village_id: '',
        zipcode: '' 
      }));
      setVillages([]);
    } else if (field === 'village_id') {
      const zipcode = await fetchZipcode(value);
      if (zipcode) {
        setFormData(prev => ({ ...prev, zipcode }));
      }
    }
  };

  const toggleDropdown = (type, show) => {
    // Close all other dropdowns
    setShowStateList(false);
    setShowDistrictList(false);
    setShowTalukaList(false);
    setShowVillageList(false);

    // Open the selected dropdown
    switch (type) {
      case 'state':
        setShowStateList(show);
        break;
      case 'district':
        setShowDistrictList(show);
        break;
      case 'taluka':
        setShowTalukaList(show);
        break;
      case 'village':
        setShowVillageList(show);
        break;
    }
  };

  const measureDropdown = (type, event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setDropdownLayouts(prev => ({
      ...prev,
      [type]: { x, y, width, height }
    }));
  };

  const getSelectedName = (type, id) => {
    if (!id) return '';
    
    let data = [];
    switch (type) {
      case 'state': data = states; break;
      case 'district': data = districts; break;
      case 'taluka': data = talukas; break;
      case 'village': data = villages; break;
    }
    
    const item = data.find(item => item.id === parseInt(id));
    
    switch (type) {
      case 'state': return item ? item.state : '';
      case 'district': return item ? item.district : '';
      case 'taluka': return item ? item.taluka : '';
      case 'village': return item ? item.village : '';
      default: return item ? item.name : '';
    }
  };

  return {
    states,
    districts,
    talukas,
    villages,
    loadingStates,
    showStateList,
    showDistrictList,
    showTalukaList,
    showVillageList,
    fetchDistricts,
    fetchTalukas,
    fetchVillages,
    fetchZipcode,
    handleLocationChange,
    toggleDropdown,
    measureDropdown,
    getSelectedName,
  };
};