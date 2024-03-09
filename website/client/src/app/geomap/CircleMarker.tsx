import React, { useState } from 'react';
import { Circle, InfoWindow } from '@react-google-maps/api';

const CircleMarker = ({ center, radius, s_id, s_name, s_somany, s_oneortwo, s_none }) => {
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ lat: null, lng: null });
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    const handleMouseOver = () => {
        setIsMouseOver(true);
    };

    const handleMouseOut = () => {
        setIsMouseOver(false);
        setIsTextBoxVisible(false);
        setMousePosition({ lat: null, lng: null })
        setShowMoreDetails(false)
    };

    const handleCircleClick = () => {
        setShowMoreDetails(true)
    };

    const handleOnMouseMove = (e) => {
        const pixelOffset = -50;
        const offsetX = 0;
        const offsetY = -pixelOffset;

        setMousePosition({
            lat: e.latLng.lat() + offsetY / 111111,
            lng: e.latLng.lng() + offsetX / (111111 * Math.cos((e.latLng.lat() * Math.PI) / 180))
        })
    }

    const circleOptions = {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: isMouseOver ? 0.35 : 0.15,
        clickable: true,
        draggable: false,
        editable: false,
        visible: true
    }

    return (
        <>
            <Circle
                center={center}
                radius={radius}
                options={circleOptions}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={handleCircleClick}
                onMouseMove={handleOnMouseMove}
            />
            {isMouseOver && (
                <InfoWindow
                    position={mousePosition}
                    options={{ maxWidth: 200 }}
                >
                    <div style={{ width: "auto", height: "auto", color: "#000" }}>
                        <div>{s_id} - <span style={{ fontWeight: "bold" }}>{s_name}</span></div>
                        {showMoreDetails && (
                            <div>
                                <div>So Many: {s_somany}</div>
                                <div>One or Two: {s_oneortwo}</div>
                                <div>None: {s_none}</div>
                            </div>
                        )}
                    </div>
                </InfoWindow>
            )}
        </>
    );
}

export default CircleMarker;