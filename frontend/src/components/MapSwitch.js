import React, { useState } from 'react'
import { Switch, Select, MenuItem } from '@mui/material'


const crimeList = ['INVESTIGATE PERSON', 'SICK ASSIST', 'M/V - LEAVING SCENE - PROPERTY DAMAGE', 'INVESTIGATE PROPERTY',
    'TOWED MOTOR VEHICLE', 'ASSAULT - SIMPLE', 'VANDALISM', 'PROPERTY - LOST/ MISSING', 'LARCENY SHOPLIFTING', 'M/V ACCIDENT - PROPERTY DAMAGE', 'OTHER']

const MapSwitch = ({ checked, onChange, selectedCrime, setSelectedCrime, displayCategory, onClick }) => {
    return (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: '9999' }}>
            <Switch
                checked={checked}
                onChange={onChange}
                name="mapSwitch"
                color="default"
            />
            {displayCategory === "Markers" ?
                <Select
                    labelId="category-label"
                    id="category"
                    label="Category"
                    style={{ color: "#1976d2" }}
                    value={selectedCrime}
                    onChange={(event) => setSelectedCrime(event.target.value)}>
                    {crimeList.map((c) => (
                        <MenuItem value={c}>{c}</MenuItem>
                    ))}
                </Select> : ""}
        </div>
    )
}

export default MapSwitch