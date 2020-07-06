import React from 'react';

function InputHOC(WrappedComponent) {
  return class PP extends React.Component {
    constructor(props) {
      super(props)
      console.log(props, 111);
      this.state = { fields: props.fields || {} }
    }

    getField(fieldName) {
      if (!this.state.fields[fieldName]) {
        this.state.fields[fieldName] = {
          value: '',
          onChange: event => {
            this.state.fields[fieldName].value = event.target.value
            this.forceUpdate()
          }
        }
      }
      return {
        value: this.state.fields[fieldName].value,
        onChange: this.state.fields[fieldName].onChange
      }
    }

    render() {
      const props = Object.assign({}, this.props, {
        fields: this.getField.bind(this),
      })
      return (
        <>
          <h2>
            Input HOC
          </h2>
          <WrappedComponent {...props} />
        </>
      )
    }
  }
}

export default InputHOC;