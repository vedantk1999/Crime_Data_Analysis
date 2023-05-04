import React, { useState, useEffect } from "react";
import "../App.css"
import { MapContainer, TileLayer } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import warningIcon from '../assets/warning-icon.png'
import MapSwitch from "./MapSwitch";
import CrimeAlerts from "./CrimeAlerts";
import CrimeMarkers from './CrimeMarkers';
import CrimeHeatmaps from "./CrimeHeatmaps";

const dangerIcon = new L.Icon({
    iconUrl: warningIcon,
    iconSize: [30, 30],
    iconAnchor: [6, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],

});


function Map({ crimeDetails, displayCategory, year, setLatlng }) {
    const [backGroundMode, setBackGroundMode] = useState(true)
    const [selectedCrime, setSelectedCrime] = useState("INVESTIGATE PERSON")
    const [zoom, setZoom] = useState(15)
    function ClickComponent() {
        const map = useMapEvents({
            click: (e) => {
                console.log(e.latlng)
                setLatlng(e.latlng)
            },
            locationfound: (location) => {
                console.log('location found:', location)
            },
        })
        return null
    }
    // console.log(crimeDetails ? crimeDetails.length : '')
    console.log(selectedCrime)


    const mode = backGroundMode ? 'dark_all' : 'light_all'
    const tileUrl = `https://{s}.basemaps.cartocdn.com/${mode}/{z}/{x}/{y}{r}.png`
    //marker 15
    //alert 13
    //heatmap 14
    //analyze 13

    useEffect(() => {
        if (displayCategory === 'Markers')
            setZoom(15)
        if (displayCategory === 'Alerts')
            setZoom(13)
        if (displayCategory === 'Heatmaps')
            setZoom(11)
        if (displayCategory === 'Analyze')
            setZoom(14)
    }, [displayCategory])

    return (
        <MapContainer center={[42.3601, -71.0589]} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}
            key={Math.random()}>
            {displayCategory === 'Heatmaps' ? <CrimeHeatmaps year={year} /> : ''}
            <TileLayer
                url={tileUrl}
            />
            {displayCategory === 'Analyze' ? <ClickComponent /> : ''}
            <MapSwitch
                checked={backGroundMode}
                onChange={() => {
                    setBackGroundMode(!backGroundMode)
                    console.log(backGroundMode)
                }}
                selectedCrime={selectedCrime}
                setSelectedCrime={setSelectedCrime}
                displayCategory={displayCategory}
            />
            {displayCategory === 'Alerts' ? <CrimeAlerts crimeDetails={crimeDetails} dangerIcon={dangerIcon} /> : ""}
            {displayCategory === 'Markers' && crimeDetails !== null ?
                <CrimeMarkers crimeDetails={crimeDetails} selectedCrime={selectedCrime} />
                : ''}
            {/* {displayCategory === 'Heatmaps' ? <CrimeHeatmaps /> : ''} */}
        </MapContainer>

    );
}


export default Map;