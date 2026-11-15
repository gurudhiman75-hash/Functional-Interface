/**
 * Per-revision, bounded in-process cache for expensive deterministic native
 * preview generation. Never stores translations/drafts or admin identity.
 * A warm GET still checks the current item version in the database.
 *
 * Cloud Run instances do not share this cache; correctness must never rely on
 * it being populated. Single-flight deduplicates concurrent expansions.
 */
export class NativeReviewSnapshotCache<T> {
  private readonly completed = new Map<string, {value:T;expires:number}>();
  private readonly pending = new Map<string, Promise<T>>();
  constructor(private readonly limit = 160, private readonly ttlMs = 20*60*1000) {}

  async getOrCreate(key:string, create:()=>Promise<T>):Promise<T> {
    const now=Date.now();
    const hit=this.completed.get(key);
    if(hit && hit.expires>now) {
      this.completed.delete(key);
      this.completed.set(key,hit);
      return hit.value;
    }
    if(hit) this.completed.delete(key);
    const pending=this.pending.get(key);
    if(pending) return pending;
    const task=Promise.resolve().then(create).then(value=>{
      this.completed.delete(key);
      this.completed.set(key,{value,expires:Date.now()+this.ttlMs});
      while(this.completed.size>this.limit){
        const oldest=this.completed.keys().next().value;
        if(oldest===undefined) break;
        this.completed.delete(oldest);
      }
      return value;
    }).finally(()=>{this.pending.delete(key);});
    this.pending.set(key,task);
    return task;
  }

  invalidate(key:string) {this.completed.delete(key);}
  get size(){return this.completed.size;}
}
