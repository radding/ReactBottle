# React-Bottle

A React binding for BottleJS Dependency injection

## Installation

Install via NPM: `npm i react-bottle`;

## Quick Start

First you must instantiate a diContainer by using `getProviderElement`.
`getProviderElement` takes in a series of functions that build up your
dependencies and returns a Root DI provider element. Then you pass your
components into `wireUpDI` to get your container injected into your components
via the `di` prop.

### Example

```typescript
import {
    getProviderElement,
    wireUpDi,
    DIFragment,
} from "react-bottle";

let Component = (props) => {
    return (
        <div>
            <button onClick={props.di.onClick}>ClickMe</button>
        </div>
    )
}

Component = wireUpDi()(Component);

const buttonOnClickFragment:DIFragment = (di: ReactBottle): ReactBottle => {
    di.factory("onClick", () => () => alert("I was Clicked!"));
    return di;
}

const Provider = getProviderElement(buttonOnClickFragment);

ReactDOM.render(
    <Provider><Component /></Provider>,
    document.getElementById('root'),
);
```

## Why even use a DI container

Because it makes testing easier. It separates your concerns and provides a simple
method to change your dependencies when you either need to change your application
behavior or when testing a specific unit. I found that DI containers forces you
to think about being deliberate in what a component or function needs to  do and what
your dependencies of something are and needs to be.

On top of this, it makes testing easier by providing an easier mechanism for mocking
your dependencies than just monkey patching.

## Usage

### getProviderElement

```typescript
const getProviderElement = (...fragments: DIFragment[]): React.FunctionComponent<any>
```

Takes a list of Di Fragments (to help with DI organization) and returns the Root Provider
element that should wrap your app.

### DIFragment

```typescript
type DIFragment = (container: ReactBottle) => ReactBottle;
```

A DIFragment is a function that takes a ReactBottle instance and returns a
ReactBottle instance. These functions should be where you should define your
dependencies. Define these functions to provide a logical separation in your
DI container to provide better organization.

### wireUpDi

```typescript
(mapDiToProps?: DIMapper) => (Component: React.ComponentType<any>): React.ComponentType<any>
```

Injects your di container into your components. Takes an optional `mapDiToProps` function similar
to react-redux's mapStateToProps: It takes the di container and then maps those to friendlier prop
names.

### ReactBottle

This is a react binding for BottleJS, a dead simple and powerful DI container.
Anything you can do with that project you can do with this one. Docs for BottleJS:
[https://github.com/young-steveo/bottlejs](https://github.com/young-steveo/bottlejs)
