interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadLink: string;
  category: string;
  platforms?: string;
  systemReqs?: string;
  gameSpecs?: string;
  views: number;
  createdAt: string;
}

interface GameFile {
  games: Game[];
  startId: number;
  endId: number;
  count: number;
}

interface Index {
  totalGames: number;
  filesCount: number;
  lastFileNumber: number;
  nextId: number;
  gamesPerFile: number;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'kaianime99999-prog';
const GITHUB_REPO = process.env.GITHUB_REPO || 'download_pro_games';
const GAMES_PER_FILE = 200;

class GitHubDB {
  private async githubRequest(path: string, method = 'GET', data?: any) {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok && response.status !== 404) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return response.status === 404 ? null : await response.json();
  }

  private async readFile(path: string): Promise<any> {
    try {
      const response = await this.githubRequest(path);
      if (!response) return null;
      
      const content = Buffer.from(response.content, 'base64').toString('utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading ${path}:`, error);
      return null;
    }
  }

  private async writeFile(path: string, content: any, sha?: string): Promise<void> {
    const data = {
      message: `Update ${path}`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
      ...(sha && { sha })
    };

    await this.githubRequest(path, 'PUT', data);
  }

  async getIndex(): Promise<Index> {
    const index = await this.readFile('data/index.json');
    
    if (!index) {
      const defaultIndex: Index = {
        totalGames: 0,
        filesCount: 0,
        lastFileNumber: 0,
        nextId: 1,
        gamesPerFile: GAMES_PER_FILE
      };
      await this.writeFile('data/index.json', defaultIndex);
      return defaultIndex;
    }
    
    return index;
  }

  async updateIndex(index: Index): Promise<void> {
    const current = await this.githubRequest('data/index.json');
    await this.writeFile('data/index.json', index, current?.sha);
  }

  async getGameFile(fileNumber: number): Promise<GameFile> {
    const gameFile = await this.readFile(`data/games-${fileNumber}.json`);
    
    if (!gameFile) {
      const defaultFile: GameFile = {
        games: [],
        startId: (fileNumber - 1) * GAMES_PER_FILE + 1,
        endId: fileNumber * GAMES_PER_FILE,
        count: 0
      };
      await this.writeFile(`data/games-${fileNumber}.json`, defaultFile);
      return defaultFile;
    }
    
    return gameFile;
  }

  async saveGameFile(fileNumber: number, gameFile: GameFile): Promise<void> {
    const current = await this.githubRequest(`data/games-${fileNumber}.json`);
    await this.writeFile(`data/games-${fileNumber}.json`, gameFile, current?.sha);
  }

  async addGame(gameData: Omit<Game, 'id' | 'views' | 'createdAt'>): Promise<Game> {
    const index = await this.getIndex();
    
    const newGame: Game = {
      ...gameData,
      id: index.nextId,
      views: 0,
      createdAt: new Date().toISOString()
    };

    const fileNumber = Math.ceil(index.nextId / GAMES_PER_FILE) || 1;
    const gameFile = await this.getGameFile(fileNumber);
    
    gameFile.games.push(newGame);
    gameFile.count = gameFile.games.length;
    
    await this.saveGameFile(fileNumber, gameFile);
    
    index.totalGames++;
    index.nextId++;
    
    if (fileNumber > index.lastFileNumber) {
      index.lastFileNumber = fileNumber;
      index.filesCount = fileNumber;
    }
    
    await this.updateIndex(index);
    
    return newGame;
  }

  async searchGames(options: {
    search?: string;
    category?: string;
    limit?: number;
    page?: number;
  } = {}): Promise<{ games: Game[]; totalCount: number; totalPages: number }> {
    const { search, category, limit = 12, page = 1 } = options;
    const index = await this.getIndex();
    
    let allGames: Game[] = [];
    
    for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
      const gameFile = await this.getGameFile(i);
      allGames = allGames.concat(gameFile.games);
    }
    
    let filteredGames = allGames;
    
    if (search) {
      filteredGames = filteredGames.filter(game =>
        game.title.toLowerCase().includes(search.toLowerCase()) ||
        game.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filteredGames = filteredGames.filter(game => game.category === category);
    }
    
    const totalCount = filteredGames.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const games = filteredGames.slice(startIndex, startIndex + limit);
    
    return { games, totalCount, totalPages };
  }

  async getGameById(id: number): Promise<Game | null> {
    const index = await this.getIndex();
    
    for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
      const gameFile = await this.getGameFile(i);
      const game = gameFile.games.find(g => g.id === id);
      if (game) return game;
    }
    
    return null;
  }

  async incrementViews(id: number): Promise<boolean> {
    const index = await this.getIndex();
    
    for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
      const gameFile = await this.getGameFile(i);
      const gameIndex = gameFile.games.findIndex(g => g.id === id);
      
      if (gameIndex !== -1) {
        gameFile.games[gameIndex].views = (gameFile.games[gameIndex].views || 0) + 1;
        await this.saveGameFile(i, gameFile);
        return true;
      }
    }
    
    return false;
  }

  async getTrendingGames(limit: number = 6): Promise<Game[]> {
    const index = await this.getIndex();
    let allGames: Game[] = [];
    
    for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
      const gameFile = await this.getGameFile(i);
      allGames = allGames.concat(gameFile.games);
    }
    
    return allGames
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }

  async updateGame(id: number, updates: Partial<Game>): Promise<Game | null> {
    const index = await this.getIndex();
    
    for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
      const gameFile = await this.getGameFile(i);
      const gameIndex = gameFile.games.findIndex(g => g.id === id);
      
      if (gameIndex !== -1) {
        gameFile.games[gameIndex] = { ...gameFile.games[gameIndex], ...updates };
        await this.saveGameFile(i, gameFile);
        return gameFile.games[gameIndex];
      }
    }
    
    return null;
  }

  async deleteGame(id: number): Promise<boolean> {
    const index = await this.getIndex();
    
    for (let i = 1; i <= (index.lastFileNumber || 1); i++) {
      const gameFile = await this.getGameFile(i);
      const gameIndex = gameFile.games.findIndex(g => g.id === id);
      
      if (gameIndex !== -1) {
        gameFile.games.splice(gameIndex, 1);
        gameFile.count = gameFile.games.length;
        await this.saveGameFile(i, gameFile);
        
        // تحديث العداد الإجمالي
        index.totalGames--;
        await this.updateIndex(index);
        
        return true;
      }
    }
    
    return false;
  }
}

export const githubDb = new GitHubDB();
export { type Game, type GameFile, type Index };