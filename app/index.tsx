import { Pressable, Text, View } from "react-native";
import { recognizeText, type OCRResult } from "@hamza/ocr";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function Index() {
  const [ocrResult, setOcrResult] = useState<OCRResult[]>([]);

  const scan = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const imagePath = result.assets[0].uri.replace("file://", "");
        const resultRecongnazion = await recognizeText(imagePath, {
          languageHints: ["ar", "en"],
        });

        resultRecongnazion.forEach((item, index) => {
          console.log(
            `[${index + 1}] ${item.text} (${Math.round(
              item.confidence * 100
            )}%)`
          );
        });

        setOcrResult(resultRecongnazion);
        console.log("📄 OCR Result:", resultRecongnazion);
      } catch (e) {
        console.log("❌ OCR Error:", e);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Pressable onPress={scan}>
        <Text style={{ fontSize: 18 }}>📸 Pick Image and Scan Text</Text>
      </Pressable>

      {ocrResult.map((line, idx) => (
        <Text key={idx}>
          {idx + 1}. {line.text} ({Math.round(line.confidence * 100)}%)
        </Text>
      ))}
    </View>
  );
}
