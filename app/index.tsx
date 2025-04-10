import { Pressable, Text, View, ScrollView } from "react-native";
import { recognizeText, type OCRResult } from "@hamza/ocr";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function Index() {
  const [lines, setLines] = useState<string[]>([]);

  const scan = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const imagePath = result.assets[0].uri.replace("file://", "");
        const resultRecongnazion = await recognizeText(imagePath, {
          languageHints: ["ar", "en"],
        });

        const groupedLines = groupByLine(resultRecongnazion);
        const fullLines = groupedLines.map((line) =>
          line.map((item) => item.text).join(" ")
        );

        console.log("📄 Grouped lines:", fullLines);
        setLines(fullLines);
      } catch (e) {
        console.log("❌ OCR Error:", e);
      }
    }
  };

  function groupByLine(results: OCRResult[], threshold = 0.015) {
    const lines: Record<string, OCRResult[]> = {};

    results.forEach((item) => {
      const y = item.boundingBox.y;
      const key = Object.keys(lines).find(
        (lineY) => Math.abs(Number(lineY) - y) < threshold
      );

      if (key) {
        lines[key].push(item);
      } else {
        lines[y] = [item];
      }
    });

    return Object.values(lines)
      .map((line) => line.sort((a, b) => a.boundingBox.x - b.boundingBox.x))
      .sort((a, b) => a[0].boundingBox.y - b[0].boundingBox.y);
  }

  return (
    <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 20 }}>
      <Pressable
        onPress={scan}
        style={{
          backgroundColor: "#111",
          padding: 12,
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
          📸 Pick Image and Scan Text
        </Text>
      </Pressable>

      <ScrollView>
        {lines.map((line, idx) => (
          <Text key={idx} style={{ fontSize: 16, marginVertical: 4 }}>
            {idx + 1}. {line}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}
