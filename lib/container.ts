import Bottle from "bottlejs";
import React, { useContext } from "react";

export default class ReactBottle extends Bottle {
  private context: React.Context<any>;

  constructor(name?: string) {
    super(name);
    this.context = React.createContext({});
    this.context.displayName = "React DI";
  }

  public getContext(): React.ProviderExoticComponent<any> {
    return this.context.Provider;
  }

  public getConsumer(): React.ExoticComponent<any> {
    return this.context.Consumer;
  }

  public getHook() {
    return useContext(this.context);
  }
}
