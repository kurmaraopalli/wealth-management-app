import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import EquitiesScreen from './src/screens/EquitiesScreen';
import MutualFundsScreen from './src/screens/MutualFundsScreen';
import DebtFundsScreen from './src/screens/DebtFundsScreen';
import GlobalIndexesScreen from './src/screens/GlobalIndexesScreen';
import ForeignPortfolioScreen from './src/screens/ForeignPortfolioScreen';
import AboutScreen from './src/screens/AboutScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? '#1f2937' : '#6b7280', fontSize: 12 }}>
                {route.name}
              </Text>
            ),
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 4,
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Equities" component={EquitiesScreen} />
          <Tab.Screen name="Mutual Funds" component={MutualFundsScreen} />
          <Tab.Screen name="Debt Funds" component={DebtFundsScreen} />
          <Tab.Screen name="Global Indexes" component={GlobalIndexesScreen} />
          <Tab.Screen name="Foreign Portfolio" component={ForeignPortfolioScreen} />
          <Tab.Screen name="About" component={AboutScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
