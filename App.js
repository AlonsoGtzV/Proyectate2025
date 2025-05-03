import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen"; // Asegúrate de tener esta pantalla creada
import SplashScreen from "./screens/SplashScreen"; // Asegúrate de tener esta pantalla creada
import LanguageSelectionScreen from "./screens/LanguageSelectionScreen";
import SpecialtySelectionScreen from "./screens/SpecialtySelectionScreen";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
