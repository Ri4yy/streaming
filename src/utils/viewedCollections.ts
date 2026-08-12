export function markCollectionAsViewed(idOrSlug: string, altIdOrSlug?: string) {
    if (typeof window === 'undefined') return;
    try {
        const stored = localStorage.getItem('viewed_collections');
        const viewed: string[] = stored ? JSON.parse(stored) : [];
        let updated = false;

        if (idOrSlug && !viewed.includes(idOrSlug)) {
            viewed.push(idOrSlug);
            updated = true;
        }
        if (altIdOrSlug && !viewed.includes(altIdOrSlug)) {
            viewed.push(altIdOrSlug);
            updated = true;
        }

        if (updated) {
            localStorage.setItem('viewed_collections', JSON.stringify(viewed));
            window.dispatchEvent(new Event('viewedCollectionsUpdated'));
        }
    } catch (e) {
        console.error('Error marking collection as viewed:', e);
    }
}

export function checkIsCollectionViewed(idOrSlug: string, altIdOrSlug?: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const stored = localStorage.getItem('viewed_collections');
        if (!stored) return false;
        const viewed: string[] = JSON.parse(stored);
        return (idOrSlug && viewed.includes(idOrSlug)) || (altIdOrSlug ? viewed.includes(altIdOrSlug) : false);
    } catch (e) {
        return false;
    }
}
