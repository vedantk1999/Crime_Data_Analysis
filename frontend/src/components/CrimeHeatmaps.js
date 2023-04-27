import React, { useEffect, useState } from 'react';
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import {
    heatmapData2015,
    heatmapData2016,
    heatmapData2017,
    heatmapData2018,
    heatmapData2019,
    heatmapData2020,
    heatmapData2021,
    heatmapData2022,
    heatmapData2023
} from '../assets/heatmapData';


const CrimeHeatmaps = ({ year }) => {
    const [data, setData] = useState([]);
    const heatmapOptions = {
        radius: 20,
        blur: 20,
        maxZoom: 23,
        minOpacity: 0.5,
        maxOpacity: 1
    };

    useEffect(() => {
        let heatmapDataByYear;
        console.log("Inside Useffect")
        switch (year) {
            case 2015:
                heatmapDataByYear = heatmapData2015;
                break;
            case 2016:
                heatmapDataByYear = heatmapData2016;
                break;
            case 2017:
                heatmapDataByYear = heatmapData2017;
                break;
            case 2018:
                heatmapDataByYear = heatmapData2018;
                break;
            case 2019:
                heatmapDataByYear = heatmapData2019;
                break;
            case 2020:
                heatmapDataByYear = heatmapData2020;
                break;
            case 2021:
                heatmapDataByYear = heatmapData2021;
                break;
            case 2022:
                heatmapDataByYear = heatmapData2022;
                break;
            case 2023:
                heatmapDataByYear = heatmapData2023;
                break;
            default:
                heatmapDataByYear = heatmapData2023; // set default value
        }
        setData(heatmapDataByYear);
    }, [year]);
    return (
        <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={data}
            longitudeExtractor={(point) => point[1]}
            latitudeExtractor={(point) => point[0]}
            key={Math.random() + Math.random()}
            intensityExtractor={(point) => parseFloat(point[2])}
            {...heatmapOptions}
        />
    )
}

export default CrimeHeatmaps