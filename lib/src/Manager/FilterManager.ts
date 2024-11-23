import { Player } from "../Blue";

/**
 * Configuration for each band in the equalizer
 */
export interface BandConfiguration {
    band: number;
    gain: number;
}

/**
 * Settings for karaoke effect
 */
export interface KaraokeSettings {
    level: number;
    monoLevel: number;
    filter: BandConfiguration;
    filterWidth: number;
}

/**
 * Settings for time scaling
 */
export interface TimeScaler {
    speed?: number;
    pitch?: number;
    rate?: number;
}

/**
 * Settings for tremolo effect
 */
export interface TremoloSettings {
    frequency: number;
    depth: number;
}

/**
 * Settings for vibrato effect
 */
export interface VibratoSettings {
    frequency: number;
    depth: number;
}

/**
 * Settings for rotation effect
 */
export interface RotationSettings {
    rotationHz: number;
}

/**
 * Settings for distortion effect
 */
export interface DistortionSettings {
    sinOffset?: number;
    sinScale?: number;
    cosOffset?: number;
    cosScale?: number;
    tanOffset?: number;
    tanScale?: number;
    offset?: number;
    scale?: number;
}

/**
 * Mixer settings for channel
 */
export interface ChannelMixer {
    leftToLeft?: number;
    leftToRight?: number;
    rightToLeft?: number;
    rightToRight?: number;
}

/**
 * Low pass filter settings
 */
export interface LowPassFilter {
    smoothing: number;
}

/**
 * Options for various filters
 */
export interface FilterOptions {
    volume: number;
    equalizer: BandConfiguration[];
    karaoke: KaraokeSettings;
    tremolo: TremoloSettings;
    vibrato: VibratoSettings;
    rotation: RotationSettings;
    distortion: DistortionSettings;
    channelMix: ChannelMixer;
    lowPass: LowPassFilter;
    timeScaler: TimeScaler;
}

/**
 * FilterManager class
 */
class FilterManager {
    /**
     * Player instance
     */
    public player: Player;

    /**
     * Volume level
     */
    public volume: number;

    /**
     * Equalizer configuration
     */
    public equalizer: BandConfiguration[];

    /**
     * Karaoke settings
     */
    public karaoke: KaraokeSettings;

    /**
     * Tremolo settings
     */
    public tremolo: TremoloSettings;

    /**
     * Vibrato settings
     */
    public vibrato: VibratoSettings;

    /**
     * Rotation settings
     */
    public rotation: RotationSettings;

    /**
     * Distortion settings
     */
    public distortion: DistortionSettings;

    /**
     * Channel mixer settings
     */
    public channelMix: ChannelMixer;

    /**
     * Low pass filter settings
     */
    public lowPass: LowPassFilter;

    /**
     * Time scaler settings
     */
    public timescale: TimeScaler;

    /**
     * Vaporwave effect status
     */
    public vaporwave: boolean;

    /**
     * Bass boost level
     */
    public bassboost: number;

    /**
     * 8D effect status
     */
    public is8D: boolean;

    /**
     * Nightcore effect status
     */
    public nightcore: boolean;

    constructor(player: Player, options?: FilterOptions) {
        this.player = player;
        this.volume = 1.0;
        this.vaporwave = false;
        this.equalizer = [];
        this.nightcore = false;
        this.is8D = false;
        this.bassboost = 0;
        this.karaoke = options?.karaoke || null;
        this.timescale = options?.timeScaler || null;
        this.tremolo = options?.tremolo || null;
        this.vibrato = options?.vibrato || null;
        this.rotation = options?.rotation || null;
        this.distortion = options?.distortion || null;
        this.channelMix = options?.channelMix || null;
        this.lowPass = options?.lowPass || null;
    }

    /**
     * Set equalizer bands
     * @param bands - Array of BandConfiguration
     * @returns FilterManager instance
     */
    public setEqualizer(bands: BandConfiguration[]): FilterManager {
        this.equalizer = bands;
        this.updateFilters();
        return this;
    }

