class Publisher {
    constructor() {
        this.eventSubscriptions = {};
    }

    subscribeToEvent(eventName, functionToCall) {
        this.eventSubscriptions[eventName] = this.eventSubscriptions[eventName] || [];
        let eventId = eventName + "_" + Math.random() * 10000 + "_" + new Date().getTime();
        this.eventSubscriptions[eventName].push({id: eventId, functionToCall: functionToCall});
        return {
            remove: () => {
                this.eventSubscriptions[eventName] = (this.eventSubscriptions[eventName] || []).filter(eventItems => eventItems.id !== eventId);
            }
        };
    }

    emitEvent(event, object) {
        let functionsToCall = this.eventSubscriptions[event] || [];
        functionsToCall.forEach(item => item.functionToCall(object));
    }

    removeEvent(event) {
        delete this.eventSubscriptions[event];
    }

    removeGivenListener(listenerItem) {
        if (listenerItem && listenerItem.remove instanceof Function) {
            listenerItem.remove();
        }
    };
}

export default new Publisher();
