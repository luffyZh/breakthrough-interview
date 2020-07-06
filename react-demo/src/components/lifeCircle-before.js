import React, { Component } from 'react';

class LifeCircle extends Component {
  
  state = {
    value: ''
  };

  componentWillMount() {
    console.log('willmount');
  }
  componentDidMount() {
    console.log('didmount');
  }
  componentWillUpdate() {
    console.log('willupdate');
  }
  shouldComponentUpdate() {
    console.log('shouldupdate');
    return true;
  }
  componentDidUpdate() {
    console.log('didupdate');
  }
  componentWillUnmount() {
    console.log('willunmount');
  }
  render() {
    console.log(`this.props:`, this.props);
    return (
      <div>
        <input 
          value={this.state.value}
          onChange={({ target: { value } }) => this.setState({ value })}
        />
      </div>
    )
  }
}

export default LifeCircle;
