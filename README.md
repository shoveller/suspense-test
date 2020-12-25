<Suspense />의 활용을 테스트하기위해 만든 예제입니다.  
- `<ErrorBoundary />` 는 getDerivedStateFromError 라는 static 메서드를 구현한 컴퍼넌트입니다.  
`<ErrorBoundary />` 는 하위 컴퍼넌트가 예외를 발생시키면 fallback을 로드합니다.  

- `<Suspense />` 는 promise를 catch 하는 컴퍼넌트입니다.   
  `<Suspense />` 는 하위 컴퍼넌트가 promise를 throw 하면 fallback을 로드합니다.
  
- promise를 throw할 수 있으려면 fetch를 wrap 하는 코드가 필요합니다.  
구현체로는 react-cache와 realy, SWR이 있는데, react-fetch는 16.8 버전에서만 정상적으로 동작합니다.

