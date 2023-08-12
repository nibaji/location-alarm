import { useState } from "react";
import { registerRootComponent } from "expo";
import { PaperProvider } from "react-native-paper";

import App from "./App";

import { AppContext, initialAppState } from "./src/context/appContext";

import { dark } from "./src/styles/paperTheme";

const PaperApp = () => {
	const [theme, setTheme] = useState(dark);
	const [currentLocation, setCurrentLocation] = useState(null);

	const value = {
		...initialAppState,
		theme,
		setTheme,
		currentLocation,
		setCurrentLocation,
	};

	return (
		<AppContext.Provider value={value}>
			<PaperProvider theme={value.theme}>
				<App />
			</PaperProvider>
		</AppContext.Provider>
	);
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(PaperApp);
