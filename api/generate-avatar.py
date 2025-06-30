from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from generate_avatar import generate_avatar
import uvicorn

app = FastAPI()

class AvatarRequest(BaseModel):
    description: str

@app.post("/api/generate-avatar")
async def generate_avatar_endpoint(request: AvatarRequest):
    result = generate_avatar(request.description)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
