<!--
This is a single-file-component for a Map that can be used in any page
https://vuejs.org/v2/guide/single-file-components.html
Author(s): Lucas, Adam
-->

<template>
  <div id="map-box">
    <!-- TODO: Fix or remove styling map: -->
    <b-button block id="mapstyle-button" variant="warning"
      >Change Style :D
    </b-button>
  </div>
</template>

<script>
import MapBox from 'mapbox-gl'

export default {
  name: 'mapPage',
  data() {
    return {
      accessToken:
        'pk.eyJ1IjoibHVraWlzYXVyIiwiYSI6ImNrdnlhYXh5aTBxOXUycGxjdTN1ejdwZ2wifQ.sD1ssqU8mmVCsj0eOpdXFQ',
      chosenStyleIndex: 0,
      // TODO: Fix or remove styling map:
      styles: [
        'mapbox://styles/mapbox/streets-v11',
        'mapbox://styles/mapbox/light-v10',
        'mapbox://styles/mapbox/dark-v10',
        'mapbox://styles/mapbox/outdoors-v11',
        'mapbox://styles/mapbox/satellite-streets-v11',
        'mapbox://styles/mapbox/navigation-day-v1',
        'mapbox://styles/mapbox/navigation-night-v1'
      ],
      clinicsGeoJson: [{}],
      center: [11.964, 57.701],
      zoom: 12,
      pitch: 0,
      map: {},
      jsonFile: ''
    }
  },
  created() {
    const geojson1 = {
      type: 'FeatureCollection',
      features: []
    }
    this.jsonConverter(geojson1)
  },
  mounted() {},
  methods: {
    // Tries to create a map from process.env token
    // Link: https://docs.mapbox.com/mapbox-gl-js/api/map/
    async makeAMap() {
      try {
        MapBox.accessToken = this.accessToken
        this.map = new MapBox.Map({
          container: 'map-box',
          style: this.styles[3],
          center: this.center,
          zoom: this.zoom,
          pitch: this.pitch,
          cooperativeGestures: true
        })
      } catch (error) {
        console.log("The map couldn't load", error)
      }
    },
    //  JSON file converts to GeoJSON format
    jsonConverter(geojson1) {
      // Subscribe to "updateJson" mutations; i.e: clinicJson changes
      // Do code inside subscribe when the data has changed
      this.$store.subscribe((mutation, updateJson) => {
        if (mutation.type.startsWith('updateJson')) {
          this.jsonFile = this.$store.state.clinicJson

          for (let i = 0; i < this.jsonFile.dentists.length; i++) {
            geojson1.features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [
                  this.jsonFile.dentists[i].coordinate.longitude,
                  this.jsonFile.dentists[i].coordinate.latitude
                ]
              },
              properties: {
                id: this.jsonFile.dentists[i].id,
                name: this.jsonFile.dentists[i].name,
                owner: this.jsonFile.dentists[i].owner,
                dentists: this.jsonFile.dentists[i].dentists,
                address: this.jsonFile.dentists[i].address,
                city: this.jsonFile.dentists[i].city,
                openinghours: {
                  monday: this.jsonFile.dentists[i].openinghours.monday,
                  tuesday: this.jsonFile.dentists[i].openinghours.tuesday,
                  wednesday: this.jsonFile.dentists[i].openinghours.wednesday,
                  thursday: this.jsonFile.dentists[i].openinghours.thursday,
                  friday: this.jsonFile.dentists[i].openinghours.friday
                }
              }
            })
          }

          // add map layers after data arrives
          this.clinicsGeoJson = geojson1
          this.doMapRelatedThings()
        }
      })

      // Call unsubscribe to stop the subscription
      // unsubscribe()
    },
    doMapRelatedThings() {
      this.makeAMap()
      this.addMapLayers() // Add map layers after map is created
      this.addMarkers() // TODO: Make this method add custom markers
      this.goToClinic() // Add posibility to navigate to markers
    },
    // Add layers to map: Sky layer,
    // More info: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/,
    // https://docs.mapbox.com/help/glossary/map-loads/
    addMapLayers() {
      this.map.on('load', () => {
        console.log('Map has loaded')
        this.map.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 25
          }
        })
        // Add the circle markers on locations from GeoJSON file
        // From template: https://docs.mapbox.com/help/tutorials/building-a-store-locator/
        this.map.addLayer({
          id: 'locations',
          type: 'circle',
          source: {
            type: 'geojson',
            data: this.clinicsGeoJson
          }
        })
      })
    },
    // Makes new marker objects at a specific longitude and latitude, and adds them to this.map
    // More info: https://docs.mapbox.com/mapbox-gl-js/api/markers/
    addMarkers() {
      const clinicFeatures = this.clinicsGeoJson.features
      try {
        for (let i = 0; i < clinicFeatures.length; i++) {
          const currentCoordinate = clinicFeatures[i].geometry.coordinates
          // eslint-disable-next-line no-unused-vars
          const marker = new MapBox.Marker({ color: 'red' })
            .setLngLat(currentCoordinate)
            .addTo(this.map)
        }
      } catch (error) {
        console.log('You got marked', error)
      }
    },
    // Set a new style by going through the styles array
    // More info: https://docs.mapbox.com/api/maps/styles/
    // TODO: Fix. Not working atm
    changeMapStyle() {
      const nextStyle = this.chosenStyleIndex + 1
      if (!(nextStyle >= this.styles.length)) {
        this.map.setStyle(this.styles[nextStyle])
        this.chosenStyleIndex += 1
      } else {
        this.map.setStyle(this.styles[0])
        this.chosenStyleIndex = 0
      }
    },
    // TODO: add link to template
    goToClinic() {
      this.map.on('click', (event) => {
        const features = this.map.queryRenderedFeatures(event.point, {
          layers: ['locations']
        })
        if (!features.length) return
        const clickedPoint = features[0]
        this.flyToClinic(clickedPoint)
        this.createPopUp(clickedPoint)
        // maybe we need this part for the list?
        /* Highlight listing in sidebar (and remove highlight for all other listings) */
        //   const activeItem = document.getElementsByClassName('active')
        //   if (activeItem[0]) {
        //     activeItem[0].classList.remove('active')
        //   }
        //   const listing = document.getElementById(
        //     `listing-${clickedPoint.properties.id}`
        //   )
        //   listing.classList.add('active')
      })
    },
    // Fly to the clinic marker
    flyToClinic(currentFeature) {
      this.map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15
      })
    },
    // Create popup
    createPopUp(currentFeature) {
      const popUps = document.getElementsByClassName('mapboxgl-popup')
      // If there is already a popup on the map, remove it
      if (popUps[0]) popUps[0].remove()
      const parsed = JSON.parse(currentFeature.properties.openinghours)

      new MapBox.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        // TODO: Style properly
        .setHTML(
          `<div style="
          background:#fff
          background: linear-gradient(180deg, rgba(35, 72, 203, 0.42) 0%, rgba(142, 187, 255, 0) 100%);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
          margin: -10px; 
          margin-bottom: -15px; ">
          <div style="background: rgba(35, 72, 203, 0.42);">
          <h3 style="
          color: black;
          margin: 0;
          padding-top: 10px;
          padding-right: 10px;
          padding-left: 10px;
          font-weight: 700;
          font-style: italic;
          font-size: 180%;
          font: serif;
          text-align: center;">${currentFeature.properties.name}</h3>
          <h4 style="
          margin: 0;
          padding-bottom: 10px;
          font-weight: 400;
          font-style: italic;
          font: roboto;
          font-size: 120%;
          text-align: center">${currentFeature.properties.address}</h4> </div>
          <div style="
          text-align: center;
          padding: 10px;
          padding: 10px;
          font-weight: 1000;
          font-style: italic;
          font: sans-serif;">
          <h5 style="font-size: 100%;
          font-weight: 400;">Opening Hours:<h5/>
          <h5 style="font-size: 100%;">Mon: ${parsed.monday.replace(/[-]/g, ' - ')}<h5/>
          <h5 style="font-size: 100%;">Tue: ${parsed.tuesday.replace(/[-]/g, ' - ')}<h5/>
          <h5 style="font-size: 100%;">Wed: ${parsed.wednesday.replace(/[-]/g, ' - ')}<h5/>
          <h5 style="font-size: 100%;">Thu: ${parsed.thursday.replace(/[-]/g, ' - ')}<h5/>
          <h5 style="font-size: 100%;">Fri: ${parsed.friday.replace(/[-]/g, ' - ')}<h5/>
          </div>
          </div>`
        )
        .addTo(this.map)
    }
  }
}
</script>

<style scoped>
.marker {
  border: none;
  cursor: pointer;
  height: 56px;
  width: 56px;
  /* background-image: url(marker.png); */
}

.mapboxgl-marker {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid gray;
  background-color: lightblue;
  position: absolute;
}

#map-box {
  max-height: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0;
  right: 0;
}

#mapstyle-button {
  z-index: 1;
  position: absolute;
  width: 150px;
  right: 0px;
  bottom: 0px;
  margin: 25px;
  display: none;
}
</style>
