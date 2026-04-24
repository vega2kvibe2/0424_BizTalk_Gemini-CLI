import os
from dotenv import load_dotenv
from langchain_upstage import ChatUpstage
from langchain_core.prompts import ChatPromptTemplate
from backend.prompts.templates import PROMPTS

# 환경 변수 로드
load_dotenv()

class ToneConverter:
    def __init__(self):
        # API 키 확인
        api_key = os.getenv("UPSTAGE_API_KEY")
        if not api_key:
            raise ValueError("UPSTAGE_API_KEY가 설정되지 않았습니다.")
        
        # ChatUpstage 초기화 (solar-pro2 모델 사용)
        self.llm = ChatUpstage(model="solar-pro2", upstage_api_key=api_key)

    async def convert(self, text: str, target_audience: str) -> str:
        # 대상에 맞는 시스템 프롬프트 선택 (기본값은 team)
        system_message = PROMPTS.get(target_audience, PROMPTS["team"])
        
        # 프롬프트 템플릿 구성
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_message),
            ("user", "{text}")
        ])
        
        # 체인 생성 및 실행
        chain = prompt | self.llm
        response = await chain.ainvoke({"text": text})
        
        return response.content
