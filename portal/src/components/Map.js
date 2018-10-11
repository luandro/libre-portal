import React, { Component, Fragment } from 'react'
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import './Map.css'

const MyPopupMarker = ({ content, position }) => (
  <Marker position={position}>
    <Popup>{content}</Popup>
  </Marker>
)

const MarkersList = ({ markers }) => {
  const items = markers.map(({ key, ...props }) => (
    <MyPopupMarker key={key} {...props} />
  ))
  return <Fragment>{items}</Fragment>
}


export default class CommunityMap extends Component {
  state = {
    lat: -14.062969,
    lng: -47.465121,
    zoom: 16,
    markers: [
      { key: 'marker1', position: [-14.057018, -47.469790], content: 'Entrada cachoeiras' },
      { key: 'marker2', position: [-14.066425, -47.464871], content: 'Hostel Moinho' },
      { key: 'marker3', position: [-14.1, -0.05], content: 'My third popup' },
    ],

  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom} zoomControl={false} className="Map">
        <TileLayer
          // attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVhbmRybyIsImEiOiJMQWVvZmtJIn0.NYpCUtwAgVlAF1LeeJBbug"
        />
        <ZoomControl position="topright" />
        <MarkersList markers={this.state.markers} />
      </Map>
    )
  }
}