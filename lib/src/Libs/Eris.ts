import Events from "../Utils/Events";
import { Blue } from "../Connectors/Node";
import { ApiPacket } from "../Connectors/voiceStateUpdate";

/**
 * Eris class
 */
class Eris {
  /**
   * Instance of the blue client
   */
  public blue: Blue;

  constructor(blue: Blue) {
    this.blue = blue;

    /**
     * Listen for raw WS events
     */
    this.blue.client.on("rawWS", async (packet: ApiPacket) => {
      await this.blue.voiceState.updateVoice(packet);
    });
  }

  /**
   * Send data to the guild
   * @param data - Data to be sent
   * @returns Returns a promise with the sent data
   */
  public send(data: { d: { guild_id: string }; op: string; }): any {
    try {
      if (!data) throw new Error("Parameter of 'send' must be present.");
      return new Promise((resolve, reject) => {
        if (!this.blue.client) return reject(data);
        const guild = this.blue.client.guilds.get(data.d.guild_id);
        if (guild) {
          resolve(guild);
          guild.shard.sendWS(data?.op, data?.d);
          this.blue.emit(Events.api, `[${String("DEBUG").Blue()}]: ${this.blue.options.host} ---> [${String("RECEIVED: SHARD PAYLOAD").Green()}] ---> ${String(`${JSON.stringify(data)}`).Yellow()}`);
        } else {
          reject(guild);
        }
      });
    } catch (e) {
      throw new Error("Unable to send data to the guild.");
    }
  }
}

export default Eris;
