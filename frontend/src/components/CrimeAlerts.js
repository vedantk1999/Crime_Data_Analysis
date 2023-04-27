import React from 'react';
import { Marker, Popup } from 'react-leaflet';

const CrimeAlerts = ({ crimeDetails, dangerIcon }) => {
    const displayingAlerts = (
        (crimeDetails !== null) ?
            crimeDetails.map((crime) => {
                if (!crime.Lat || !crime.Long)
                    return
                return (
                    <Marker position={[crime.Lat, crime.Long]} icon={dangerIcon}>
                        <Popup>
                            {crime.OFFENSE_DESCRIPTION} <br /> <span style={{ color: 'grey', fontSize: '9px' }}>{crime.OCCURRED_ON_DATE}</span>
                        </Popup>
                    </Marker>
                );
            })
            :
            <Marker position={[42.36, -71.05]} icon={dangerIcon}>
                <Popup>
                    crime.OFFENSE_DESCRIPTION
                </Popup>
            </Marker>

    );
    return (
        <div>

            {displayingAlerts}
        </div>
    )
}

export default CrimeAlerts