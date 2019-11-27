import ReactBottle from "../lib/container";
import { IContainer } from "bottlejs";

it("Can create a new container", () => {
  let di = new ReactBottle();
  expect(di).toBeDefined();

  di = new ReactBottle();
  expect(di).toBeDefined();
});

it("can use bottle functions", () => {
  const di = new ReactBottle();

  expect(di.constant).toBeDefined();
  expect(() => di.constant("Something", "value")).not.toThrow();
  expect(di.constant).toBeDefined();
  expect(di.container.Something).toBeDefined();
  expect(di.container.Something).toEqual("value");

  expect(di.factory).toBeDefined();
  expect(di.middleware).toBeDefined();
  expect(di.service).toBeDefined();

  di.factory("factory", (container: IContainer) => {
    expect(container.Something).toBeDefined();
    expect(di.container.Something).toEqual("value");
    return {
      some: "Value",
    };
  });

  expect(di.container.factory).toBeDefined();
});

it("sets up the context properly", () => {
  const di = new ReactBottle();

  expect(di.getContext()).toBeDefined();
  expect(di.getConsumer()).toBeDefined();
});
