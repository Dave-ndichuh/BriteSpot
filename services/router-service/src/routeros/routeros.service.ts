import { Injectable, Logger } from '@nestjs/common';
import { RouterOSAPI } from 'node-routeros';

@Injectable()
export class RouterosService {
  private readonly logger = new Logger(RouterosService.name);

  /**
   * Establishes a connection to a MikroTik Router.
   */
  private async connect(host: string, user: string, password?: string): Promise<RouterOSAPI> {
    this.logger.log(`Connecting to RouterOS at ${host}...`);
    const conn = new RouterOSAPI({ host, user, password: password || '' });
    
    return new Promise((resolve, reject) => {
      conn.connect()
        .then(() => resolve(conn))
        .catch((err) => {
          this.logger.error(`Failed to connect to ${host}: ${err.message}`);
          reject(err);
        });
    });
  }

  /**
   * Adds a new Hotspot user on the router.
   */
  async addHotspotUser(
    routerParams: { host: string; user: string; password?: string },
    userParams: { name: string; password?: string; profile?: string; limitUptime?: string }
  ) {
    const conn = await this.connect(routerParams.host, routerParams.user, routerParams.password);
    try {
      this.logger.log(`Adding hotspot user ${userParams.name} to router ${routerParams.host}`);
      
      const args = [`=name=${userParams.name}`];
      if (userParams.password) args.push(`=password=${userParams.password}`);
      if (userParams.profile) args.push(`=profile=${userParams.profile}`);
      if (userParams.limitUptime) args.push(`=limit-uptime=${userParams.limitUptime}`);

      const response = await conn.write('/ip/hotspot/user/add', args);
      return response;
    } finally {
      conn.close();
    }
  }

  /**
   * Fetches all active hotspot sessions from the router.
   */
  async getActiveSessions(routerParams: { host: string; user: string; password?: string }) {
    const conn = await this.connect(routerParams.host, routerParams.user, routerParams.password);
    try {
      this.logger.log(`Fetching active hotspot sessions from ${routerParams.host}`);
      const response = await conn.write('/ip/hotspot/active/print');
      return response;
    } finally {
      conn.close();
    }
  }

  /**
   * Removes an active hotspot session, effectively disconnecting the user.
   */
  async removeActiveSession(
    routerParams: { host: string; user: string; password?: string },
    sessionId: string
  ) {
    const conn = await this.connect(routerParams.host, routerParams.user, routerParams.password);
    try {
      this.logger.log(`Removing active session ${sessionId} from ${routerParams.host}`);
      const response = await conn.write('/ip/hotspot/active/remove', [`=.id=${sessionId}`]);
      return response;
    } finally {
      conn.close();
    }
  }
}
