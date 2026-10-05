/**
 * Guest Identity Utility
 * Manages persistent guest_id in browser localStorage.
 * Ensures the same guest identity is maintained across page refreshes,
 * navigation, and browser restarts without requiring customer login.
 */

export const getGuestId = () => {
  try {
    let guestId = localStorage.getItem('guest_id');
    if (guestId && guestId.trim()) {
      return guestId.trim();
    }

    // Generate new UUID-based guest_id if not present
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      guestId = crypto.randomUUID();
    } else {
      // Fallback RFC4122 compliant UUID v4 generator
      guestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    localStorage.setItem('guest_id', guestId);
    return guestId;
  } catch (e) {
    console.error('Failed to access localStorage for guest_id:', e);
    return 'guest_temp_' + Math.random().toString(36).substring(2, 10);
  }
};
