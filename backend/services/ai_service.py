import os
import json
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Initialize the modern SDK client once globally
client = genai.Client(http_options={'api_version': 'v1'})

FABRIC_ANALYSIS_PROMPT = """
You are a textile quality control expert with 20 years of experience analyzing fabric samples.

Analyze this fabric image and return ONLY a valid JSON object with exactly these fields:

{
  "fabric_type": "string — e.g. Cotton Twill, Polyester Blend, Denim, Linen, Silk Satin",
  "thread_density": integer — estimated threads per square inch,
  "warp_count": integer — estimated warp threads per inch (lengthwise),
  "weft_count": integer — estimated weft threads per inch (crosswise),
  "confidence_score": float between 0 and 100,
  "ai_suggestions": "2-3 sentences about fabric quality, suitable uses, and any visible defects or characteristics"
}

Base your analysis on:
- Visible weave pattern (plain, twill, satin, etc.)
- Thread thickness and regularity
- Surface texture and sheen
- Color and dye uniformity
- Any visible defects, pilling, or irregularities

Return ONLY the JSON object. No markdown, no explanation, no backticks.
""".strip()

async def analyze_fabric_image(image_bytes: bytes, mime_type: str) -> dict:
    # 1. Properly format the image using the new SDK's types system
    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type=mime_type
    )

    # 2. Call the generation endpoint directly via the global client instance
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[FABRIC_ANALYSIS_PROMPT, image_part]
    )
    
    raw = response.text.strip()

    # Strip markdown code fences if Gemini adds them despite instructions
    raw = re.sub(r"```json|```", "", raw).strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        # Fallback with honest values rather than crashing
        result = {
            "fabric_type": "Unknown",
            "thread_density": 0,
            "warp_count": 0,
            "weft_count": 0,
            "confidence_score": 0,
            "ai_suggestions": "Analysis could not be completed. Please try a clearer, well-lit photo."
        }

    # Clamp confidence to 0-100 in case the model returns something odd
    result["confidence_score"] = max(0, min(100, float(result.get("confidence_score", 0))))
    return result