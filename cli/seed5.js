const http = require('http');
function cp(q, a, c) {
  return new Promise((resolve, reject) => {
    const d = JSON.stringify({ question: q, answer: a, category: c, hit: '0' });
    const r = http.request({ hostname: '192.168.0.3', port: 8080, path: '/problem', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(d) }
    }, s => { let b=''; s.on('data', x=>b+=x); s.on('end', resolve); });
    r.on('error', reject); r.write(d); r.end();
  });
}
const data = {
  21: [
    ["함수형 반응형 프로그래밍(FRP)", "시간에 따라 변하는 값을 함수형으로 다루는 패러다임"],
    ["신호(Signal)", "FRP에서 시간에 따라 변하는 값"],
    ["이벤트 스트림(Event Stream)", "시간 순서로 발생하는 이벤트의 흐름"],
    ["배압(Backpressure)", "데이터 처리 속도 차이를 조절하는 메커니즘"],
    ["방출(Emission)", "스트림에서 데이터를 내보내는 동작"],
    ["구독(Subscription)", "스트림의 데이터를 소비하는 동작"],
    ["변환(Transformation)", "스트림 데이터를 가공하는 연산"],
    ["필터(Filter)", "조건에 맞는 데이터만 통과시키는 연산"],
    ["병합(Merge)", "여러 스트림을 하나로 합치는 연산"],
    ["분할(Split)", "하나의 스트림을 여러 개로 나누는 연산"],
    ["버퍼(Buffer)", "스트림 데이터를 일정 단위로 모으는 연산"],
    ["윈도우(Window)", "스트림 데이터를 시간 또는 개수로 분할하는 연산"],
    ["스로틀링(Throttling)", "이벤트 발생 빈도를 제한하는 기법"],
    ["디바운싱(Debouncing)", "연속된 이벤트 중 마지막 이벤트만 처리하는 기법"],
    ["샘플링(Sampling)", "일정 간격으로 데이터를 추출하는 기법"],
    ["에러 처리(Error Handling)", "스트림에서 발생하는 에러를 처리하는 방법"],
    ["재시도(Retry)", "스트림 에러 발생 시 재시도하는 연산"],
    ["재실행(Replay)", "과거 데이터를 다시 재생하는 연산"],
    ["캐싱(Caching)", "데이터를 임시 저장하여 성능을 향상시키는 기법"],
    ["메모이제이션(Memoization)", "함수 호출 결과를 캐싱하는 기법"],
    ["LRU 캐시", "가장 오래 사용되지 않은 항목을 제거하는 캐시 정책"],
    ["LFU 캐시", "가장 적게 사용된 항목을 제거하는 캐시 정책"],
    ["FIFO 캐시", "가장 먼저 들어온 항목을 제거하는 캐시 정책"],
    ["TTL(Time To Live)", "캐시 항목의 유효 시간"],
    ["캐시 무효화(Cache Invalidation)", "캐시를 갱신하는 과정"],
    ["캐시 스탬피드(Cache Stampede)", "동시에 여러 요청이 캐시를 갱신하는 현상"],
    ["캐시 분산(Cache Sharding)", "캐시를 여러 노드에 분산하는 기술"],
    ["분산 캐시(Distributed Cache)", "여러 노드에 걸친 캐시 시스템"],
    ["Redis", "인메모리 데이터 구조 저장소"],
    ["Memcached", "분산 메모리 캐싱 시스템"],
    ["Hazelcast", "분산 인메모리 데이터 그리드"],
    ["Apache Ignite", "분산 데이터베이스 및 캐싱 플랫폼"],
    ["아키텍처 결정 기록(ADR)", "아키텍처 결정을 문서화하는 방법"],
    ["기술 부채(Technical Debt)", "빠른 개발을 위해 감수한 품질 저하"],
    ["코드 스멜(Code Smell)", "리팩토링이 필요한 코드의 징후"],
    ["매직 넘버(Magic Number)", "의미를 알 수 없는 하드코딩된 숫자"],
    ["하드코딩(Hardcoding)", "설정 값을 코드에 직접 작성하는 방식"],
    ["죽은 코드(Dead Code)", "실행되지 않는 코드"],
    ["중복 코드(Duplicate Code)", "동일한 로직이 여러 곳에 있는 코드"],
    ["긴 메서드(Long Method)", "너무 긴 함수"],
    ["거대 클래스(God Class)", "너무 많은 책임을 가진 클래스"],
    ["과도한 매개변수(Long Parameter List)", "너무 많은 매개변수를 가진 함수"],
    ["산탄총 수술(Shotgun Surgery)", "변경 시 여러 곳을 수정해야 하는 문제"],
    ["기능 부러움(Feature Envy)", "다른 클래스의 기능을 과도하게 사용하는 현상"],
    ["데이터 클래스(Data Class)", "데이터만 저장하고 로직이 없는 클래스"],
    ["메시지 체인(Message Chain)", "연속된 메서드 호출 체인"],
    ["중재자(Middle Man)", "단순히 다른 객체에 위임만 하는 클래스"],
    ["부적절한 친밀(Inappropriate Intimacy)", "다른 클래스의 내부에 과도하게 접근하는 현상"],
    ["느린 쿼리(Slow Query)", "성능이 느린 데이터베이스 쿼리"],
    ["N+1 쿼리 문제", "연관 관계에서 발생하는 과도한 쿼리 문제"],
    ["추측적 일반성(Speculative Generality)", "미래를 대비한 과도한 추상화"],
    ["임시 필드(Temporary Field)", "특정 상황에서만 사용되는 필드"],
    ["래퍼 클래스(Wrapper Class)", "다른 클래스를 감싸는 클래스"],
    ["게터/세터 남용", "불필요하게 많은 getter/setter"],
    ["null 체인(null 체크)", "연속된 null 검사"],
    ["예외 처리 남용", "예외를 부적절하게 사용하는 패턴"],
    ["하드코딩된 설정", "설정 값을 코드에 직접 작성하는 방식"],
    ["전역 상태(Global State)", "전역 변수를 통한 상태 공유"],
    ["사이드 이펙트(Side Effect)", "함수의 부수 효과"],
    ["명령형 프로그래밍(Imperative)", "어떻게 할지를 명시하는 패러다임"],
    ["선언형 프로그래밍(Declarative)", "무엇을 할지를 명시하는 패러다임"],
    ["프로그래밍 패러다임(Programming Paradigm)", "프로그래밍의 접근 방식과 사고 체계"],
    ["절차적 프로그래밍(Procedural)", "절차 단위로 구성하는 패러다임"],
    ["논리 프로그래밍(Logic Programming)", "논리식으로 프로그램을 표현하는 패러다임"],
    ["제약 프로그래밍(Constraint Programming)", "제약 조건으로 문제를 표현하는 패러다임"],
    ["동시성 프로그래밍(Concurrent)", "여러 작업을 동시에 처리하는 패러다임"],
    ["병렬 프로그래밍(Parallel)", "여러 작업을 물리적으로 동시에 실행하는 패러다임"],
    ["비동기 프로그래밍(Asynchronous)", "작업 완료를 기다리지 않는 패러다임"],
    ["리액티브 프로그래밍(Reactive)", "데이터 흐름과 변화 전파에 중점을 둔 패러다임"],
    ["이벤트 기반 프로그래밍(Event-Driven)", "이벤트를 중심으로 하는 패러다임"],
    ["관점 지향 프로그래밍(AOP)", "관심사를 분리하는 패러다임"],
    ["제네릭 프로그래밍(Generic)", "타입을 일반화하는 프로그래밍 기법"],
    ["메타 프로그래밍(Metaprogramming)", "프로그램을 조작하는 프로그래밍"],
    ["템플릿 메타프로그래밍(TMP)", "컴파일 타임에 코드를 생성하는 C++ 기법"],
    ["매크로 프로그래밍", "코드를 생성하는 매크로를 사용하는 프로그래밍"],
    ["DSL(Domain-Specific Language)", "특정 도메인을 위한 언어"],
    ["내부 DSL(Internal DSL)", "호스트 언어 내에서 구현된 DSL"],
    ["외부 DSL(External DSL)", "독자적인 문법을 가진 DSL"],
    ["API 설계 원칙", "좋은 API를 설계하기 위한 원칙"],
    ["일관성(Consistency)", "API의 일관된 설계 원칙"],
    ["단순함(Simplicity)", "API의 단순성"],
    ["직관성(Intuitiveness)", "API의 직관적 사용성"],
    ["진화성(Evolvability)", "API가 진화할 수 있는 능력"],
    ["하위 호환성(Backward Compatibility)", "이전 버전과의 호환성"],
    ["문서화(Documentation)", "API 사용법을 문서화하는 것"],
    ["버저닝(Versioning)", "API 버전 관리"],
    ["URI 설계", "REST API의 URI 설계 원칙"],
    ["HTTP 메서드 의미론", "HTTP 메서드의 의미와 사용법"],
    ["상태 코드(Status Code)", "HTTP 응답 상태 코드"],
    ["HATEOAS", "하이퍼미디어를 통한 애플리케이션 상태 엔진"],
    ["콘텐츠 협상(Content Negotiation)", "클라이언트와 서버 간 데이터 형식 협상"],
    ["Swagger/OpenAPI", "REST API 명세 표준"],
    ["API 문서 자동화", "API 문서를 자동으로 생성하는 도구"],
    ["API 모킹(Mocking)", "API를 모방하는 가짜 서버"],
    ["API 게이트웨이 패턴", "API 요청의 단일 진입점 패턴"],
    ["BFF(Backend For Frontend)", "프론트엔드에 특화된 백엔드 패턴"],
    ["API 조합(Composition)", "여러 API를 조합하는 패턴"],
    ["API 버전 전략", "API 버전 관리 전략"],
  ],
};
async function main() {
  const existing = await new Promise(resolve => {
    http.get('http://192.168.0.3:8080/problem', res => {
      let b = ''; res.on('data', d => b += d);
      res.on('end', () => { try { resolve(JSON.parse(b).array.length); } catch(e) { resolve(0); } });
    });
  });
  const needed = 10000 - existing;
  console.log(`현재: ${existing}개, 목표: 10000개, 부족: ${needed}개`);
  let total = 0; let c21 = 0;
  for (const [name, def] of data[21]) {
    await cp(name, def, 21); total++; c21++;
    await cp(`${name}이란?`, `${name} 은/는 ${def}`, 21); total++; c21++;
    if (total >= needed) break;
  }
  const final = await new Promise(resolve => {
    http.get('http://192.168.0.3:8080/problem', res => {
      let b = ''; res.on('data', d => b += d);
      res.on('end', () => { try { resolve(JSON.parse(b).array.length); } catch(e) { resolve(0); } });
    });
  });
  console.log(`완료: 기존 ${existing}개 + 신규 ${total}개 = 총 ${final}개`);
}
main().catch(console.error);
