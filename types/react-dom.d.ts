/**
 * Minimal ambient declaration for react-dom in production builds.
 * @types/react-dom only ships as a devDependency, but `next build` runs
 * TypeScript against the full tree — without this, importing `useFormStatus`
 * from 'react-dom' fails type-checking in the Docker image.
 */
declare module "react-dom" {
  import type { Dispatch, SetStateAction } from "react";

  export function useFormStatus(): { pending: boolean; data?: FormData; method?: string; action?: unknown };
  export function flushSync<R>(fn: () => R): R;
  export function createPortal(
    children: React.ReactNode,
    container: Element | DocumentFragment,
    key?: React.Key,
  ): React.ReactPortal;
}
