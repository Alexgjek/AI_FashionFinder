from fastapi import FastAPI
from openaiIntegration import generateResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
class Prompt(BaseModel):
    prompt: str

@app.post("/getAIResponse/")
async def getAIResponse(prompt: Prompt):

    aiResponse = generateResponse(prompt.prompt)

    return {"ai_response": aiResponse}