// Sidebar utility functions
let toggleSidebarFunction: (() => void) | null = null;

export const toggleSidebar = (): void => {
  if (toggleSidebarFunction) {
    toggleSidebarFunction();
  }
};

export const setToggleSidebarFunction = (fn: (() => void) | null) => {
  toggleSidebarFunction = fn;
};
