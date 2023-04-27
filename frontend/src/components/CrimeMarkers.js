import React, { useCallback, useEffect, useState } from "react";
import L from "leaflet";
import "../App.css";
import useSupercluster from "use-supercluster";
import { Marker, Popup, useMap } from "react-leaflet";
import markerIcon from '../assets/marker-icon.png'

const icons = {};
const fetchIcon = (count, size) => {
    if (!icons[count]) {
        icons[count] = L.divIcon({
            html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>`,
        });
    }
    return icons[count];
};

const normalIcon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [12, 18],
    iconAnchor: [6, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],

});

function CrimeMarkers({ crimeDetails, selectedCrime }) {
    const maxZoom = 26;
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(12);
    const map = useMap();

    // get map bounds
    function updateMap() {
        // console.log("updating");
        const b = map.getBounds();
        setBounds([
            b.getSouthWest().lng,
            b.getSouthWest().lat,
            b.getNorthEast().lng,
            b.getNorthEast().lat,
        ]);
        setZoom(map.getZoom());
    }

    const onMove = useCallback(() => {
        updateMap();
    }, [map]);

    useEffect(() => {
        updateMap();
    }, [map]);

    useEffect(() => {
        map.on("move", onMove);
        return () => {
            map.off("move", onMove);
        };
    }, [map, onMove]);

    // const points = crimeDetails.map((crime) => {
    //     return {
    //         type: "Feature",
    //         properties: { cluster: false, crimeId: crime.INCIDENT_NUMBER, category: crime.OFFENSE_DESCRIPTION },
    //         geometry: {
    //             type: "Point",
    //             coordinates: [
    //                 parseFloat(crime.Long),
    //                 parseFloat(crime.Lat),
    //             ],
    //         },
    //     }
    // });
    const points = crimeDetails
        .filter((crime) => crime.OFFENSE_DESCRIPTION === selectedCrime)
        .map((crime) => ({
            type: "Feature",
            properties: {
                cluster: false,
                crimeId: crime.INCIDENT_NUMBER,
                category: crime.OFFENSE_DESCRIPTION,
            },
            geometry: {
                type: "Point",
                coordinates: [parseFloat(crime.Long), parseFloat(crime.Lat)],
            },
        }));
    // console.log('points', points.length);

    const { clusters, supercluster } = useSupercluster({
        points: points,
        bounds: bounds,
        zoom: zoom,
        options: { radius: 75, maxZoom: 17 },
    });

    // console.log(clusters.length);

    return (
        <>
            {clusters.map((cluster) => {
                // every cluster point has coordinates
                const [longitude, latitude] = cluster.geometry.coordinates;
                // the point may be either a cluster or a crime point
                const { cluster: isCluster, point_count: pointCount } =
                    cluster.properties;

                // we have a cluster to render
                if (isCluster) {
                    return (
                        <Marker
                            key={`cluster-${cluster.id}`}
                            position={[latitude, longitude]}
                            icon={fetchIcon(
                                pointCount,
                                10 + (pointCount / points.length) * 40
                            )}
                            eventHandlers={{
                                click: () => {
                                    const expansionZoom = Math.min(
                                        supercluster.getClusterExpansionZoom(cluster.id),
                                        maxZoom
                                    );
                                    map.setView([latitude, longitude], expansionZoom, {
                                        animate: true,
                                    });
                                },
                            }}
                        />
                    );
                }

                // we have a single point (crime) to render
                return (
                    <Marker
                        key={`crime-${cluster.properties.crimeId}`}
                        position={[latitude, longitude]}
                        icon={normalIcon}
                    >
                        <Popup>
                            {cluster.properties.category} <br /> <span style={{ color: 'grey', fontSize: '9px' }}>{clusters.crimeId}</span>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default CrimeMarkers;