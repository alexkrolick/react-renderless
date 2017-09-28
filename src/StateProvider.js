import React, { Component } from "react"
import PropTypes from "prop-types"

class StateProvider extends Component {
  constructor(props) {
    super(props)
    this.state = props.initialState || this.initialState
    this._handlers = this.handlers // call handlers once and store result
  }

  get initialState() {
    return {}
  }

  get handlers() {
    return {} // use arrow functions here to bind handlers to the instance
  }

  defaultRender() {
    return null
  }

  render() {
    const {
      children,
      render: renderProp,
      initialState,
      ...otherProps
    } = this.props
    const renderer = children || renderProp || this.defaultRender
    return renderer(
      { ...otherProps, ...this.state, ...this._handlers },
      this.context
    )
  }
}

StateProvider.propTypes = {
  children: PropTypes.func, // pass either children or render
  render: PropTypes.func, // pass either children or render
  initialState: PropTypes.object, // optional
}

export default StateProvider
