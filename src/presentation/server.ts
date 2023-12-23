import express, { Router } from "express";
import path from "path";

interface Options {
  port: number;
  routes: Router;
  public_path: string;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor({ port, routes, public_path = "public" }: Options) {
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {
    //* Middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //* Public
    this.app.use(express.static(this.publicPath));

    //* Routes
    this.app.use(this.routes);

    //* Any route which is not defined will be here
    this.app.get("*", (req, res) => {
      const indexPath = path.join(
        __dirname + `../../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);
    });

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
