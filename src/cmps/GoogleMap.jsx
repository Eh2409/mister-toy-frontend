import { useState, useEffect, useRef, Fragment } from "react"
import { AdvancedMarker, APIProvider, Map, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

const apiKey = process.env.GOOGLE_MAP_API_KEY
// const apiKey  'AIzaSyD0Pzw5IoHqPkTT9cEnnqDqEO9lPNCmKmg'

export function GoogleMap({ branches, selectedBranche, toggleIsBrancheOpen }) {
    const [position, setPosition] = useState({ lat: 31.0461, lng: 34.8516 })
    const [markerRef, marker] = useAdvancedMarkerRef()

    function handleMapClick(ev) {
        const { latLng } = ev.detail
        ev.map.panTo(latLng)
        setPosition(latLng)
    }

    return (
        <div style={{ width: "100%", height: "500px" }} className="google-map">
            <APIProvider apiKey={apiKey} >
                <Map
                    defaultCenter={position}
                    defaultZoom={7}
                    mapId="DEMO_MAP_ID"

                    onClick={handleMapClick}
                >

                    {branches?.length > 0 && branches.map(b => {

                        return <Fragment key={b._id}>
                            <AdvancedMarker position={b?.pos} onClick={() => { toggleIsBrancheOpen(b) }}
                                ref={selectedBranche?._id === b?._id ? markerRef : null}
                            >
                                <Pin
                                    background={'var(--mainSiteClrTheme)'}
                                    borderColor={'var(--outlineClr1)'}
                                    glyphColor={'var(--appliedfilterClr)'}>

                                </Pin>
                            </AdvancedMarker>
                            {selectedBranche?._id === b?._id &&
                                <InfoWindow className='branche-info' anchor={marker} maxWidth={300}>
                                    <button onClick={() => toggleIsBrancheOpen(b)} className="close-btn">X</button>
                                    <div>
                                        <h3>{selectedBranche?.name}</h3>
                                        <div>{selectedBranche?.address}</div>
                                    </div>
                                </InfoWindow>}
                        </Fragment>
                    })}

                </Map>

            </APIProvider>
        </div>
    )
}
