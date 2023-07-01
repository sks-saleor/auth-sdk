import EventPubSub from "@z1data/pubsub";

class PubSub extends EventPubSub {
  addListener(eventName: string, callback: any): any {
    const events = super.on(eventName, callback);
    return { remove: () => events.off(eventName, callback) };
  }

  emit(eventName: string, ...args: any): any {
    super.emit(eventName, ...args);
  }
}

export default new PubSub();
