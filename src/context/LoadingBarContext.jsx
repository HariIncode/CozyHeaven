import { createContext, useContext } from "react";

// Exposes the loading bar ref to any component
const LoadingBarContext = createContext(null);

export const useLoadingBar = () => useContext(LoadingBarContext);

export default LoadingBarContext;