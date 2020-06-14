import { Injectable } from "@piros/ioc";
import { WsAuthService, Session } from "@piros/tssf";
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import * as http from "http";

@Injectable
export class GvAuthService extends WsAuthService {

  private authServerHost: string = process.env.AUTH_SERVER_HOST;
  private authServerPort: number = <any>process.env.AUTH_SERVER_PORT;

  constructor() {
    super();
  }

  public authWithToken(authToken: string): Observable<Session> {
    return new Observable(obs => {
      const data = JSON.stringify({
        authToken: authToken
      });

      const options = {
        hostname: this.authServerHost,
        port: this.authServerPort,
        path: '/login-with-token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }

      const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
          if (res.statusCode === 200) {
            obs.next({
              id: uuid.v4(),
              authToken: authToken,
              user: { id: JSON.parse(d.toString()) }
            });
            obs.complete();
          } else {
            obs.error(JSON.parse(d.toString()));
          }
        })
      })

      req.on('error', (error) => {
        obs.error(error);
      })

      req.write(data);
      req.end();
    });
  }

  public login(username: string, password: string, authToken: string): Observable<Session> {
    return new Observable(obs => {

      const data = JSON.stringify({
        username: username,
        password: password,
        authToken: authToken
      });

      const options = {
        hostname: this.authServerHost,
        port: this.authServerPort,
        path: '/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }

      const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
          if (res.statusCode === 200) {
            obs.next({
              id: uuid.v4(),
              authToken: authToken,
              user: { id: JSON.parse(d.toString()) }
            });
            obs.complete();
          } else {
            obs.error(JSON.parse(d.toString()));
          }
        })
      })

      req.on('error', (error) => {
        obs.error(error);
      })

      req.write(data);
      req.end();


    });
  }

}
