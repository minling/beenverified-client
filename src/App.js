import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class Url extends React.Component {
  render (){
    return(
      <tr>
        <td>{this.props.link.url}</td>
        <td>{this.props.link.short_url}</td>
        <td>{this.props.link.title}</td>
        <td>{this.props.link.access_count}</td>
      </tr>
    );
  }
}

class UrlTable extends React.Component {
  render(){
    var rows = [];
    this.props.links.forEach((link) => {
      rows.push(<Url link = {link} />)
    });
    return(
      <table className="urlList">
        <thead>
          <tr>
            <th>URL</th>
            <th>Short Url</th>
            <th>Title</th>
            <th>Access Count</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class UrlList extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    }
  };

  componentDidMount(){
    fetch('https://beenverified-api.herokuapp.com/top', {mode: 'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.top_100
          });
        },
        (error) =>{
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render(){
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div> Error: {error.message}</div>;
    }
    else if (!isLoaded){
      return <div>Loading...</div>
    }
    else{
      return(
        <div>
          <div>
            <h1>Form</h1>
          </div>
          <div>
            <h1>Top 100 Links</h1>
            <UrlTable links = {items}/>
          </div>
        </div>
      );
    }
  }
}

export default UrlList;