const API_BASE = "";

document.addEventListener('DOMContentLoaded', () => {
    const targetButtons = document.querySelectorAll('.target-btn');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const loadingOverlay = document.getElementById('loadingOverlay');

    let selectedTarget = null;

    // 1. 수신 대상 버튼 클릭 이벤트
    targetButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 기존 active 제거
            targetButtons.forEach(btn => btn.classList.remove('active'));
            // 현재 클릭된 버튼 active 추가
            button.classList.add('active');
            selectedTarget = button.dataset.target;
        });
    });

    // 2. 변환하기 버튼 클릭 이벤트
    convertBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();

        if (!text) {
            alert('변환할 내용을 입력해주세요.');
            return;
        }

        if (!selectedTarget) {
            alert('수신 대상을 선택해주세요.');
            return;
        }

        // 로딩 표시 시작
        loadingOverlay.classList.remove('hidden');
        convertBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE}/api/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    target_audience: selectedTarget
                }),
            });

            if (!response.ok) {
                throw new Error('API 호출에 실패했습니다.');
            }

            const data = await response.json();
            outputText.value = data.converted_text;
        } catch (error) {
            console.error('Error:', error);
            alert('말투 변환 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            // 로딩 표시 종료
            loadingOverlay.classList.add('hidden');
            convertBtn.disabled = false;
        }
    });

    // 3. 복사하기 버튼 클릭 이벤트
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputText.value;

        if (!textToCopy) {
            alert('복사할 내용이 없습니다.');
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('클립보드에 복사되었습니다!');
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('복사 중 오류가 발생했습니다.');
        });
    });
});
