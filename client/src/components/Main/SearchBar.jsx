import React, { Component } from 'react';

class SearchBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        input:''
      };
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    handleInputChange (e) {
        this.setState({
            input:e.target.value
        })
    }

    handleClick(e) {
        e.preventDefault()
        this.props.updateSongBank(this.state.input)
        //get request from spotify
        //on success:
          //figure out a way to render the top 5 results from Spotify
    }
  
    render() {
      // console.log(data.tracks.items);
      return (
       <div>
           {/* {console.log('here are search props',this.props)} */}
           <form action=""  >
               <input type="text" value={this.state.input} onChange={this.handleInputChange} />
               <button onClick={(e)=>this.handleClick(e)}>button</button>
           </form>
       </div>
      );
    }
  }




export default SearchBar;