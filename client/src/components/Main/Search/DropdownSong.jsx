import React from 'react';


const DropdownSong = (props) => (

      <div>
          
          {console.log('Dropdown song props:',props)}
            {props.title} by {props.artist}
          <button onClick={props.dropdownSongs}>Select Track</button>
      </div>
  
    
)



export default DropdownSong