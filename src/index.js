export const throwaway = () => {}
export const passthrough = (emitter, value, event) => { emitter.event(event); };

export default
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
