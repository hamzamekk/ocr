import ExpoModulesCore
import Vision
import UIKit

public class OcrModule: Module {
  public func definition() -> ModuleDefinition {
    Name("OcrModule")

    OnCreate {
      print("🔥 OcrModule loaded ✅")
    }

  AsyncFunction("recognizeText") { (imagePath: String, options: OCRInputOptions) async throws -> [[String: Any]] in
  guard let image = UIImage(contentsOfFile: imagePath), let cgImage = image.cgImage else {
    throw Exception(name: "image_error", description: "Could not load image.")
  }

  let request = VNRecognizeTextRequest()
  request.recognitionLevel = options.recognitionLevel == "fast" ? .fast : .accurate
  request.usesLanguageCorrection = options.useLanguageCorrection
  if let hints = options.languageHints {
    request.recognitionLanguages = hints
  }
  if let minHeight = options.minimumTextHeight {
    request.minimumTextHeight = Float(minHeight)
  }
  if let words = options.customWords, #available(iOS 16.0, *) {
    request.customWords = words
  }

  let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
  try handler.perform([request])

  let results = (request.results as? [VNRecognizedTextObservation] ?? []).compactMap { obs -> [String: Any]? in
    guard let top = obs.topCandidates(1).first else { return nil }
    return [
      "text": top.string,
      "confidence": top.confidence,
      "boundingBox": [
        "x": obs.boundingBox.origin.x,
        "y": obs.boundingBox.origin.y,
        "width": obs.boundingBox.size.width,
        "height": obs.boundingBox.size.height
      ]
    ]
  }

  return results
}


  }
}

struct OCRInputOptions: Record {
  @Field var languageHints: [String]?
  @Field var useLanguageCorrection: Bool = true
  @Field var recognitionLevel: String = "accurate"
  @Field var minimumTextHeight: Double?
  @Field var customWords: [String]?
}
