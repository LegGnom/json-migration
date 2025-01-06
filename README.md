## Simple usage

```typescript
const enigne = new Migration();

engine.input({ num: 1 });

engine.version(1).up((data) => ({ ...data, str: "add props" }));

console.log(engine.data);
// return {num: 1, str: 'add props'}

console.log(engine.get());
// return {__meta: {version: 1, updated_at: '2025-01-06T00:01:46.170Z'}, __data: {num: 1, str: 'add props'}}
```
