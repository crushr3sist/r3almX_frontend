import { RefObject, useEffect } from "react";

export const useScrollManagement = (
  scrollRef: RefObject<HTMLUListElement>,
  messageHIstory: MessageEvent<string>[]
) => {
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messageHIstory, scrollRef]);
};