    /**
     * Set karaoke settings
     * @param settings - KaraokeSettings
     * @returns FilterManager instance
     */
    public setKaraoke(settings?: KaraokeSettings): FilterManager {
        this.karaoke = settings || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set time scaler settings
     * @param scaler - TimeScaler
     * @returns FilterManager instance
     */
    public setTimeScaler(scaler?: TimeScaler): FilterManager {
        this.timescale = scaler || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set tremolo settings
     * @param settings - TremoloSettings
     * @returns FilterManager instance
     */
    public setTremolo(settings?: TremoloSettings): FilterManager {
        this.tremolo = settings || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set nightcore effect
     * @param val - Nightcore status
     * @returns Nightcore status
     */
    setNightcore(val: boolean) {
        if (!this.player) return;
        this.nightcore = val;

        this.setTimescale(val ? { speed: 1.2, pitch: 1.2, rate: 1 } : null);
        if (val) {
            this.vaporwave = false;
        }
        return this.nightcore;
    }

    /**
     * Set BassBoost effect
     * @param val - BassBoost status
     * @returns BassBoost status
     */
    setBassBoost(val: boolean) {
        if (!this.player) return;
        this.bassboost = val ? 1 : 0;
        if (val) {
            this.setEqualizer([
                { band: 0, gain: 0.8 },  // 60Hz - เพิ่มเบสเล็กน้อย (Add a little bass)
                { band: 1, gain: 0.5 },  // 150Hz - เพิ่มเบสเล็กน้อย (Add a little bass)
                { band: 2, gain: 0.2 },  // 400Hz - เพิ่มเบสเล็กน้อย (Add a little bass)
                { band: 3, gain: 0.0 },  // 1kHz (ไม่เพิ่ม) (no increase)
                { band: 4, gain: 0.0 },  // 2.4kHz (ไม่เพิ่ม) (no increase)
                { band: 5, gain: 0.0 },  // 6kHz (ไม่เพิ่ม) (no increase)
                { band: 6, gain: 0.0 },  // 12kHz (ไม่เพิ่ม) (no increase)
                { band: 7, gain: 0.0 },  // 14kHz (ไม่เพิ่ม) (no increase)
            ])
        } else {
            this.setEqualizer([]);
        }

        return this.bassboost;
    }

    /**
     * Set time scale settings
     * @param timescale - TimeScaler
     * @returns FilterManager instance
     */
    public setTimescale(timescale?: TimeScaler): FilterManager {
        this.timescale = timescale || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set vibrato settings
     * @param settings - VibratoSettings
     * @returns FilterManager instance
     */
    public setVibrato(settings?: VibratoSettings): FilterManager {
        this.vibrato = settings || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set rotation settings
     * @param settings - RotationSettings
     * @returns FilterManager instance
     */
    public setRotation(settings?: RotationSettings): FilterManager {
        this.rotation = settings || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set distortion settings
     * @param settings - DistortionSettings
     * @returns FilterManager instance
     */
    public setDistortion(settings?: DistortionSettings): FilterManager {
        this.distortion = settings || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set channel mix settings
     * @param mixer - ChannelMixer
     * @returns FilterManager instance
     */
    public setChannelMix(mixer?: ChannelMixer): FilterManager {
        this.channelMix = mixer || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set low pass filter settings
     * @param filter - LowPassFilter
     * @returns FilterManager instance
     */
    public setLowPass(filter?: LowPassFilter): FilterManager {
        this.lowPass = filter || null;
        this.updateFilters();
        return this;
    }

    /**
     * Set 8D effect
     * @param val - 8D status
     * @returns 8D status
     */
    public set8D(val: boolean) {
        if (!this.player) return;
        this.setRotation(val ? { rotationHz: 0.065 } : null);
        this.is8D = val;
        return this;
    }

    /**
     * Clear all filters
     * @returns FilterManager instance
     */
    public clearFilters(): FilterManager {
        this.vaporwave = false;
        this.equalizer = [];
        this.nightcore = false;
        this.is8D = false;
        this.bassboost = 0;
        this.karaoke = null;
        this.timescale = null;
        this.tremolo = null;
        this.vibrato = null;
        this.rotation = null;
        this.distortion = null;
        this.channelMix = null;
        this.lowPass = null;
        this.updateFilters();
        return this;
    }

    /**
     * Update filters
     */
    public updateFilters(): void {
        if (!this.player || !this.player.blue || !this.player.blue.node || !this.player.blue.node.rest || !this.player.guildId) {
            throw new Error("Player or its properties are not properly initialized.");
        }

        const filters: Record<string, any> = {
            volume: this.volume,
            equalizer: this.equalizer.length > 0 ? this.equalizer : undefined,
            karaoke: this.karaoke || undefined,
            timescale: this.timescale || undefined,
            tremolo: this.tremolo || undefined,
            vibrato: this.vibrato || undefined,
            rotation: this.rotation || undefined,
            distortion: this.distortion || undefined,
            channelMix: this.channelMix || undefined,
            lowPass: this.lowPass || undefined,
        };
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // ลบค่าที่เป็น undefined
        this.player.blue.node.rest.updatePlayer({
            guildId: this.player.guildId,
            data: { filters },
        });
    }
}

export default FilterManager;
