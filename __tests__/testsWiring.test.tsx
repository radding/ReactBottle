import React from "react";

import {
    createDiContainer,
    getProviderElement,
    wireUpDi,
    DIFragment,
    diContainer,
    deleteContainer,
    useDI,
} from "../lib/index";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
import { mount } from "enzyme";
import ReactBottle from "../lib/container";

it("creates the proper diContainer", () => {
    const di = createDiContainer();
    expect(di).toBeDefined();
});

it("Creates the proper context object", () => {
    const di = createDiContainer();
    di.constant("Some", "Value");
    const fragment: DIFragment = (diPart: ReactBottle) => {
        diPart.constant("Some", "Value");
        return diPart;
    };
    const Provider = getProviderElement(fragment);
    expect(Provider).toBeDefined();

    const Component = wireUpDi()((props) => (
        <div>{props.di.Some}</div>
    ));
    const element = mount(<Provider><Component /></Provider>);
    expect(element).toBeDefined();
    expect(element.html()).toEqual("<div>Value</div>");
});

it("injects functions", () => {
    const func = jest.fn(() => "Something");
    const fragment: DIFragment = (diPart: ReactBottle) => {
        diPart.factory("SomeFactory", () => func);
        return diPart;
    };
    const Provider = getProviderElement(fragment);
    const Component = wireUpDi()((props) => (
        <div>{props.di.SomeFactory()}</div>
    ));
    mount(<Provider><Component /></Provider>);
    expect(func).toHaveBeenCalled();
});

it("tests that mapping works fine", () => {
    const fragment: DIFragment = (diPart: ReactBottle) => {
        diPart.constant("someConst", "Value");
        diPart.constant("someConst2", "Value2");
        return diPart;
    };
    const Provider = getProviderElement(fragment);
    const map = jest.fn((_) => ({ value: "some" }));
    const Component = wireUpDi(map)((props) => {
        expect(props.value).toEqual("some");
        return null;
    });
    mount(<Provider><Component /></Provider>);
    expect(map).toHaveBeenCalled();
    expect(map).toHaveBeenCalledWith(diContainer!.container);
});

it("renders fine if no container is defined", () => {
    console = { warn: jest.fn() } as unknown as Console;
    deleteContainer();
    const Component = wireUpDi()((props) => {
        expect(props.di).toBeUndefined();
        return <div>No Di Loaded</div>;
    });
    const element = mount(<Component />);
    expect(element.html()).toEqual("<div>No Di Loaded</div>");

    // tslint:disable-next-line
    expect(console.warn).toBeCalled();
});

it("uses the context hook appropriately", () => {
    const click = jest.fn();
    const Provider = getProviderElement((fragment) => {
        fragment.factory("ClickHandler", () => click);
        return fragment;
    });
    const Component = () => {
        const di = useDI();
        return (
            <div>
                <button onClick={di.ClickHandler}>Click Me!</button>
            </div>
        );
    };

    const element = mount(<Provider><Component /></Provider>);
    element.find("button").simulate("click");
    expect(click).toHaveBeenCalled();
});

it(" it uses the props if the DI context is not defined", () => {
    const click = jest.fn();
    const Component = (props: { di: any }) => {
        const di = useDI(props.di);
        return (
            <div>
                <button onClick={di.ClickHandler}>Click Me!</button>
            </div>
        );
    };

    const element = mount(<Component di={{ ClickHandler: click }} />);
    element.find("button").simulate("click");
    expect(click).toHaveBeenCalled();
});

it("it merges the props together", () => {
    const click = jest.fn();
    const click2 = jest.fn();
    const Provider = getProviderElement((fragment) => {
        fragment.factory("ClickHandler2", () => click2);
        return fragment;
    });
    const Component = (props: { di: any }) => {
        const di = useDI(props.di);
        return (
            <div>
                <button className="one" onClick={di.ClickHandler}>Click Me!</button>
                <button className="two" onClick={di.ClickHandler2}>Click Me!</button>
            </div>
        );
    };

    const element = mount(<Provider><Component di={{ ClickHandler: click }} /></Provider>);
    element.find("button.one").simulate("click");
    expect(click).toHaveBeenCalled();
    element.find("button.two").simulate("click");
    expect(click).toHaveBeenCalled();
});
