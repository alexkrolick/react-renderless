import React from "react"

function withRender(Container, Presenter) {
  if (!Presenter) return withRender.bind(undefined, Container)
  const Combined = props => <Container render={Presenter} {...props} />
  Combined.displayName = `${Container.name}(${Presenter.name})`
  return Combined
}

export default withRender
