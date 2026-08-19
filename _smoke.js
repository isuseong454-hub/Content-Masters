/* ══════════════════════════════════════════════════════════════
   🚨 배포 전 자동 점검 (스모크 테스트) — 컨텐츠 마스터즈
   쓰는 법: 프리뷰(localhost:5173)를 로그인 상태로 띄우고 이 파일 전체를 실행.
            결과가 표로 나오고, 빨간 줄이 하나라도 있으면 배포하지 않는다.
   설계: «오늘 실제로 터진 사고»를 항목으로 만든다. 사고가 나면 여기 한 줄 추가.
   ⚠️ 읽기만 한다 — 어떤 데이터도 만들거나 지우지 않는다(안전).
   ══════════════════════════════════════════════════════════════ */
(async function smoke() {
  const R = [];   // {name, ok, msg, level}
  const add = (name, ok, msg, level) => R.push({ name, ok: !!ok, msg: msg || '', level: level || 'err' });
  const vis = el => { if (!el) return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const src = (() => { let t = ''; for (const s of document.scripts) if ((s.text || '').length > t.length) t = s.text; return t; })();

  // ── 1. 문법 — 스크립트가 통째로 죽는 사고(v767) ──
  try { new Function(src); add('스크립트 문법', true, (src.length / 1024 / 1024).toFixed(2) + 'MB 파싱 OK'); }
  catch (e) { add('스크립트 문법', false, String(e.message).slice(0, 80)); }

  // ── 2. 필수 함수 정의 — 삭제하다 같이 잘리는 사고(v766→767) ──
  const FN = ['gwanjeomMessage', 'cmMark', 'csParse', 'csSaveToWarehouse', 'saveRows', 'rowHasContent',
    'plnEnsureEp', 'plwContiHtml', 'cntRoomHtml', 'myaDxHtml', 'termsGate', 'slvOpen', 'openContentShop',
    // v775 · 🎵 음악 서랍 — 담기(빠른담기)·보기(분류방)·편 연결이 한 몸이라 하나만 잘려도 끊긴다
    'musParse', 'musAdd', 'musBodyHtml', 'musBoardRender', 'musEpRowHtml',
    // v778 · 🏋️ 트레이닝실 — 무대·게임·기록이 한 몸이라 하나만 잘려도 훈련이 끊긴다
    'tgsOpen', 'tgsStageHtml', 'tgsPaint', 'tgsMakeQ', 'tgsGameStart', 'tgsFinish'];
  const missFn = FN.filter(f => src.indexOf('function ' + f) < 0);
  add('필수 함수 정의', !missFn.length, missFn.length ? '사라짐: ' + missFn.join(', ') : FN.length + '개 모두 존재');

  // ── 3. 필수 버튼·칸 — 마크업에서 실종되는 사고(v771 저장 버튼) ──
  const IDS = ['cso-paste', 'cso-go', 'cso-save', 'cso-row', 'cs-room', 'slv',
    'room-rail', 'settings-modal', 'settings-export-vault-btn', 'admin-tabs', 'admin-list',
    'topbar-logout-btn', 'auth-code-input'];
  const missId = IDS.filter(i => !document.getElementById(i));
  add('필수 요소(id)', !missId.length, missId.length ? '없음: ' + missId.join(', ') : IDS.length + '개 모두 존재');

  // ── 4. 분해 파서 — 카드가 안 만들어지는 사고(v766) ──
  //     실제 UI를 건드리지 않고, 파서 입력만 시뮬레이션할 수 없으므로 소스 규칙으로 검사
  add('분해 파서 관용', src.indexOf('_sniff') > -1, '[분해] 마커 없어도 인식하는 보정 존재 여부');

  // ── 4-b. v775 · 🎵 음악 서랍 입구 — 타일/탭이 마크업에서 사라지면 담을 길이 끊긴다 ──
  const musTile = !!document.querySelector('#qsh-stage [data-qc="music"]');
  const musTab  = !!document.querySelector('[data-fbmode="music"]');
  const musSeg  = src.indexOf('data-qcseg') > -1;                       // 썸네일↔수식어 갈래 스위치
  add('🎵 음악 입구', musTile && musTab && musSeg,
    (musTile ? '' : '빠른담기 타일 없음 ') + (musTab ? '' : '분류 탭 없음 ') + (musSeg ? '' : '갈래 스위치 없음 ') || '타일·분류탭·갈래스위치 모두 존재');
  // 태그 × 삭제가 필터 클릭에 먹히던 사고(v775) — 삭제 분기가 «필터보다 먼저» 있어야 한다
  const iDel = src.indexOf("hit('data-mustagdel')"), iFlt = src.indexOf("hit('data-musflt')");
  add('태그 × 삭제 순서', iDel > -1 && iFlt > -1 && iDel < iFlt,
    (iDel > -1 && iFlt > -1 && iDel < iFlt) ? '삭제가 필터보다 먼저 — 정상' : '필터가 × 삭제를 삼킬 수 있음');

  // ── 4-c. v778 · 🏋️ 트레이닝실 입구·무대 — 마크업에서 사라지면 훈련으로 갈 길이 끊긴다 ──
  add('🏋️ 트레이닝실', !!document.getElementById('tgs-door') && !!document.getElementById('tgs'),
    (document.getElementById('tgs-door') ? '' : '입구 없음 ') + (document.getElementById('tgs') ? '' : '무대 없음 ') || '입구·무대 존재');

  // ── 4-d. v779 · 🚨 기획 ①리서치 키워드 배선 — 편이 없으면 bind를 통째로 걸러
  //         키워드 Enter도 ★ 톡도 안 먹고, 확정판 «★키워드»가 영영 비던 사고 ──
  add('키워드 바 배선(게이트 0)', src.indexOf("_pln.eps[_plnEp] || plnGhostE();\n      if (ke)") > -1,
    src.indexOf("var ke = _pln.eps[_plnEp];") > -1 ? '편이 없으면 배선을 거른다 — 새 편에서 ★이 안 박힘' : '빈 편에서도 배선됨');

  // ── 4-e. v780 · 🚨 대진 기준선 — 판(플랫폼)이 다른 것을 절대 조회수로 견주면
  //         «문장»이 아니라 «판»이 정답이 된다. 짝 만들 때 platform을 보는지 확인 ──
  add('대진 기준선(플랫폼)', src.indexOf('function tgsPairs(same)') > -1 && src.indexOf("pool.push({ t: one, v: r.views, p:") > -1,
    src.indexOf('function tgsPairs(same)') > -1 ? '같은 판끼리 우선 · 모자라면 평균 대비로' : '조회수만 보고 아무 짝이나 만든다');

  // ── 4-f. v784 · 📺 유튜브 방 — 시트가 아니라 별도 서랍(ytv1). 입구·데이터 계층이 살아 있는지 ──
  add('📺 유튜브 방', !!document.querySelector('[data-fbmode="yt"]') && src.indexOf('function ytvBoardRender') > -1,
    (document.querySelector('[data-fbmode="yt"]') ? '' : '분류 탭 없음 ') +
    (src.indexOf('function ytvBoardRender') > -1 ? '' : '보드 함수 없음 ') || '탭·보드 존재');

  // ── 4-g. 🚨 «먹통»의 진짜 조건 — 열린 오버레이는 없는데 스크롤 잠금(ov-open)만 남은 상태.
  //         이러면 화면이 멀쩡해 보여도 아무것도 안 눌리는 것처럼 느껴진다 ──
  try {
    const lock = document.body.classList.contains('ov-open');
    // ⚠️ 껍데기(#cs-fork)는 자식이 fixed라 높이가 0으로 잡힌다 → «열림» 표시 클래스로도 인정
    const openOv = ['cs-fork', 'qc-room', 'cmu-ov', 'ytv-ov', 'prp', 'sh-modal', 'tos-ov', 'cs-room']
      .map(id => document.getElementById(id))
      .filter(el => el && (el.classList.contains('show') || el.classList.contains('on') || vis(el))).length;
    add('스크롤 잠금 잔류', !(lock && !openOv),
      lock ? (openOv ? '잠김 · 열린 화면 ' + openOv + '개 — 정상' : '🚨 열린 화면이 없는데 잠금만 남음') : '잠금 없음');
  } catch (e) {}

  // ── 4-h. 🚨🚨 v791 · MutationObserver 자기 물기 — 감시 대상 «안»의 글자를 조건 없이 바꾸면
  //         콜백 → 변경 → 콜백 … 무한 루프로 브라우저가 통째로 얼어붙는다.
  //         (v774 #qc-back 라벨이 그랬다 — «빠르게 담기 누르면 먹통»의 진범)
  add('옵서버 무한 루프', src.indexOf("if (b.textContent === want) return;") > -1,
    src.indexOf("if (b.textContent === want) return;") > -1
      ? '값이 같으면 안 쓴다 — 자기 발화 차단됨'
      : '🚨 qc-back 라벨 옵서버가 조건 없이 textContent를 쓴다');

  // ── 5. CSS 이름 충돌 — 신호등이 부풀던 사고(v773) ──
  const shortCls = [];
  try {
    const seen = {};
    for (const sh of document.styleSheets) {
      let rules; try { rules = sh.cssRules; } catch (e) { continue; }
      for (const r of rules || []) {
        const sel = r.selectorText; if (!sel) continue;
        sel.split(',').forEach(one => {
          const m = one.trim().match(/^\.([a-z0-9-]{1,3})$/i);   // .s3 처럼 «너무 짧은 전역 클래스»
          if (m) { seen[m[1]] = (seen[m[1]] || 0) + 1; }
        });
      }
    }
    Object.keys(seen).forEach(k => shortCls.push('.' + k));
  } catch (e) {}
  add('짧은 전역 CSS 이름', !shortCls.length, shortCls.length ? '충돌 위험: ' + shortCls.join(' ') : '없음', 'warn');

  // ── 6. 화면 넘침 — 폰에서 가로로 새는 사고 ──
  const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  add('가로 넘침', over <= 1, over > 1 ? over + 'px 넘침' : '0px');

  // ── 7. 로그인 상태·데이터 무결 ──
  const auth = window.__cmAuth || {};
  add('로그인', !!auth.code, auth.code ? auth.code + ' 로그인됨' : '로그인 후 다시 실행하세요');
  if (auth.code) {
    try {
      const r = await window.storage.get('shv4-rows');
      const rows = r && r.value ? JSON.parse(r.value) : [];
      const empty = rows.filter(x => !String(x.hook || '').trim() && !String(x.url || '').trim() && !(x.views | 0)).length;
      add('시트 빈 줄 오염', empty === 0, empty ? '빈 줄 ' + empty + '개가 서버에 저장돼 있음' : rows.length + '행 · 빈 줄 0');
      const noScript = rows.filter(x => (x.scriptSections && Object.keys(x.scriptSections).length) && !(x.scriptSecFlex || []).length).length;
      add('원고 라벨 보존', noScript === 0, noScript ? noScript + '행이 옛 5칸으로만 저장됨(원고 안 보일 수 있음)' : '이상 없음', 'warn');
    } catch (e) { add('시트 읽기', false, String(e).slice(0, 60)); }
    try {
      const t = await window.storage.get('cm-terms-agree');
      add('약관 동의(계정)', !!(t && t.value), t && t.value ? '계정에 기록됨 — 기기 바뀌어도 안 뜸' : '계정 기록 없음(재동의 뜰 수 있음)', 'warn');
    } catch (e) {}
  }

  // ── 8. 내비 통일 — 왼쪽 위는 «‹ 갈림길» 하나 ──
  try {
    const rail = document.getElementById('room-rail');
    const shown = rail ? [...rail.querySelectorAll('.rr-btn')].filter(vis) : [];
    // 손질·분해처럼 «전체 화면을 덮는 방»에선 레일이 가려진다 — 그건 정상이므로 경고로만
    if (!shown.length) add('내비 통일', false, '지금 화면이 레일을 덮고 있음(전체 화면 방이면 정상)', 'warn');
    else add('내비 통일', shown.length === 1 && /갈림길/.test(shown[0].textContent),
      shown.map(b => b.textContent.trim()).join(' / '));
  } catch (e) {}

  // ── 9. 설정 다이어트 — 없앤 것이 되살아나지 않았나 ──
  const GONE = ['settings-export-btn', 'settings-import-input', 'settings-room-btn', 'settings-trash-btn', 'settings-logout-btn'];
  const back = GONE.filter(i => document.getElementById(i));
  add('설정 군더더기', !back.length, back.length ? '되살아남: ' + back.join(', ') : '없음');

  // ── 10. 폐기된 것 — 다시 나타나지 않았나 ──
  add('폐기 확인(캐릭터·1억뷰·라이벌)',
    src.indexOf("function gwanjeomSvg(size, level, mood) { return ''; }") > -1 &&
    src.indexOf('«1억 뷰의 세계» 전면 폐기') > -1 && !document.getElementById('cp-rival'),
    '캐릭터 스텁 · 1억뷰 차단 · 라이벌 입구 제거');

  /* ── 결과 출력 ── */
  const bad = R.filter(x => !x.ok && x.level !== 'warn');
  const warn = R.filter(x => !x.ok && x.level === 'warn');
  const line = x => (x.ok ? '✅' : x.level === 'warn' ? '⚠️' : '❌') + ' ' + x.name + (x.msg ? ' — ' + x.msg : '');
  const report = R.map(line).join('\n');
  console.log('%c🚨 배포 전 자동 점검', 'font-size:15px;font-weight:900');
  console.log(report);
  console.log(bad.length ? '%c⛔ 배포 금지 — 빨간 줄 ' + bad.length + '개' : '%c✅ 배포 가능' + (warn.length ? ' (경고 ' + warn.length + ')' : ''),
    'font-size:14px;font-weight:900;color:' + (bad.length ? '#E0564B' : '#9BE8B4'));
  return { verdict: bad.length ? 'BLOCK' : (warn.length ? 'PASS_WITH_WARN' : 'PASS'), fail: bad.length, warn: warn.length, report };
})();
