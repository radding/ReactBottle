import Bottle, { IContainer } from "bottlejs";
import React from "react";

export default class ReactBottle extends Bottle {
  private _context: React.Context<any>;

  constructor(name?: string) {
    super(name);
    this._context = React.createContext({});
    this._context.displayName = "React DI";
  }

  public getContext(): React.ProviderExoticComponent<any> {
    return this._context.Provider;
  }

  public getConsumer(): React.ExoticComponent<any> {
    return this._context.Consumer;
  }
}
