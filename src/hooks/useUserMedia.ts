"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface UserMedia {
  media_type: 'movie' | 'tv' | 'anime' | 'game' | 'book';
  media_id: string;
  title: string;
  cover_url?: string;
  rating?: number;
  status: 'planned' | 'watching' | 'completed' | 'dropped';
  is_favorite: boolean;
}

const LOCAL_STORAGE_KEY = "user_entertainment_catalog";

export function useUserMedia() {
  const [mediaList, setMediaList] = useState<UserMedia[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted) setUser(user);

      if (user) {
        await syncLocalToSupabase(user.id);
        await fetchSupabaseMedia(user.id);
      } else {
        loadLocalMedia();
      }
      if (isMounted) setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user || null);
        if (session?.user) {
          syncLocalToSupabase(session.user.id).then(() => fetchSupabaseMedia(session.user.id));
        } else {
          loadLocalMedia();
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadLocalMedia = () => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) setMediaList(JSON.parse(data));
      else setMediaList([]);
    } catch (e) {
      console.error(e);
      setMediaList([]);
    }
  };

  const fetchSupabaseMedia = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_media')
      .select('*')
      .eq('user_id', userId);
    
    if (!error && data) {
      setMediaList(data as UserMedia[]);
    }
  };

  const syncLocalToSupabase = async (userId: string) => {
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!localData) return;
      
      const localItems: UserMedia[] = JSON.parse(localData);
      if (localItems.length === 0) return;

      const { data: existingData } = await supabase
        .from('user_media')
        .select('media_type, media_id')
        .eq('user_id', userId);
        
      const existingSet = new Set((existingData || []).map(d => `${d.media_type}-${d.media_id}`));
      
      const toInsert = localItems.filter(item => !existingSet.has(`${item.media_type}-${item.media_id}`)).map(item => ({
        ...item,
        user_id: userId
      }));

      if (toInsert.length > 0) {
        await supabase.from('user_media').insert(toInsert);
      }

      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to sync to Supabase', e);
    }
  };

  const updateMedia = async (mediaItem: Partial<UserMedia> & { media_type: string, media_id: string }) => {
    let existingIndex = mediaList.findIndex(m => m.media_id === mediaItem.media_id && m.media_type === mediaItem.media_type);
    let newList = [...mediaList];
    let updatedItem: UserMedia;

    if (existingIndex >= 0) {
      updatedItem = { ...newList[existingIndex], ...mediaItem };
      newList[existingIndex] = updatedItem;
    } else {
      updatedItem = {
        title: mediaItem.title || 'Unknown',
        status: 'planned',
        is_favorite: false,
        ...mediaItem
      } as UserMedia;
      newList.push(updatedItem);
    }
    
    setMediaList(newList);

    if (user) {
      await supabase.from('user_media').upsert({
        user_id: user.id,
        ...updatedItem,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, media_type, media_id' });
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
    }
  };

  const getMedia = (media_type: string, media_id: string) => {
    return mediaList.find(m => m.media_id === media_id && m.media_type === media_type);
  };

  const toggleFavorite = async (media_type: 'movie' | 'tv' | 'anime' | 'game' | 'book', media_id: string, metadata: { title: string, cover_url?: string }) => {
    const current = getMedia(media_type, media_id);
    const newFav = !(current?.is_favorite);
    await updateMedia({
      media_type,
      media_id,
      is_favorite: newFav,
      ...metadata
    });
    return newFav;
  };

  return {
    mediaList,
    loading,
    user,
    updateMedia,
    getMedia,
    toggleFavorite
  };
}
