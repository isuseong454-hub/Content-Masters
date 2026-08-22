// 컨마 v2 스모크 — 콘솔에서: const s=await fetch('/_smoke2.js?x=1').then(x=>x.text()); await (0,eval)(s)
(async function(){
  const R=[];const ok=(n,c)=>R.push((c?'🟢':'🔴')+' '+n);
  // 1) 핵심 함수 존재
  ['checkCode','doLogin','enterRoom','goTab','addCard','quickAdd','openBunhae','saveBunhae','openSort','pickCat',
   'saveObs','savePillars','openMimic','saveMimic','openConv','saveConv','saveCustomer','saveProduct','pinVal','wirePin','doLogout',
   'loadWall','postWall','render','buildDock','esc','sha256'].forEach(f=>ok('함수 '+f,(()=>{try{return typeof eval(f)==='function'}catch(e){return false}})()));
  // 2) 격 테이블 — 방 4 + 도크 6
  ok('격 테이블 방 4개',typeof GYEOK!=='undefined'&&['basic','mid','master','community'].every(r=>GYEOK[r]));
  ok('도크 6칸(3방)',['basic','mid','master'].every(r=>GYEOK[r].dock.length===6));
  ok('마스터즈 4번칸=공식 서재',GYEOK.master.dock[3]==='공식 서재');
  // 3) esc가 마크업을 지키는지 (글자만 보는 함정 방지)
  ok('esc 이스케이프',esc('<b x="y">')==='&lt;b x=&quot;y&quot;&gt;');
  // 4) 로그인 상태면 방 전환 + 각 탭 렌더에서 예외 0
  if(window.AUTH){
    let err=0;const bak=JSON.stringify(S);
    try{
      S.cards.push({id:'smk',url:'u',why:'w',ts:Date.now(),stage:2,cat:null,notes:{hook:'h',frame:'f',why:'y'}});
      (S.works=S.works||[]).push({cardId:'smk',frame:'f',hook:'훅',body:'본문',ts:Date.now(),conv:null});
      for(const r of ['basic','mid','master']){enterRoom(r);for(let i=0;i<6;i++){try{goTab(i)}catch(e){err++;console.warn(r,i,e)}}}
      enterRoom('community');
    }catch(e){err++;console.warn(e)}
    S=Object.assign(S,JSON.parse(bak));S.cards=JSON.parse(bak).cards;S.works=JSON.parse(bak).works;goFork();
    ok('전 방 × 전 탭 렌더 예외 0',err===0);
    // 5) 서버 왕복
    try{const r=await rpc('cm2_get',{p_code:AUTH.code,p_pin_hash:AUTH.pinHash});ok('cm2_get 응답',r&&r.ok)}catch(e){ok('cm2_get 응답',false)}
    try{const r=await rpc('cm2_wall_get',{p_code:AUTH.code,p_pin_hash:AUTH.pinHash});ok('담벼락 응답',r&&r.ok)}catch(e){ok('담벼락 응답',false)}
  }else R.push('⚪ 로그인 전 — 4·5번은 로그인 뒤 다시');
  const bad=R.filter(x=>x.startsWith('🔴')).length;
  console.log(R.join('\n')+'\n'+(bad?('🔴 '+bad+'개 실패'):'🟢 전부 통과 ('+R.length+'항목)'));
  return {report:R,bad};
})();
