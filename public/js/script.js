const socket = io();

if(navigator.geolocation) {

    navigator.geolocation.watchPosition((position)=>{

        const {latitude, longitude} = position.coords;


        socket.emit("send-location",{latitude, longitude})
    },(error)=>{

        console.error(error);
        
    },
    {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 0
    }
    

    );
}

const map = L.map("map").setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{

    attribution: "Dev Akash"
}).addTo(map);

const markers = {};

socket.on("location",(data)=>{

    console.log("From server:", data);

    const {latitude, longitude, id} = data;

    console.log(latitude,longitude)

    map.setView([latitude,longitude], 16)

    if(markers[id]) {

        markers[id].setLatLng([latitude,longitude]);
    }

    else {

        // console.log(markers[id]);
        markers[id] = L.marker([latitude,longitude]).addTo(map).bindPopup(`User ID: ${id}`).openPopup();
    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){

        map.removeLayer(markers[id])
        delete markers[id];
    }
})