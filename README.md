# kefir.handle

Adapts the generic `withHandler(handler)` format to work more like the syntax `observe(observer)`.

## Installation

### NPM

```
npm install kefir.handle
```

## Usage

```js
import handle from 'kefir.handle';

stream.withHandler(handle({
  value(emitter, value, event) { /* ...do stuff... */ },
  error(emitter, value, event) { /* ...do stuff... */ },
  end(emitter, value, event)   { /* ...do stuff... */ },
}));
```

A handler is an object with 3 optional methods:

- `value` - called when the source observable emits a value
- `error` - called when the source observable emits an error
- `end` - called when the source observable has ended

Each of these handlers are invoked with three arguments: an emitter, the value of the event, and an event object. Please note, an `undefined` handler will _automatically_ re-emit events of that type. This is _the opposite_ of the way that `Kefir.withHandler()` works. If you _want_ to discard events, you can use the exported `throwaway` helper:

```js
import handle, { throwaway } from 'kefir.handle';

stream.withHandler(handle({
  value: throwaway,
  error: throwaway,
  end:   throwaway,
}));
```

Converting the [`withHandler()`](https://rpominov.github.io/kefir/#with-handler) example from the [Kefir.js](https://rpominov.github.io/kefir/) documentation.

```js
import Kefir from 'kefir';
import handle from 'kefir.handle';

var source = Kefir.sequentially(100, [0, 1, 2, 3]);
var result = source.withHandler(handle({
    value(emitter, value) {
      for (var i = 0; i < value; i++) {
        emitter.emit(value);
      }
    },
    end(emitter) {
      emitter.emit('bye');
      emitter.end();
    },
  }));

result.log();
```

```
> [sequentially.withHandler] <value> 1
> [sequentially.withHandler] <value> 2
> [sequentially.withHandler] <value> 2
> [sequentially.withHandler] <value> 3
> [sequentially.withHandler] <value> 3
> [sequentially.withHandler] <value> 3
> [sequentially.withHandler] <value> bye
> [sequentially.withHandler] <end>
```

```
source:  ---0---1--- 2---  3 X
result:  -------•---••---••••X
                1   22   333bye
```


By default, kefir.handle will pass-through _all_ events directly.

```js
import Kefir from 'kefir';
import handle from 'kefir.handle';

var source = Kefir.sequentially(100, [0, 1, 2, 3]);
var result = source .withHandler(handler());

result.log();
```

```
> [sequentially.withHandler] <value> 1
> [sequentially.withHandler] <value> 2
> [sequentially.withHandler] <value> 3
> [sequentially.withHandler] <end>
```

```
source:  ---0---1----2-----3X
result:  -------•----•-----•X
                1    2     3
```
