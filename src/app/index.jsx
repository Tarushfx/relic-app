import { Redirect } from "expo-router";

const App = () => {
  // return <Redirect href="login" />;
  return <Redirect href="/(auth)/login" />;
};

export default App;
