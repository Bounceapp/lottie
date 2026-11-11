import { LottieView } from "@bounceapp/lottie"
import { type ComponentRef, useRef, useState } from "react"
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native"

import lottieAnimation from "./lottieAnimation.json"
import splashScreen from "./splash-screen.json"

const animations = {
  "Lottie logo": lottieAnimation,
  "Splash screen": splashScreen,
}
type AnimationName = keyof typeof animations

const speeds = [0.5, 1, 2]

export default function App() {
  const ref = useRef<ComponentRef<typeof LottieView>>(null)
  const [name, setName] = useState<AnimationName>("Lottie logo")
  const [loop, setLoop] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [log, setLog] = useState<string[]>([])

  const append = (entry: string) =>
    setLog(previous => [
      `${new Date().toLocaleTimeString()}  ${entry}`,
      ...previous.slice(0, 7),
    ])

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>@bounceapp/lottie</Text>

        <View style={styles.row}>
          {(Object.keys(animations) as AnimationName[]).map(option => (
            <Chip
              key={option}
              label={option}
              selected={option === name}
              onPress={() => setName(option)}
            />
          ))}
        </View>

        <View style={styles.stage}>
          <LottieView
            key={name}
            ref={ref}
            source={animations[name]}
            autoPlay
            loop={loop}
            speed={speed}
            style={{ width: 240, height: 240 }}
            testID="lottie"
            onAnimationLoaded={() => append("loaded")}
            onAnimationLoop={() => append("loop")}
            onAnimationFinish={isCancelled =>
              append(`finish (cancelled: ${isCancelled})`)
            }
            onAnimationFailure={error => append(`failure: ${error}`)}
          />
        </View>

        <View style={styles.row}>
          <Chip label="Play" onPress={() => ref.current?.play()} />
          <Chip label="Pause" onPress={() => ref.current?.pause()} />
          <Chip label="Resume" onPress={() => ref.current?.resume()} />
          <Chip label="Reset" onPress={() => ref.current?.reset()} />
        </View>

        <View style={styles.row}>
          {speeds.map(option => (
            <Chip
              key={option}
              label={`${option}×`}
              selected={option === speed}
              onPress={() => setSpeed(option)}
            />
          ))}
        </View>

        <View style={styles.row}>
          <Text>Loop</Text>
          <Switch value={loop} onValueChange={setLoop} />
        </View>

        <View style={styles.log}>
          <Text style={styles.logTitle}>Events</Text>
          {log.map((entry, index) => (
            <Text key={`${index}-${entry}`} style={styles.logEntry}>
              {entry}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type ChipProps = {
  label: string
  selected?: boolean
  onPress: () => void
}

const Chip = ({ label, selected, onPress }: ChipProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}>
    <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
      {label}
    </Text>
  </Pressable>
)

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: {
    alignItems: "center",
    alignSelf: "center",
    gap: 16,
    padding: 24,
    width: "100%",
    maxWidth: 480,
  },
  title: { fontSize: 20, fontWeight: "600" },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  stage: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#f4f4f5",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d4d4d8",
  },
  chipSelected: { backgroundColor: "#18181b", borderColor: "#18181b" },
  chipLabel: { color: "#18181b" },
  chipLabelSelected: { color: "#fff" },
  log: { alignSelf: "stretch", gap: 4 },
  logTitle: { fontWeight: "600" },
  logEntry: { fontFamily: "monospace", fontSize: 12, color: "#52525b" },
})
