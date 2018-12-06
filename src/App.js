import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

class ShortLink extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    var longUrl = this.state.value;
    // var url = "https://beenverified-api.herokuapp.com/" + longUrl;
    var url = "http://localhost:4000/" + longUrl;
    
    fetch(url, {
      mode: 'cors',
      method: 'POST',
      body: longUrl
    })
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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Long Url:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

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

function RedirectUrl (url){
  window.location = url;
}

class AccessLink extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: null,
      renderRedirect: false,
      url: ''
    }
  };

  componentDidMount(){
    var link = this.props.match.url;
    // var url = 'https://beenverified-api.herokuapp.com/' + link;
    var url = 'http://localhost:4000/' + link;

    fetch(url, {mode: 'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          if(result.error){
            this.setState({
              renderRedirect: false
            });
          }
          else{
            this.setState({
              renderRedirect: true,
              url: result.redirect
            });
          }

        },
        (error) =>{
          this.setState({
            renderRedirect: false,
            error
          });
        }
      )
 
  }

  render(){
    const { error, renderRedirect, url } = this.state;

    if(renderRedirect){
      RedirectUrl(url);
    }
    else{
      return(
        <div>
          <p>This is not a valid URL</p>
        </div>
        )
    }
  }
}

class UrlList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    }
  };

  componentDidMount(){
    // var url = 'https://beenverified-api.herokuapp.com/top'
    var url = 'http://localhost:4000/top'

    fetch(url, {mode: 'cors'})
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
              <h1>Submit a Short Link</h1>
              <ShortLink />
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

class App extends Component {
  render(){
    return(
      <Router>
        <Switch>         
          <Route exact={true} path="/" component={UrlList} />
          <Route path="/*" component={AccessLink}/>
          </Switch>
      </Router>
    )
  }
}

export default App;