import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material'
import './App.css';
import Map from './components/Map';
import Dashboard from './components/Dashboard';
import axios from 'axios'


function App() {
  const [year, setYear] = useState(2015)
  const [month, setMonth] = useState(8);
  const [latlng, setLatlng] = useState(null);
  const [displayCategory, setDisplayCategory] = useState('Markers')
  const [responseReceived, setResponseReceived] = useState(null)
  const [crimeCountMonth, setCrimeCountMonth] = useState(null)
  const [crimeCountYear, setCrimeCountYear] = useState(null)

  useEffect(() => {
    if (year) {
      if (displayCategory === 'Alerts') {
        console.log("API Call For ---ALERTS---")
        getAlertDetails(100)
      }
      if (displayCategory === 'Markers') {
        console.log("API Call For ---MARKERS---")
        getCrimeDetails(year, month);
      }
    }
  }, [year, month, displayCategory])

  const handleFormResponse = (e) => {
    // console.log(`SUCCESS from Form`, e.date)
    setDisplayCategory(e.category)
    setMonth(e.date.$M + 1)
    setYear(e.date.$y)
  }

  const getAlertDetails = (limit) => {
    axios.get(`https://data.boston.gov/api/3/action/datastore_search?resource_id=b973d8cb-eeb2-4e7e-99da-c92938efc9c0&q=2023-04-21&limit=${limit}`)
      .then(function (response) {
        // console.log("SUCCESS", response.data.result.records)
        setResponseReceived(response.data.result.records);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const getCrimeDetails = (year, month) => {
    axios.get(`http://127.0.0.1:5000/marker_data?year=${year}&month=${month}`)
      .then(function (response) {
        console.log("SUCCESS", response.data.total_count_of_the_month)
        setResponseReceived(response.data.crimeDetails);
        setCrimeCountMonth(response.data.total_count_of_the_month);
        setCrimeCountYear(response.data.total_count_of_year)
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  return (
    <Stack direction="row" sx={{ height: '100vh' }}>
      <Box sx={{ width: '25%', borderRight: '4px solid #3c6e71' }} display="flex" alignItems="center" justifyContent="center"> {/* Left Dashboard */}
        {/* Dashboard content goes here */}
        <Dashboard handleFormResponse={handleFormResponse}
          latlng={latlng}
          displayCategory={displayCategory}
          crimeCountMonth={crimeCountMonth}
          crimeCountYear={crimeCountYear}
        />
      </Box>
      <Box sx={{ width: '75%' }}> {/* Map */}
        <Map crimeDetails={responseReceived} displayCategory={displayCategory} year={year} setLatlng={setLatlng} />
      </Box>
    </Stack>
  );
}

export default App;
