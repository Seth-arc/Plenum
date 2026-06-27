import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// Entry used by the Remotion CLI (`npm run video:render` / `video:studio`).
registerRoot(RemotionRoot);
