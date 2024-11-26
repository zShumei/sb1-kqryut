import { message as Message, Modal } from 'ant-design-vue';
import { ConfigProps } from 'ant-design-vue/lib/message';

export function useMessage() {
  return {
    createMessage: {
      success(content: string, duration?: number) {
        Message.success(content, duration);
      },
      error(content: string, duration?: number) {
        Message.error(content, duration);
      },
      info(content: string, duration?: number) {
        Message.info(content, duration);
      },
      warning(content: string, duration?: number) {
        Message.warning(content, duration);
      },
    },
  };
}