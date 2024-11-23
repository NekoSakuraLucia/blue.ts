import { Player } from "../Blue";
/**
 * Class to handle player events
 */
declare class PlayerEvent {
    /**
     * Player instance
     */
    private player;
    /**
     * Constructor
     */
    constructor(player: Player);
    /**
     * Handle TrackStart event
     */
    TrackStartEvent(player: Player, track: any, payload: any): unknown | void;
    /**
     * Handle TrackEnd event
     */
    TrackEndEvent(player: Player, track: any, payload: any): unknown | void | Player;
    /**
     * Handle TrackStuck event
     */
    TrackStuckEvent(player: Player, track: any, payload: any): unknown | void;
    /**
     * Handle TrackException event
     */
    TrackExceptionEvent(player: Player, track: any, payload: any): unknown | void;
    /**
     * Handle WebSocketClosed event
     */
    WebSocketClosedEvent(player: Player, payload: {
        code: number;
    }): void;
}
export default PlayerEvent;
