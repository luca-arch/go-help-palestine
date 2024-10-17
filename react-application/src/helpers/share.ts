// ShareLinks' section ID.
export const SECTION_ID = "share-me-please";

// Action to scroll down to the share section.
export const scrollToSharedLinks = (e: React.MouseEvent) => {
  e.preventDefault();

  document.getElementById(SECTION_ID)?.scrollIntoView({
    behavior: "smooth",
  });
};

// Wraoper for `AbortSignal.timeout()` (not supported by every browser).
export const getAbortSignalTimeout = (
  seconds: number,
): AbortSignal | undefined => {
  if ("AbortSignal" in window === false) {
    return undefined;
  }

  if (!AbortSignal.timeout) {
    return undefined;
  }

  return AbortSignal.timeout(seconds * 1000);
};
