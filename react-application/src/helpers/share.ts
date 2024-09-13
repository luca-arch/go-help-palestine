// ShareLinks' section ID.
export const SECTION_ID = "share-me-please";

// Action to scroll down to the share section.
export const scrollToSharedLinks = (e: React.MouseEvent) => {
  e.preventDefault();

  document.getElementById(SECTION_ID)?.scrollIntoView({
    behavior: "smooth",
  });
};
