import { animate, stagger, createTimeline } from "animejs";

export { animate, stagger, createTimeline };

export type AnimeInstance = ReturnType<typeof animate>;

export function cleanupAnimation(instance: AnimeInstance | null | undefined) {
  if (instance && typeof instance.pause === "function") {
    instance.pause();
  }
}
