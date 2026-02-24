/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Team, PaymentStatus, GameType } from '../types';

// Use env variables with hardcoded fallbacks for reliability
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://crgeyeycqzdaxromsohb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bfDnH1kzw4H_rtxEgz7niA_F80Inp-E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Auth Services ---
export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data.user;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const subscribeToAuth = (callback: (user: any) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
    });
    return () => subscription.unsubscribe();
};

// --- Storage Services ---
export const uploadScreenshot = async (file: File, teamName: string): Promise<string> => {
    try {
        const timestamp = Date.now();
        // Sanitize file name
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const path = `${teamName}_${timestamp}_${sanitizedName}`;

        // Upload the file
        const { error: uploadError } = await supabase.storage
            .from('screenshots')
            .upload(path, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('screenshots')
            .getPublicUrl(path);

        return publicUrl;
    } catch (error) {
        console.error("Upload failed", error);
        throw error;
    }
};

// --- Database Services ---
export const registerTeam = async (teamData: Omit<Team, 'id' | 'status' | 'timestamp'>) => {
    try {
        // Transform data to match snake_case columns
        const dbData = {
            team_name: teamData.teamName,
            game: teamData.game,
            players: teamData.players,
            substitute: teamData.substitute,
            captain_phone: teamData.captainPhone,
            captain_whatsapp: teamData.captainWhatsapp,
            payment_screenshot_url: teamData.paymentScreenshotUrl,
            status: 'Pending' // Default
        };

        const { error } = await supabase
            .from('teams')
            .insert([dbData]);

        if (error) throw error;
        return;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const getTeams = async (gameFilter?: GameType, isSuperAdmin: boolean = false): Promise<Team[]> => {
    try {
        let query = supabase
            .from('teams')
            .select('*')
            .order('created_at', { ascending: false });

        if (gameFilter) {
            query = query.eq('game', gameFilter);
        }

        if (isSuperAdmin) {
            // Super Admin sees everything EXCEPT permanently deleted
            // They can see hidden_from_admin ones
            query = query.is('permanently_deleted', false);
        } else {
            // Regular Admin sees ONLY non-hidden AND non-deleted
            query = query
                .is('hidden_from_admin', false)
                .is('permanently_deleted', false);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform snake_case back to camelCase for app usage
        return data.map((item: any) => ({
            id: item.id,
            teamName: item.team_name,
            game: item.game as GameType,
            players: item.players,
            substitute: item.substitute,
            captainPhone: item.captain_phone,
            captainWhatsapp: item.captain_whatsapp,
            paymentScreenshotUrl: item.payment_screenshot_url,
            status: item.status as PaymentStatus,
            timestamp: new Date(item.created_at).getTime(),
            hiddenFromAdmin: item.hidden_from_admin,
            permanentlyDeleted: item.permanently_deleted
        }));
    } catch (error) {
        console.error("Error fetching teams", error);
        return [];
    }
};

export const updateTeamStatus = async (teamId: string, status: PaymentStatus) => {
    try {
        const { error } = await supabase
            .from('teams')
            .update({ status })
            .eq('id', teamId);

        if (error) throw error;
    } catch (error) {
        console.error("Error updating status", error);
        throw error;
    }
};

export const deleteTeam = async (teamId: string, isSuperAdmin: boolean) => {
    try {
        const updates = isSuperAdmin
            ? { permanently_deleted: true } // Super Admin Hard Delete
            : { hidden_from_admin: true };  // Admin Soft Delete

        const { error } = await supabase
            .from('teams')
            .update(updates)
            .eq('id', teamId);

        if (error) throw error;
    } catch (error) {
        console.error("Error deleting team", error);
        throw error;
    }
};

export const restoreTeam = async (teamId: string) => {
    try {
        const { error } = await supabase
            .from('teams')
            .update({ hidden_from_admin: false })
            .eq('id', teamId);

        if (error) throw error;
    } catch (error) {
        console.error("Error restoring team", error);
        throw error;
    }
};

export const getActiveTeamCount = async (): Promise<number> => {
    try {
        const { count, error } = await supabase
            .from('teams')
            .select('*', { count: 'exact', head: true })
            .eq('hidden_from_admin', false)
            .eq('permanently_deleted', false);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error("Error fetching active team count", error);
        return 0;
    }
};
