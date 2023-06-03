import { useEffect } from "react";

export function useKeyPress(handleKeyPress: (e: KeyboardEvent) => void) {
    useEffect(() => {
        document.addEventListener("keyup", handleKeyPress);
        return () => document.removeEventListener("keyup", handleKeyPress);
    }, [handleKeyPress]);
}
