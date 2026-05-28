export class ModuleRepository {
  async health() {
    return { ready: true };
  }
}

