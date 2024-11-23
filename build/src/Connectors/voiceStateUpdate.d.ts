import "../Utils/Color";
import { Blue } from "./Node";
/**
 * Guild options interface
 */
interface GuildOptions {
    session_id: string;
    channel_id: string | null;
    guild_id: string;
    self_mute: boolean;
    self_deaf: boolean;
}
interface VoiceStateUpdate {
    user_id: string;
    guild_id: string;
    channel_id: string;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
}
interface VoiceServerUpdate {
    guild_id: string;
    endpoint: string;
    token: string;
}
export interface ApiPacket {
    t: string;
    d: VoiceStateUpdate | VoiceServerUpdate;
}
/**
 * Voice update class
 */
declare class VoiceUpdate {
    /**
     * Instance of the blue client
     */
    readonly blue: Blue;
    /**
     * Voice details
     */
    voice: {
        sessionId: string | null;
        token: string | null;
        endpoint: string | null;
    };
    /**
     * Channel ID
     */
    channelId: string | null;
    /**
     * Guild ID
     */
    guildId: string | null;
    /**
     * Muted flag
     */
    muted: boolean | null;
    /**
     * Deafened flag
     */
    defeaned: boolean | null;
    /**
     * Region
     */
    readonly region?: string | null;
    constructor(blue: Blue);
    private isVoiceStateUpdate;
    /**
     * Update voice function
     * @param packet - Packet data
     * @returns Returns true if successful, otherwise false
     */
    updateVoice(packet: ApiPacket): Promise<boolean | void>;
    /**
     * Set server state update
     * @param guildData - Guild options data
     */
    setServerStateUpdate(guildData: GuildOptions): void;
    /**
     * Set voice state update
     * @param data - Voice state data
     */
    setVoiceStateUpdate(data: any): void;
}
export default VoiceUpdate;
