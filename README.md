# kefir.handle

Adapts the generic `withHandler(handler)` format to work more like the syntax `observe(observer)`.

## Installation

### NPM

```
npm install kefir.handle
```

## Usage

A handler is an object with 3 optional methods:

- `value` - called when the source observable emits a value
- `error` - called when the source observable emits an error
- `end` - called when the source observable has ended

Each of these handlers are invoked wit three arguments: an emitter, the value of the event, and an event object. Pleasen note, by defaultan `undefined` handler will automatically re-emit events of that type. If you want to throw away events, you can use the exported `throwaway` helper:

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

The _actual_ event is available for each handler as the third argument.
