import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen"; // Asegúrate de tener esta pantalla creada
import SplashScreen from "./screens/SplashScreen"; // Asegúrate de tener esta pantalla creada
import LanguageSelectionScreen from "./screens/LanguageSelectionScreen";
import SpecialtySelectionScreen from "./screens/SpecialtySelectionScreen";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen"; // Asegúrate de tener esta pantalla creada
import ChatBot from "./screens/ChatBot";
import Support from "./screens/Support";
import Syllabus from "./screens/Syllabus";
import ProgressScreen from "./screens/ProgressScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        <Stack.Screen name="SpecialtySelection" component={SpecialtySelectionScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="ChatBot" component={ChatBot} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="Syllabus" component={Syllabus} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
