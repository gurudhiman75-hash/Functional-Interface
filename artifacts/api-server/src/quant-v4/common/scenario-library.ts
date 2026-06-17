import { Scenario } from './scenario-types';
import * as fs from 'fs';
import * as path from 'path';

export class ScenarioLibrary {
  private scenarios: Map<string, Scenario> = new Map();

  constructor(private libraryPath: string) {}

  public load(): void {
    if (!fs.existsSync(this.libraryPath)) return;
    
    const files = fs.readdirSync(this.libraryPath);
    for (const file of files) {
      if (file.endsWith('-scenario.json')) {
        const content = fs.readFileSync(path.join(this.libraryPath, file), 'utf-8');
        try {
          const scenario = JSON.parse(content) as Scenario;
          this.scenarios.set(scenario.id, scenario);
        } catch (e) {
          console.error(`Failed to load scenario: ${file}`, e);
        }
      }
    }
  }

  public getScenario(id: string): Scenario | undefined {
    return this.scenarios.get(id);
  }

  public getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }
}
