import { ScenarioLibrary } from './scenario-library';
import { Scenario } from './scenario-types';

export class ScenarioPicker {
  constructor(private library: ScenarioLibrary) {}

  public pickRandom(): Scenario {
    const scenarios = this.library.getAllScenarios();
    if (scenarios.length === 0) throw new Error("No scenarios available");
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  public pickByTag(tag: string): Scenario {
    const tagged = this.library.getAllScenarios().filter(s => s.tags.includes(tag));
    if (tagged.length === 0) throw new Error(`No scenarios with tag: ${tag}`);
    return tagged[Math.floor(Math.random() * tagged.length)];
  }
}
