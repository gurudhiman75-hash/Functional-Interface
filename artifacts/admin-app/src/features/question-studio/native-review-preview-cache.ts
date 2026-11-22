import { getQuestionStudioNativeReviewLocalizations, type NativeReviewLocalizations } from './api';

// In-tab cache. Keys contain the immutable English source version, so an
// English revision cannot reuse a stale generated Hindi/Punjabi preview.
// Never cache editorial drafts or approvals.
const maxEntries=80;
const maxConcurrentPrefetch=2;
const prefetching=new Set<string>();
const previews=new Map<string,Promise<NativeReviewLocalizations>>();
const key=(itemId:string,version:number)=>itemId+':'+version;

export function loadNativePreview(itemId:string,version:number,refresh=false) {
  const id=key(itemId,version);
  if(refresh) previews.delete(id);
  const existing=previews.get(id);
  if(existing) {
    previews.delete(id);
    previews.set(id,existing);
    return existing;
  }
  const task=getQuestionStudioNativeReviewLocalizations(itemId,version).catch(error=>{
    if(previews.get(id)===task) previews.delete(id);
    throw error;
  });
  previews.set(id,task);
  while(previews.size>maxEntries){
    const oldest=previews.keys().next().value;
    if(!oldest) break;
    previews.delete(oldest);
  }
  return task;
}
// Share the version-scoped request between the focused panel and bounded prefetch.
export function prefetchNativePreview(itemId:string,version:number) {
  const id=key(itemId,version);
  if(previews.has(id)||prefetching.has(id)||prefetching.size>=maxConcurrentPrefetch) return;
  prefetching.add(id);
  void loadNativePreview(itemId,version).catch(()=>{}).finally(()=>prefetching.delete(id));
}
export function invalidateNativePreview(itemId:string,version:number) {
  previews.delete(key(itemId,version));
}
