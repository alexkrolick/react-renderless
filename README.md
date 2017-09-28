# react-renderless ⚙️🖇⨌

Utilities for creating and working with renderless React components.

*What is a "renderless component"?* A renderless component is the opposite of a stateless component. It does not implement a render method. Instead, renderless components are composed with stateless functional components to create UI elements.

## Usage

```jsx
// One of the following:
const { StateProvider, withRender } = reactRenderless // script tag
const { StateProvider, withRender } = require("react-renderless") // commonjs
import { StateProvider, withRender } from "react-renderless" // es module
```

## API

### StateProvider Component

Instead of extending React.Component for renderless components, extend StateProvider.

```js
StateProvider.propTypes = {
  children: PropTypes.func, // pass either children or render
  render: PropTypes.func, // pass either children or render
  initialState: PropTypes.object, // optional
}
```

- The [render prop](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce):
  `children` or `render` (pick one). Will be called with 2 arguments: `(props, context)` where props is `{...this.props, ...this.state, ...this.handlers}`.

- Initial state: The component's initial state can be set by passing a prop or by setting an `initialState` getter on the class.

- Handlers: An object that provides all the actions needed to modify the state. It is initiated one time, at mount. Handlers that need to be bound to the component instance should use arrow functions for declaration. (This will _not_ create additional functions in each render.)

```jsx
class SimpleState extends StateProvider {
  get initialState() {
    return {
      foo: "bar",
    };
  }

  get handlers() {
    return {
      set: (key, value) => this.setState({ [key]: value }),
    };
  }
}

const App = () => (
  <SimpleState
    render={({foo}) => <b>{foo}</b>}
    initialState={{foo: 'baz'}}
  />
)

// renders "baz" because the initialState prop overrides the getter

```

### withRender Higher-Order Component

`withRender` combines a container and presenter (renderless and stateless) into a new component that acts like a normal React component. Under the hood it simply passes the presenter as the render prop to the renderless component.



```jsx
const Combined = withRender(MyStateProvider, MyRenderFunction)

const App = () => <Combined initialState={{foo: 'baz'}} />
```

`withRender` is curried so it can either be with 1 argument to create a factory for a stateful component or 2 to create a new component immediately.

```jsx
const textStateFactory = withRender(TextState)
const TextInput = textStateFactory(Input)
const BigTextInput = textStateFactory(BigInput)
```

## Example

[<img width="365" alt="screen shot 2017-09-28 at 1 14 30 am" src="https://user-images.githubusercontent.com/1571667/30955993-774923ea-a3ea-11e7-8cc9-65978c654b21.png">](https://codepen.io/alexkrolick/pen/RLVprZ/)

```jsx
const Input = ({ text, setText }) => <input onChange={setText} value={text} />;

class Text extends StateProvider {
  get handlers() {
    return {
      setText: e => this.setState({ text: e.target.value })
    };
  }
}

class UpperText extends StateProvider {
  get initialState() {
    return {
      text: ""
    };
  }

  get handlers() {
    return {
      setText: e => this.setState({ text: e.target.value.toUpperCase() })
    };
  }
}

class LowerText extends StateProvider {
  get handlers() {
    return {
      setText: e => this.setState({ text: e.target.value.toLowerCase() })
    };
  }
}

const TextInput = props => <Text {...props}>{Input}</Text>;
const UpperTextInput = withRender(UpperText, Input);

const App = () => (
  <div>
    <TextInput initialState={{ text: "" }} /> TextInput <br />
    <UpperTextInput /> UpperTextInput <br />
    <LowerTextInput initialState={{ text: "" }} /> LowerTextInput
  </div>
);

ReactDOM.render(<App />, document.body);
```

## Inspiration

- [Recompose](https://github.com/acdlite/recompose) by Andrew Clark
- [React Powerplug](https://github.com/renatorib/react-powerplug) by Renato Ribeiro
- [Use a Render Prop!](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) by Michael Jackson

## License 

[MIT](./LICENSE)
