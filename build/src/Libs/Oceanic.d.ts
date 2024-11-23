import { Blue } from "../Connectors/Node";
/**
 * OceanicJs class
 */
declare class OceanicJs {
    /**
     * Instance of the blue client
     */
    blue: Blue;
    constructor(blue: Blue);
    /**
     * Send function to send data
     * @param data - Data to send
     * @returns Promise<any>
     */
    send(data: {
        d: {
            guild_id: string;
        };
        op: string;
    }): any;
}
export default OceanicJs;
