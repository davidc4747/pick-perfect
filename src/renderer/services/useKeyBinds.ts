import { useEffect } from "react";

export function useKeyBinds(
    binds: Record<KeyboardEvent["key"], (e: KeyboardEvent) => void>
) {
    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (binds[e.key]) binds[e.key](e);
        }

        document.addEventListener("keyup", handleKeyPress);
        return () => document.removeEventListener("keyup", handleKeyPress);
    }, [binds]);
}
