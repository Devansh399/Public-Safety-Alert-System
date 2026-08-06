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

    return {

        "detectedClass": "Road Accident",

        "confidence": 0.94,

        "severity": "HIGH"

    }