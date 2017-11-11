# react-renderless 🖇

Utilities for creating and working with renderless React components.

*What is a "renderless component"?* A renderless component is the opposite of a stateless component. It does not implement a render method. Instead, renderless components are composed with stateless functional components to create UI elements.

- [Usage](#usage)
- [API](#api)
  - [StateProvider Component](#stateprovider-component)
  - [withRender Higher-Order Component](#withrender-higher-order-component)
- [Examples](#examples)
  - [Textboxes](#textboxes-codepen)
  - [Reducer](#reducer-codepen)
  - [More Examples on Codepen](#more-examples-on-codepen)
- [Inspiration](#inspiration)
- [License](#license)

## Usage

### Script

```html
<script src="https://unpkg.com/react-renderless"></script>
```

```jsx
const { StateProvider, withRender } = reactRenderless
```

### Package

```bash
yarn add react-renderless
# OR
npm install --save react-renderless
```

```jsx
// commonjs
const { StateProvider, withRender } = require("react-renderless") 
// es module
import { StateProvider, withRender } from "react-renderless" 
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

- The [render prop](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) will be called with 2 arguments: `(props, context)` where props is `{...this.props, ...this.state, ...this.handlers}`. The prop should either be `render` or the only child of the parent. The render prop must return an element when called (not a component class)!

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

## Examples

#### Textboxes [Codepen](https://codepen.io/alexkrolick/pen/RLVprZ/)

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

### Reducer [Codepen](https://codepen.io/alexkrolick/pen/eGWEXZ?editors=0010)

[<img width="279" alt="screen shot 2017-09-28 at 2 39 14 am" src="https://user-images.githubusercontent.com/1571667/30959869-48ae6f20-a3f6-11e7-94e9-0457435fb4db.png">](https://codepen.io/alexkrolick/pen/eGWEXZ?editors=0010)

```jsx
const { StateProvider, withRender } = reactRenderless;

class Reducer extends StateProvider {
  get handlers() {
    const reducer = {
      "foo:update": ({ foo }) => ({ foo: foo }),
      "bar:inc": () => ({ bar }) => ({ bar: bar + 1 }),
      "bar:dec": () => ({ bar }) => ({ bar: bar - 1 })
    };
    return {
      action: (type, payload) => {
        if (!reducer[type]) return this.setState({});
        this.setState(reducer[type](payload));
      }
    };
  }
}

const App = () => (
  <Reducer initialState={{ foo: "", bar: 0 }}>
    {({ action, ...state }) => (
      <div>
        <p>
          <b>Foo</b>&nbsp;
          <input
            onChange={e => action("foo:update", e.target.value)}
            value={state.foo}
          />
        </p>
        <p>
          <b>Bar</b>&nbsp;
          <button onClick={() => action("bar:dec")}>-</button>
          <span>{state.bar}</span>
          <button onClick={() => action("bar:inc")}>+</button>
        </p>
      </div>
    )}
  </Reducer>
);

ReactDOM.render(<App />, document.body);
```

### More Examples on Codepen

- Global reducer using [React-Broadcast](https://github.com/ReactTraining/react-broadcast): https://codepen.io/alexkrolick/pen/NaYaXj
- Nested, auto-namespaced global reducers: https://codepen.io/alexkrolick/pen/MEvGWG

## Inspiration

- [Recompose](https://github.com/acdlite/recompose) by Andrew Clark
- [React Powerplug](https://github.com/renatorib/react-powerplug) by Renato Ribeiro
- [Use a Render Prop!](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) by Michael Jackson

## License 

[MIT](./LICENSE)
