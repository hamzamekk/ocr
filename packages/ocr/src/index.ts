import { requireNativeModule } from "expo-modules-core";

const OcrModule = requireNativeModule("OcrModule");

export async function recognizeText(
  imagePath: string,
  options: RecognizeOptions = {}
): Promise<OCRResult[]> {
  return OcrModule.recognizeText(imagePath, options);
}

export type RecognizeOptions = {
  languageHints?: string[];
  useLanguageCorrection?: boolean;
  recognitionLevel?: "fast" | "accurate";
  minimumTextHeight?: number;
  customWords?: string[];
};

export type OCRBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OCRResult = {
  text: string;
  confidence: number;
  boundingBox: OCRBoundingBox;
};
