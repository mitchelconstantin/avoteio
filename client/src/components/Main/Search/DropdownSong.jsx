import React from 'react';


const DropdownSong = (props) => (

      <div>
        
          {console.log('Dropdown song props:',props)}
          <button onClick={(e)=>props.selectSong(e, props.song)}>{props.song.name} by {props.song.artists[0].name}
              
          </button>
           
          
      </div>
  
    // //title: data.tracks.items[i].name,
           //   artist: data.tracks.items[i].
)



export default DropdownSong