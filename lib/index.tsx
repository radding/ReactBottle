import React from "react";
import ReactBottle from "./container";
import { IContainer } from "bottlejs";

export type DIFragment = (container: ReactBottle) => ReactBottle;

export let diContainer: ReactBottle | null = null;

export const createDiContainer = (name?: string): ReactBottle => {
    return new ReactBottle(name);
};

export const getProviderElement = (...fragments: DIFragment[]): React.FunctionComponent<any> => {
    if (diContainer === null) {
        diContainer = createDiContainer();
    }
    diContainer = fragments.reduce((acc, fragment) => fragment(acc), diContainer);
    const Provider = diContainer.getContext();

    return ({ children }) => (
        <Provider value={diContainer!.container} >
            {children}
        </Provider>
    );
};

export type DIMapper = (container: IContainer) => { [key: string]: any };

export const wireUpDi = (
    mapDiToProps?: DIMapper,
) => (Component: React.ComponentType<any>): React.ComponentType<any> => {
    return (props: any) => {
        if (diContainer === null) {
            // tslint:disable-next-line
            console.warn("Di Container was never loaded. Call getProviderElement or createDiContainer to load one.");
            return <Component {...props} />;
        }
        if (!mapDiToProps) {
            mapDiToProps = (_: IContainer) => ({});
        }
        const Consumer = diContainer!.getConsumer();
        return (
            <Consumer>
                {(container: IContainer) => {
                    return <Component di={container} {...mapDiToProps!(container)} {...props} />;
                }}
            </Consumer>
        );
    };
};

export const useDI = (override: any = {}) => {
    if (!diContainer) {
        return override;
    }
    const context = diContainer.getHook();
    return {
        ...context,
        ...override,
    };
};

export const deleteContainer = () => diContainer = null;
export { ReactBottle };
