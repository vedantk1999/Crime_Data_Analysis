import React, { useEffect, useState } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select, Button, TextField, Typography } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import BarChart from './BarChart';
import Loader from './Loader';



const Dashboard = ({ handleFormResponse, latlng, displayCategory, crimeCountMonth, crimeCountYear }) => {
    const [selectedCategory, setSelectedCategory] = useState('Markers');
    const minDate = dayjs('2015-08-01');
    const maxDate = dayjs('2023-05-01');
    const [selectedDate, setSelectedDate] = useState(minDate);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null)

    useEffect(() => {
        if (latlng !== null) {

            setLatitude(parseFloat(latlng.lat.toFixed(2)));
            setLongitude(parseFloat(latlng.lng.toFixed(2)));
        }
    }, [latlng])

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleRefresh = () => {
        const formData = {
            category: selectedCategory,
            date: selectedDate,
        };
        handleFormResponse(formData);
    };

    return (
        <Box
            height="100vh"
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={0}
        >
            <Typography mt={0} mb={3} variant='h5' fontWeight={600}>Boston Crimes</Typography>
            <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FormControl variant="outlined" margin="dense" style={{ width: '100%' }} >
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select labelId="category-label" id="category" label="Category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                        <MenuItem value="Markers">Markers</MenuItem>
                        <MenuItem value="Heatmaps">Heatmaps</MenuItem>
                        <MenuItem value="Alerts">Alerts</MenuItem>
                        <MenuItem value="Analyze">Analyze </MenuItem>
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: '100%' }}>
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        views={selectedCategory === 'Markers' ? ['year', 'month'] : ['year']}
                        minDate={minDate}
                        maxDate={maxDate}
                        label={selectedCategory === 'Markers' ? "Month-Year" : "Year"}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Box display="flex" justifyContent="center" marginTop={2} mb={2}>
                    <Button variant="contained" color="primary" onClick={handleRefresh} >
                        Refresh
                    </Button>
                </Box>
            </form>
            <Box sx={{ height: '60%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >

                {displayCategory === 'Markers' && crimeCountMonth !== null ?
                    <Typography variant='h6'>
                        Displaying <span style={{ color: '#ff2625', textTransform: 'capitalize' }}>{crimeCountMonth}</span> crimes out of {crimeCountYear}
                    </Typography>
                    :
                    displayCategory === 'Markers' && crimeCountMonth === null ?
                        <>
                            <Loader />
                            <Typography variant='h6'>
                                More than <span style={{ color: '#ff2625', textTransform: 'capitalize' }}>650k</span> crimes have taken place<br /> from 2015-2023.
                            </Typography>
                        </>
                        :
                        ''}
                {displayCategory === 'Analyze' && latitude !== null ?
                    <BarChart lat={latitude} lng={longitude} />
                    :
                    displayCategory === 'Analyze' && latlng === null ?
                        <Typography variant='h6'>Click on the Map To analyze an Area</Typography>
                        : ''}
                {displayCategory === 'Alerts' ?
                    <Typography variant='h6'>
                        Displaying <span style={{ color: '#ff2625', textTransform: 'capitalize' }}>100</span> most recent crime.
                    </Typography>
                    : ''}
            </Box>
        </Box>
    )
}

export default Dashboard;