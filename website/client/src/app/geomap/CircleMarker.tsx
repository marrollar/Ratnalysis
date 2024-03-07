import React from 'react';
import { Circle } from '@react-google-maps/api';

const CircleMarker = ({ center, radius }) => {
    return (
        <Circle
            center={center}
            radius={radius}
            options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                clickable: false,
                draggable: false,
                editable: false,
                visible: true
            }}
        />
    );
}

export default CircleMarker;