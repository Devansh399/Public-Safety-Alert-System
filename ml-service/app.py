from fastapi import FastAPI
from pydantic import BaseModel
from ultralytics import YOLO

app = FastAPI()

model = YOLO("yolov8n.pt")

class PredictRequest(BaseModel):

    imageUrl: str

    latitude: float

    longitude: float

    description: str | None = None


@app.get("/")
def home():
    return {
        "message": "Public Safety ML Service Running"
    }
    
    
@app.post("/predict")
def predict(data: PredictRequest):
    
    results = model.predict(
    source=data.imageUrl,
    verbose=False
)

    result = results[0]

    if len(result.boxes) == 0:
        return {
            "detectedClass": "Unknown",
            "confidence": 0.0,
            "severity": "LOW"
        }

    box = result.boxes[0]

    class_id = int(box.cls.item())

    detected_class = result.names[class_id]

    confidence = float(box.conf.item())

    if detected_class in ["car", "bus", "truck"]:
        severity = "HIGH"
    elif detected_class in ["motorcycle", "bicycle"]:
        severity = "MEDIUM"
    else:
        severity = "LOW"

    return {
        "detectedClass": detected_class,
        "confidence": confidence,
        "severity": severity
    }