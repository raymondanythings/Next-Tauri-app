import { Center, Loader } from "@mantine/core";
export default function SplashScreen() {
  // filler
  return (
    <Center style={{ height: "100vh", width: "100vw" }}>
      <Loader size="xl" />
    </Center>
  );
}
