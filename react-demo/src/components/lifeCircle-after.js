import React, { Component } from 'react';

class LifeCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }
  static getDeriveStateFromProps() {
    console.log('getdrivestatefromprops')
  }
  componentDidMount() {
    console.log('didmount');
  }
  shouldComponentUpdate() {
    console.log('shouldupdate');
    return true;
  }
  getSnapshotBeforeUpdate() {
    console.log('snapshotbeforeupdate');
    return null;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('didupdate', snapshot);
  }
  componentWillUnmount() {
    console.log('willunmount');
  }
  render() {
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
