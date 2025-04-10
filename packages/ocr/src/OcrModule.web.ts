import { registerWebModule, NativeModule } from 'expo';

import { OcrModuleEvents } from './OcrModule.types';

class OcrModule extends NativeModule<OcrModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(OcrModule);
