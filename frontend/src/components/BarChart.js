import React, { useEffect, useState } from 'react';
import { Bar, Pie } from "react-chartjs-2";
import { Chart as chartjs } from "chart.js/auto"
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


const UserData = [
    {
        id: 1,
        year: 2016,
        userGain: 80000,
        userLost: 823,
    },
    {
        id: 2,
        year: 2017,
        userGain: 45677,
        userLost: 345,
    },
    {
        id: 3,
        year: 2018,
        userGain: 78888,
        userLost: 555,
    },
    {
        id: 4,
        year: 2019,
        userGain: 90000,
        userLost: 4555,
    },
    {
        id: 5,
        year: 2020,
        userGain: 4300,
        userLost: 234,
    }, {
        id: 6,
        year: 2021,
        userGain: 87000,
        userLost: 4555,
    },
    {
        id: 7,
        year: 2022,
        userGain: 43000,
        userLost: 234,
    }, {
        id: 8,
        year: 2023,
        userGain: 43000,
        userLost: 234,
    },
];

// define the latitude and longitude
const latitude = 42.23;
const longitude = -71.14;
// define the years
const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
let heatmapDataByYear;
const find_intensities = () => {
    let intensities = []
    for (const year of years) {
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

        // find the intensity for the given latitude and longitude in the current year's data
        const intensity = heatmapDataByYear.reduce((acc, [lat, lng, value]) => {
            if (lat === latitude && lng === longitude) {
                acc = value;
                console.log("Found")
            }
            return acc;
        }, null);
        intensities.push(intensity)
    }
    return intensities;
}


const BarChart = ({ latlng }) => {
    let values = find_intensities();
    console.log(values)
    const [userData, setUserData] = useState({
        // UserData.map((data) => data.year)
        labels: years,
        datasets: [{
            label: latlng,
            data: values,
            backgroundColor: [
                "#264653",
                "#287271",
                "#2A9D8F",
                "#8AB17D",
                "#E9C46A",
                "#EFB366",
                "#F4A261",
                "#EE8959",
                '#E76F51'
            ],
            borderWidth: 0,
        }]
    })
    return (
        <div style={{ width: "100%", height: "100%" }}>
            {/* <div style={{ width: "100%", height: "30%" }}>
                <Bar data={userData} />
            </div> */}
            <div style={{ width: "100%", height: "100%" }}>
                <Pie data={userData} />
            </div>
        </div>
    )
}

export default BarChart