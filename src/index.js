export const throwaway = () => {}
export const passthrough = (emitter, value, event) => { emitter.event(event); };

const createHandler =
  ({ value = passthrough, error = passthrough, end = passthrough } = {}) =>
  (emitter, event) => {
    switch (event.type) {
      case 'value':
        value(emitter, event.value, event);
        return;
      case 'error':
        error(emitter, event.value, event);
        return;
      case 'end':
        end(emitter, event.value, event);
        return;
      default:
        return;
    }
  };

export function handle(...args) {
  return this.withHandler(createHandler(...args));
}

export default createHandler;
