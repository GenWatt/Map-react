import React,{useEffect,useState} from 'react';
import './App.css';
import axios from 'axios'
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


function App() {
const [file, setFile] = useState<any>(null)
const [img, setImg] = useState<any>({})
const [edited, setEdited] = useState<any>({})

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
  });
  }, []);
  function handleFile(e:any) {
    console.log(e.target.files[0])
    if(e.target.files[0]) setFile(e.target.files[0])
    else setFile(null)
  }

 async function handleSubmit(e:any){
    e.preventDefault()
    const formData = new FormData()

      formData.append('crewImage', file)
      formData.append('name', "hej")
    
    if(edited) {
    try {
      console.log(file)
      const res =  await fetch('http://localhost:5000/crew', {method:'POST', body: formData})
      
      console.log(res)
    } catch (error) {
      
    }
  } else {
    try {
      const res =  await fetch(`http://localhost:5000/crew/${edited.imagePath}`, {method:'PUT', body: formData})
    } catch (error) {
      
    }
  }
  
  }

 async function handleGet(){
  const data = await(await fetch('http://localhost:5000/crew')).json()
  console.log(data)
  setImg(data)
  }

  useEffect(()=>{ handleGet() }, [])

  function handleEdit(path:any){
    if(path)
    setEdited(img.filter((img:any)=>img.imagePath === path)[0])
  }

  return (
    <div className="container">
      <div id="windy" style={{width:"100%",height:600}}></div>

      {img.length && img.map((img:any )=>(
        <div>
              <img src={'http://localhost:5000/'} style={{width: 100, height: 100}} alt="" onClick={()=>handleEdit(img.imagePath)}/>
              <span>{}</span>
        </div>
      ))}
      <form action="" onSubmit={handleSubmit}>
        <input type="file" onChange={(e)=> handleFile(e)}/>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
