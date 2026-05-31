# GitHub 업로드 가이드

수익화 컨텐츠 마스터즈를 GitHub에 올려서 어디서나 접속하는 URL을 만드는 방법.

---

## 1단계: GitHub 계정

이미 있으시면 패스. 없으시면:

1. https://github.com 접속
2. **Sign up** 클릭
3. 이메일/비밀번호/사용자 이름 입력
4. 이메일 인증

---

## 2단계: 새 저장소 만들기

1. GitHub 로그인 → 우측 상단 **+** 아이콘 → **New repository**
2. 입력:
   - **Repository name**: `monetize-content-masters` (또는 원하는 이름)
   - **Description**: (선택) "수익화 컨텐츠 마스터즈"
   - **Public** 선택 (GitHub Pages는 무료 계정 Public만 가능)
   - **Add a README file**: ✅ 체크
3. **Create repository** 클릭

---

## 3단계: 파일 업로드

1. 만들어진 저장소 페이지로 이동
2. 가운데 **Add file** → **Upload files** 클릭
3. 이 폴더의 모든 파일을 드래그 (또는 `choose your files`)
   - `index.html`
   - `README.md`
   - `GITHUB_UPLOAD_GUIDE.md` (선택)
4. 하단 **Commit changes** 클릭

---

## 4단계: GitHub Pages 활성화

1. 저장소 페이지 상단 메뉴에서 **Settings** 클릭
2. 좌측 메뉴에서 **Pages** 클릭
3. **Source** 섹션:
   - **Branch**: `main` 선택
   - **Folder**: `/ (root)` 선택
   - **Save** 클릭
4. 1-2분 기다린 후 페이지 새로고침
5. 상단에 URL이 표시됨:
   ```
   https://<사용자명>.github.io/monetize-content-masters/
   ```

---

## 5단계: 첫 접속

1. 위 URL을 브라우저에서 열기
2. 로그인 화면이 나옴
3. 우측 상단 ⚙ → 관리자 비밀번호 입력
4. 새 코드 생성:
   - 수강생 이름: 본인 이름
   - 사용 기간: 평생
   - 코드 생성하기 🔥
5. 발급된 코드를 복사 (예: `3K7P9X`)
6. 뒤로 → 코드 입력 → 비밀번호 설정 → 시작

---

## 업데이트는 어떻게?

수정된 새 `index.html`을 받으면:

1. 저장소 페이지 → 기존 `index.html` 클릭
2. 우측 상단 연필 아이콘 (✏️) 클릭
3. 기존 내용 다 지우기 → 새 내용 붙여넣기
4. 하단 **Commit changes** 클릭
5. 1-2분 후 새 버전이 URL에 반영됨

또는 더 간단히:

1. 기존 `index.html` 삭제
2. 새 `index.html` 업로드

---

## 주의사항

- **public** 저장소이므로 코드를 누구나 볼 수 있음. 수강생 비밀번호는 SHA-256으로 해시되지만, 관리자 비밀번호는 코드 안에 평문으로 들어있어서 개발자 도구로 보면 노출됨. 나중에 Supabase 도입 시 진짜 보안 확보.
- 데이터는 각 브라우저에 저장됨. 한 브라우저에서만 사용 권장.
- 수강생이 별도 PC/모바일에서 접속하면 자기 브라우저에 따로 저장됨 (다른 데이터).
- **진짜 다중 사용자 + 클라우드 데이터**는 다음 단계 (Supabase) 작업.

---

## 다음 단계 (예정)

1. Supabase 가입 + DB 스키마 설정
2. 모든 localStorage → Supabase 호출로 교체
3. 진짜 인증 + 데이터 sync
4. 모바일 + PC 동일 데이터
