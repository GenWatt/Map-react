import React,{useEffect,useState} from 'react';
import './App.css';
import world from "./world.json";
interface Options{
  key:string,
  lat:number,
  lon:number,
  zoom:number,
}

const options:Options = {
  key: "tMELm6Op3L4qJDipBujrx7V9PypXpU6S", // REPLACE WITH YOUR KEY !
  lat: 42.4,
  lon: 5.3,
  zoom: 6,
};
const boundariesStyle = {
  color: "white",
  weight: 1
};
const layers:string[] = ["wind","depth","temp",];
//@ts-ignore
const depthIcon = L.icon({
  iconUrl: 'logo512.png',
  iconSize:     [38, 95], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
});
const markers:any=[];
//@ts-ignore
if (!window.copy_of_W) {
  //@ts-ignore
  window.copy_of_W = Object.assign({}, window.W);
  }
  //@ts-ignore
  if (window.W.windyBoot) {
    //@ts-ignore
  window.W = Object.assign({}, window.copy_of_W);
  }

function App() {
  const [isShowLayers, setShowLayers] = useState<Boolean>(false);
  const [store,setStore] = useState<any>(null);
  const [map,setMap] = useState<any>(null);
  
  const handleLayerChange=(layer:string)=>{
    if(!store) return
    switch(layer){
      case "wind":
        store.set("overlay",layer);
        store.set("particlesAnim","on");
        if(markers.length) removeMarkers();
        break;
      case "temp":
        store.set("particlesAnim","off");
        store.set("overlay",layer);
        if(markers.length) removeMarkers();
        break;
      case "depth":
        store.set("particlesAnim","off");
        store.set("overlay","wind");
        setMarkers();
        break;
      default: return;
    }  
}

function setMarkers(){
  //@ts-ignore
  const  marker = new L.Marker([50,20], {icon:depthIcon});
  markers.push(marker);
  map.addLayer(marker);
}

function removeMarkers(){
  markers.forEach((marker:any)=>map.removeLayer(marker))
}
  useEffect(() => {
    //@ts-ignore
    windyInit(options, (windyAPI) => {
      // windyAPI is ready, and contain 'map', 'store',
      const { map, colors,store } = windyAPI;
      // .map is instance of Leaflet map
      colors.wind.changeColor([
          [2, [8, 4, 56]],
          [20, [8, 4, 56]]
      ]);
      //@ts-ignore
      L.geoJSON(world, { style: boundariesStyle }).addTo(map);
      setStore(store);
      setMap(map);
  });
  }, []);

  useEffect(()=>handleLayerChange("temp"),[store]);

  return (
    <div className="container">
      <div id="windy" style={{width:"100%",height:600}}></div>
      <nav className="map-nav">
        <button className="layer-btn" onClick={()=>setShowLayers(!isShowLayers)}>Show</button>
        <button className="layer-btn">POP</button>
        <button className="layer-btn">Hey</button>
      </nav>
      {isShowLayers&&<ul className="layer-container">
        {layers.map(layer=>(
        <li className="layer-item" onClick={()=>handleLayerChange(layer)} key={layer}>
          <div className="layer-circle">
            <i></i>
          </div>
          <p className="layer-label">{layer}</p>
        </li>
        ))}
      </ul>}
    </div>
  );
}

export default App;
