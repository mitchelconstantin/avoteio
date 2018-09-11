import React from 'react';


const Song = (props) => (

      <div>
          
          {console.log('Song props:',props)}
            {props.title} by {props.artist}
          <button onClick={props.dropdownSongs}></button>
      </div>
  
    
)



export default Song