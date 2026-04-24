from fastapi import APIRouter, HTTPException
from backend.models.schemas import ConvertRequest, ConvertResponse
from backend.services.tone_converter import ToneConverter

router = APIRouter()
converter = ToneConverter()

@router.post("/convert", response_model=ConvertResponse)
async def convert_tone(request: ConvertRequest):
    try:
        converted_text = await converter.convert(
            text=request.text, 
            target_audience=request.target_audience
        )
        return ConvertResponse(
            converted_text=converted_text,
            target_audience=request.target_audience,
            original_text=request.text
        )
    except Exception as e:
        # 실제 운영 환경에서는 로그를 남기고 사용자에게는 간결한 메시지 전달
        raise HTTPException(status_code=500, detail=f"말투 변환 중 오류가 발생했습니다: {str(e)}")
