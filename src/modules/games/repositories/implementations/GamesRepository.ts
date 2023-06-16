import { getRepository, ILike, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("games.title ILIKE :title", {
        title: `%${param}%`,
      })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) AS count FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const usersByGameIdFounded = await this.repository
      .createQueryBuilder("games")
      .innerJoin("games.users", "users")
      .where("games.id = :id", { id })
      .select(["email", "first_name", "last_name"])
      .getRawMany();

    return usersByGameIdFounded;
  }
}
