interface WakeLock {
  request(type: WakeLockType): Promise<WakeLockSentinel>;
}

interface WakeLockSentinel {
  release(): Promise<void>;
  readonly onrelease: EventHandlerNonNull;
  readonly WakeLocktype: WakeLockType;
  addEventListener(event:string, callback: EventListenerOrEventListenerObject, options? : any );
  removeEventListener(event:string, callback: EventListenerOrEventListenerObject, options? : any );
}

type WakeLockType = 'screen' | null;

interface NavigatorExtended extends Navigator {
  // Only available in a secure context.
  readonly wakeLock: WakeLock;
}