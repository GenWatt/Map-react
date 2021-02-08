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
//@ts-ignore
  const polyline = L.polyline([])

function App() {
  const [map,setMap] = useState<any>(null)
  const [draw,setDraw] = useState<any>(false)

  useEffect(() => {
    //@ts-ignore
    windyInit(options, (windyAPI) => {
      // windyAPI is ready, and contain 'map', 'store',
      const { map, colors, store } = windyAPI;
      // .map is instance of Leaflet map
      colors.wind.changeColor([
          [2, [8, 4, 56]],
          [20, [8, 4, 56]]
      ]);
      //@ts-ignore
      L.geoJSON(world, { style: boundariesStyle }).addTo(map);
      setMap(map)
      //@ts-ignore
     polyline.addTo(map)
  });
  }, []);
  function handleFile(e:any){
      const input = e.target;
      const reader = new FileReader();
      reader.onload = function(){
        const dataURL:any = reader.result;

        //@ts-ignore
        new L.GPX(dataURL, {async: true}).on('loaded', function(e) {
          map.fitBounds(e.target.getBounds());
        }).addTo(map);
      };
      reader.readAsText(input.files[0]);
  }

  function handleDownload(){  console.log(polyline.getLatLngs())
  }
  
  function onMapClick(e:any){
   if(!draw) return
    //@ts-ignore
    polyline.addLatLng(L.latLng(e.latlng))
    map.setView(e.latlng)
  }

  useEffect(()=> {
    if(draw) map.on("click",onMapClick)
    else map.off("click")

    return ()=> map.off("click")
  },[draw])

  return (
    <div className="container">
      <div id="windy" style={{width:"100%",height:600}}></div>
      <button onClick={()=>setDraw(!draw)}>draw</button>
      <button onClick={handleDownload}>Download</button>
      <input type="file" onChange={(e)=>handleFile(e)}/>
    </div>
  );
}

export default App;
