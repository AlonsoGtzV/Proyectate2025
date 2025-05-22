import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen"; 
import SplashScreen from "./screens/SplashScreen"; 
import LanguageSelectionScreen from "./screens/LanguageSelectionScreen";
import SpecialtySelectionScreen from "./screens/SpecialtySelectionScreen";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen"; 
import ChatBot from "./screens/ChatBot";
import Support from "./screens/Support";
import Syllabus from "./screens/Syllabus";
import ProgressScreen from "./screens/ProgressScreen";
import { TutorialProvider } from "./screens/TutorialContext";
import { ThemeProvider } from "./screens/ThemeContext"; 
import { LanguageProvider } from "./screens/LanguageContext";
import EnglishLevelSelection from "./screens/EnglishLevelSelection";
import {TokenProvider} from "./TokenContext";

const Stack = createStackNavigator();

export default function App() {
  return (
      <TokenProvider>
	    <LanguageProvider>
          <ThemeProvider>
	        <TutorialProvider>
		      <NavigationContainer>
		        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
			      <Stack.Screen name="Splash" component={SplashScreen} />
			      <Stack.Screen name="Login" component={LoginScreen} />
			      <Stack.Screen name="Register" component={RegisterScreen} />
			      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
			      <Stack.Screen name="SpecialtySelection" component={SpecialtySelectionScreen} />
			      <Stack.Screen name="Level" component={EnglishLevelSelection} />
			      <Stack.Screen name="Home" component={HomeScreen} />
			      <Stack.Screen name="User" component={UserScreen} />
			      <Stack.Screen name="ChatBot" component={ChatBot} />
			      <Stack.Screen name="Support" component={Support} />
                  <Stack.Screen name="Syllabus" component={Syllabus} />
			      <Stack.Screen name="Progress" component={ProgressScreen} />
		        </Stack.Navigator>
		      </NavigationContainer>
	        </TutorialProvider>
	      </ThemeProvider>
	    </LanguageProvider>
      </TokenProvider>
  );
}